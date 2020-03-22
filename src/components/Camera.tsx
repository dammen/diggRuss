import React, { useRef, FunctionComponent, useEffect } from 'react';
import { useUserMedia } from '../helpers/useUserMedia';
import { CaptureOptions } from './Video';

const CAPTURE_OPTIONS:CaptureOptions = {
    video: {
        width: { min: 160, ideal: 640, max: 1280 },
        height: { min: 120, ideal: 360, max: 720 }
        },
        audio: true
};

export const Camera:FunctionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useUserMedia(CAPTURE_OPTIONS);

  useEffect(() => {
      console.log(mediaStream)
        if(mediaStream && videoRef && videoRef.current && !videoRef.current.srcObject){
            videoRef.current.srcObject = mediaStream
        }
   
  }, [mediaStream, videoRef])

  function handleCanPlay() {
      if (videoRef && videoRef.current){
        videoRef.current.play();

      }
  }

  return (
    <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
  );
}