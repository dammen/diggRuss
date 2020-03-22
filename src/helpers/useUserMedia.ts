import { useState, useEffect } from "react";
import {CaptureOptions} from "../components/Video"
export function useUserMedia(requestedMedia: CaptureOptions) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const media = navigator.mediaDevices;
  useEffect(() => {
    async function enableStream() {
      try {
        if (media){
            const stream = await media.getUserMedia(requestedMedia);
            setMediaStream(stream);
        } else {
          console.log("no media")
        }
      } catch(err) {
            console.error(err)
      }
    }
        
    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }
  }, [mediaStream, requestedMedia, media]);

  return mediaStream;
}