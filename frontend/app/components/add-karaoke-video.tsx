"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// The mutation now expects userId to be returned along with other fields.
const ADD_KARAOKE_MUTATION = `
  mutation AddKaraoke($userId: ID!, $song_name: String!, $artist: String!, $youtube_link: String!) {
    addKaraoke(userId: $userId, song_name: $song_name, artist: $artist, youtube_link: $youtube_link) {
      userId
      song_name
      artist
      youtube_link
    }
  }
`;

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function AddKaraoke() {
  const [formData, setFormData] = useState({
    userId: "",
    song_name: "",
    artist: "",
    youtube_link: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: {
      userId: string;
      song_name: string;
      artist: string;
      youtube_link: string;
    }) => {
      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: ADD_KARAOKE_MUTATION,
            variables,
          }),
        }
      );
      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      return data.data.addKaraoke;
    },
    onSuccess: (data) => {
      toast.success(`Karaoke video added: ${data.song_name}`);
      setFormData({
        userId: "",
        song_name: "",
        artist: "",
        youtube_link: "",
      });
    },
    onError: (error: Error) => {
      toast.error("Error adding karaoke video: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractYouTubeVideoId(formData.youtube_link);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }
    if (!formData.userId || !formData.song_name || !formData.artist) {
      toast.error("Please fill in all fields");
      return;
    }
    mutate({
      userId: formData.userId,
      song_name: formData.song_name,
      artist: formData.artist,
      youtube_link: videoId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="userId">User ID</Label>
        <Input
          id="userId"
          value={formData.userId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, userId: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="song_name">Song Name</Label>
        <Input
          id="song_name"
          value={formData.song_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, song_name: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="artist">Artist</Label>
        <Input
          id="artist"
          value={formData.artist}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, artist: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="youtube_link">YouTube Link</Label>
        <Input
          id="youtube_link"
          placeholder="e.g., https://www.youtube.com/watch?v=abc123"
          value={formData.youtube_link}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, youtube_link: e.target.value }))
          }
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add Karaoke"}
      </Button>
    </form>
  );
}