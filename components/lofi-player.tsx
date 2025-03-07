"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Moon,
  Coffee,
  CloudRain,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import StationCard from "./station-card";
import VisualEffect from "./visual-effect";

// Lo-fi stations data
const stations = [
  {
    id: "chillhop",
    name: "Chillhop",
    description: "The best of chill hip hop beats",
    url: "https://radio.nia.nc/radio/8020/lofi-hq-stream.aac",
    color: "bg-amber-500",
  },
  {
    id: "lofi-girl",
    name: "Lofi Girl",
    description: "Beats to relax/study to",
    url: "https://play.streamafrica.net/lofiradio",
    color: "bg-purple-500",
  },
  {
    id: "jazz-vibes",
    name: "Jazz Vibes",
    description: "Smooth jazz with lo-fi elements",
    url: "http://stream.zeno.fm/3u1qndyk8rhvv",
    color: "bg-blue-500",
  },
  {
    id: "sleep",
    name: "Sleep Sounds",
    description: "Ambient sounds for deep sleep",
    url: "https://streaming.radio.co/s5c5da6a36/listen",
    color: "bg-indigo-500",
  },
  {
    id: "nature",
    name: "Nature Lofi",
    description: "Natural sounds with gentle beats",
    url: "https://stream.zeno.fm/uwgpqwmg0tzuv",
    color: "bg-emerald-500",
  },
  {
    id: "focus",
    name: "Focus Beats",
    description: "Concentration-enhancing rhythms",
    url: "http://usa9.fastcast4u.com/proxy/jamz?mp=/1",
    color: "bg-rose-500",
  },
];

// Mood presets
const moods = [
  { id: "study", name: "Study", icon: <Coffee className="h-4 w-4" /> },
  { id: "sleep", name: "Sleep", icon: <Moon className="h-4 w-4" /> },
  { id: "rain", name: "Rainy", icon: <CloudRain className="h-4 w-4" /> },
  { id: "ocean", name: "Ocean", icon: <Waves className="h-4 w-4" /> },
];

export default function LofiPlayer() {
  const [currentStation, setCurrentStation] = useState(stations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMood, setCurrentMood] = useState("study");
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Only create the audio element on the client side
    if (typeof window !== "undefined") {
      if (!audioRef.current) {
        const audio = new Audio();
        audio.preload = "auto";
        audio.src = currentStation.url;

        // Try to load the audio
        try {
          audio.load();
        } catch (e) {
          console.error("Error loading initial audio:", e);
        }

        audio.volume = volume / 100;

        // Simpler error handling
        audio.onerror = (e) => {
          console.error("Audio error:", e);
          setIsPlaying(false);
        };

        audioRef.current = audio;
        setAudioElement(audio);
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [currentStation.url, volume]);

  // Handle station change
  const changeStation = (station: (typeof stations)[0]) => {
    setCurrentStation(station);
    if (audioRef.current) {
      // Stop current audio
      audioRef.current.pause();

      // Set new source
      audioRef.current.src = station.url;

      // Explicitly tell the audio to load
      try {
        audioRef.current.load();
      } catch (e) {
        console.error("Error loading audio:", e);
      }

      // Use the canplay event to play the audio once it's ready
      const handleCanPlay = () => {
        // Remove the event listener to avoid duplicate calls
        audioRef.current?.removeEventListener("canplay", handleCanPlay);

        // Play the audio
        const playPromise = audioRef.current?.play();
        setIsPlaying(true);

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Play error:", error);
            // Only update play state for actual failures, not user interruptions
            if (
              error.name !== "AbortError" &&
              error.name !== "NotAllowedError"
            ) {
              setIsPlaying(false);
            }
          });
        }
      };

      // Listen for the canplay event
      audioRef.current.addEventListener("canplay", handleCanPlay);

      // Set a backup timeout in case canplay doesn't fire
      const timeoutId = setTimeout(() => {
        // If canplay hasn't fired, try to play anyway
        if (audioRef.current) {
          audioRef.current.removeEventListener("canplay", handleCanPlay);
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Backup play error:", error);
              if (
                error.name !== "AbortError" &&
                error.name !== "NotAllowedError"
              ) {
                setIsPlaying(false);
              }
            });
        }
      }, 2000);

      // Cleanup function in case component unmounts
      const cleanup = () => {
        clearTimeout(timeoutId);
        audioRef.current?.removeEventListener("canplay", handleCanPlay);
      };

      // Add to cleanup queue
      setTimeout(cleanup, 5000);
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Play error:", error);
            // Don't show alerts for user interactions
            if (
              error.name !== "AbortError" &&
              error.name !== "NotAllowedError"
            ) {
              setIsPlaying(false);
            }
          });
        }
        setIsPlaying(true);
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-between p-4 md:p-8 transition-all duration-500",
        currentMood === "study" &&
          "bg-gradient-to-br from-amber-900/90 to-slate-900",
        currentMood === "sleep" &&
          "bg-gradient-to-br from-indigo-900/90 to-slate-900",
        currentMood === "rain" &&
          "bg-gradient-to-br from-blue-900/90 to-slate-900",
        currentMood === "ocean" &&
          "bg-gradient-to-br from-cyan-900/90 to-slate-900"
      )}
    >
      <VisualEffect mood={currentMood} />

      <div className="w-full max-w-4xl mx-auto z-10">
        <header className="flex flex-col items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Chill Waves
          </h1>
          <p className="text-slate-300 text-center">
            Relax, focus, and unwind with lo-fi beats
          </p>
        </header>

        <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-xl border border-white/10">
          <Tabs defaultValue="stations" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="stations">Stations</TabsTrigger>
              <TabsTrigger value="moods">Moods</TabsTrigger>
            </TabsList>

            <TabsContent value="stations" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stations.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    isActive={currentStation.id === station.id}
                    isPlaying={isPlaying && currentStation.id === station.id}
                    onClick={() => changeStation(station)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="moods" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {moods.map((mood) => (
                  <Button
                    key={mood.id}
                    variant={currentMood === mood.id ? "default" : "outline"}
                    className={cn(
                      "h-24 flex flex-col gap-2",
                      currentMood === mood.id
                        ? "border-2 border-white/20"
                        : "border border-white/10"
                    )}
                    onClick={() => setCurrentMood(mood.id)}
                  >
                    {mood.icon}
                    <span>{mood.name}</span>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-slate-400 text-center pt-2">
                Choose a mood to change the visual atmosphere
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 p-4 z-20">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white"
                onClick={() => {
                  const currentIndex = stations.findIndex(
                    (s) => s.id === currentStation.id
                  );
                  const nextIndex = (currentIndex + 1) % stations.length;
                  changeStation(stations[nextIndex]);
                }}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 px-2">
              <div className="text-white text-center sm:text-left mb-1 font-medium">
                {currentStation.name}
                <span className="text-slate-400 text-sm ml-2">
                  {isPlaying ? "Now Playing" : "Paused"}
                </span>
              </div>
              <div className="text-slate-400 text-sm text-center sm:text-left">
                {currentStation.description}
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-[140px]">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                defaultValue={[volume]}
                max={100}
                step={1}
                className="w-24"
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
