"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import YouTube, { YouTubeProps } from "react-youtube";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NEXT_KARAOKE_QUERY = `
  query NextKaraoke {
    nextKaraoke {
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
  youtube_link: string; // Expected to be the YouTube video ID
}

export default function DisplayKaraoke() {
  // State to keep track of the list of karaoke videos and the current index
  const [karaokeQueue, setKaraokeQueue] = useState<Karaoke[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Fetch function to get the next karaoke video
  const fetchNextKaraoke = async (): Promise<Karaoke> => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: NEXT_KARAOKE_QUERY,
        variables: {},
      }),
    });
    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    return result.data.nextKaraoke as Karaoke;
  };

  // React Query to manage fetching
  const { refetch, isFetching, error } = useQuery<Karaoke, Error>({
    queryKey: ["nextKaraoke"],
    queryFn: fetchNextKaraoke,
    enabled: false, // We'll control when to fetch
  });

  // Load the first karaoke video on mount
  useEffect(() => {
    loadNextKaraoke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to load the next karaoke video
  const loadNextKaraoke = () => {
    refetch().then((result) => {
      if (result.data) {
        setKaraokeQueue((prevQueue) => [...prevQueue, result.data]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        toast("No more karaoke videos available.", { icon: "ℹ️" });
      }
    });
  };

  // Function to go back to the previous karaoke video
  const loadPreviousKaraoke = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      toast("This is the first video.", { icon: "ℹ️" });
    }
  };

  // Callback fired when the YouTube video ends.
  const onVideoEnd: YouTubeProps["onEnd"] = () => {
    toast("Video ended, loading next video...", { icon: "⏭️" });
    loadNextKaraoke();
  };

  // Options for react-youtube player
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  // Get the current karaoke based on the currentIndex
  const currentKaraoke = karaokeQueue[currentIndex];

  return (
    <div className="flex space-x-4">
      {/* Left side: Video player and controls */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
        {isFetching && <div>Loading karaoke video...</div>}
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
          !isFetching && <div>No karaoke video available.</div>
        )}
      </div>

      {/* Right side: Karaoke queue */}
      <div className="w-1/3">
        <h2 className="text-2xl font-bold mb-4">Karaoke Queue</h2>
        <div className="space-y-2">
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
