"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  const [debugInfo, setDebugInfo] = useState({
    query: ADD_KARAOKE_MUTATION,
    variables: {},
    response: null,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: {
      userId: string;
      song_name: string;
      artist: string;
      youtube_link: string;
    }) => {
      const queryBody = {
        query: ADD_KARAOKE_MUTATION,
        variables,
      };

      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryBody),
        }
      );

      const data = await response.json();

      // Store debug information
      setDebugInfo({
        query: ADD_KARAOKE_MUTATION,
        variables,
        response: data,
      });

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      return data.data.addKaraoke;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["karaokeVideos"] });
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
    <div className="space-y-6">
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

      {/* Debug Panel */}
      <Card className="p-4">
        <Accordion type="single" defaultValue="debug">
          <AccordionItem value="debug">
            <AccordionTrigger className="font-semibold">
              GraphQL Debug Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">GraphQL Mutation:</h3>
                  <div className="space-y-2">
                    <div className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto max-h-[400px]">
                      <pre className="text-sm font-mono whitespace-pre">{debugInfo.query}</pre>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mt-2">Variables:</h4>
                      <pre className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto mt-1 text-sm font-mono">
                        {JSON.stringify(debugInfo.variables, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">API Response:</h3>
                  <pre className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto max-h-[400px] text-sm font-mono mt-4">
                    {JSON.stringify(debugInfo.response, null, 2)}
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}