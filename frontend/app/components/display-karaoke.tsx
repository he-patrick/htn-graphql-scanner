"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import YouTube, { YouTubeProps } from "react-youtube";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GET_KARAOKES_QUERY = `
  query GetKaraokes {
    karaokes {
      karaokeId
      song_name
      artist
      youtube_link
    }
  }
`;

const GRAPHQL_ENDPOINT =
  "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge";

interface Karaoke {
  karaokeId: string;
  song_name: string;
  artist: string;
  youtube_link: string;
}

export default function DisplayKaraoke() {
  const [karaokeQueue, setKaraokeQueue] = useState<Karaoke[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { data, isLoading, error } = useQuery<Karaoke[], Error>({
    queryKey: ["karaokes"],
    queryFn: async () => {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GET_KARAOKES_QUERY,
          variables: {},
        }),
      });
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data.karaokes as Karaoke[];
    },
  });

  useEffect(() => {
    if (data) {
      setKaraokeQueue(data);
      setCurrentIndex(0);
    }
  }, [data]);

  const loadNextKaraoke = () => {
    if (currentIndex < karaokeQueue.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      toast("No more karaoke videos available.", { icon: "ℹ️" });
    }
  };

  const loadPreviousKaraoke = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      toast("This is the first video.", { icon: "ℹ️" });
    }
  };

  const onVideoEnd: YouTubeProps["onEnd"] = () => {
    toast("Video ended, loading next video...", { icon: "⏭️" });
    loadNextKaraoke();
  };

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  const currentKaraoke = karaokeQueue[currentIndex];

  return (
    <div className="flex space-x-4">
      {/* Left side: Video player and controls */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
        {isLoading && <div>Loading karaoke videos...</div>}
        {error && <div>Error: {error.message}</div>}
        {currentKaraoke ? (
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Song:</strong> {currentKaraoke.song_name}
            </p>
            <p className="text-lg">
              <strong>Artist:</strong> {currentKaraoke.artist}
            </p>
            <YouTube
              videoId={currentKaraoke.youtube_link}
              opts={opts}
              onEnd={onVideoEnd}
            />
            <div className="flex space-x-2">
              <Button onClick={loadPreviousKaraoke} disabled={currentIndex <= 0}>
                Previous
              </Button>
              <Button onClick={loadNextKaraoke}>Next</Button>
            </div>
          </div>
        ) : (
          !isLoading && <div>No karaoke video available.</div>
        )}
      </div>

      {/* Right side: Karaoke queue */}
      <div className="w-1/3">
        <h2 className="text-2xl font-bold mb-4">Karaoke Queue</h2>
        <div className="space-y-2 overflow-y-auto max-h-screen">
          {karaokeQueue.length > 0 ? (
            karaokeQueue.map((karaoke, index) => (
              <div
                key={karaoke.karaokeId}
                className={`p-2 rounded-md ${
                  index === currentIndex
                    ? "bg-blue-100 dark:bg-blue-800"
                    : index < currentIndex
                    ? "text-gray-500"
                    : "text-black dark:text-white"
                }`}
              >
                <p className="font-semibold">
                  {karaoke.song_name} - {karaoke.artist}
                </p>
                {index === currentIndex && <p className="text-sm">Now Playing</p>}
              </div>
            ))
          ) : (
            <p>No songs in the queue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
