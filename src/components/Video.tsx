import React, {useEffect, FunctionComponent, useState, useRef, useCallback} from 'react';
import VideoCall from '../helpers/simple-peer';
import '../styles/video.css';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { RouteComponentProps } from 'react-router-dom';
import { useUserMedia } from '../helpers/useUserMedia';
export interface CaptureOptions {
    video: {
        width: {
            min: number;
            ideal: number;
            max: number;
        };
        height: {
            min: number;
            ideal: number;
            max: number;
        };
    };
    audio: boolean;
}
const CAPTURE_OPTIONS:CaptureOptions = {
    video: {
        width: { min: 160, ideal: 640, max: 1280 },
        height: { min: 120, ideal: 360, max: 720 }
        },
        audio: true
};
type Props = RouteComponentProps<{roomId:string}> ;
console.log(process.env)
export const Video: FunctionComponent<Props> = props => {
    const localMediaStream = useUserMedia(CAPTURE_OPTIONS);
    const  [initiator, setinitiator] = useState(false)
    const  [peer,setpeer] = useState<Peer.Instance | null>(null)
    const  [full, setfull] = useState(false)
    const  [connecting, setconnecting] = useState(false)
    const  [waiting, setwaiting] = useState(true)
    const  [socket, setsocket] = useState<SocketIOClient.Socket | null>(null)
    const  [roomId] = useState<string>(props.match.params.roomId);
    const  localVideoRef=  useRef<HTMLVideoElement>(null);
    const  remoteVideoRef = useRef<HTMLVideoElement>(null);
    const uri = process.env.REACT_APP_SIGNALING_SERVER;
    const  videoCall = new VideoCall()

    useEffect(() => {
          if(localMediaStream && localVideoRef && localVideoRef.current && !localVideoRef.current.srcObject){
              localVideoRef.current.srcObject = localMediaStream
          }
    }, [localMediaStream, localVideoRef])


    const enter = useCallback((roomId:string) => {
        setconnecting(true);
        console.log("entering room")
        console.log(initiator)
        console.log("setting peer")
        const tempPeer: Peer.Instance | null = videoCall.init(
            localMediaStream,
            initiator
        );
        if (tempPeer){
            tempPeer.on('signal', data => {
                const signal = {
                    room: roomId,
                    desc: data
                };
                console.log("SIGNAL")
                socket && socket.emit('signal', signal);
            });
    
            tempPeer.on('stream', stream => {
                console.log("stream")
                if(remoteVideoRef && remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
                    console.log("Setting upload stream")
                    remoteVideoRef.current.srcObject = stream
                    setconnecting(false);
                    setwaiting(false);
                }
            });
            
            tempPeer.on('error', (err: Error) => {
                console.log(err);
            });
            setpeer(tempPeer)
        }
        
    }, [localMediaStream, initiator, socket, videoCall]);

    const renderFull = () => {
        if (full) {
        return 'The room is full';
        }
    };

    useEffect(() : void => {
        if (uri && !socket && localMediaStream) {
            console.log("setting socket")
            const tempSocket = io(uri);
            console.log(tempSocket)
            tempSocket.emit('join', { roomId: roomId });
            tempSocket.on('init', () => {
                console.log("initialising socket connection")
                setinitiator(true) 
            });
            tempSocket.on('ready', () => {
                console.log("socket ready ")
                enter(roomId)
            });
            tempSocket.on('desc', (data:any) => {
                if (data.type === 'offer' && initiator) return;
                if (data.type === 'answer' && !initiator) return;
                console.log("DESC")
                videoCall.connect(data);
            });
            tempSocket.on('disconnected', () => {
                setinitiator(true) 
            });
            tempSocket.on('full', () => {
                setfull(true)
            });
            setsocket(tempSocket)

        }
       
    }, [uri, initiator, roomId, enter, socket, localMediaStream, videoCall])

    return (
      <div className='video-wrapper'>
        <div className='local-video-wrapper'>
          <video
            autoPlay
            id='localVideo'
            muted
            ref={localVideoRef}
          />
        </div>
        <video
          autoPlay
          className={`${
            connecting || waiting ? 'hide' : ''
          }`}
          id='remoteVideo'
          ref={remoteVideoRef}
        />       
        {connecting && (
          <div className='status'>
            <p>Establishing connection...</p>
          </div>
        )}
        {waiting && (
          <div className='status'>
            <p>Waiting for someone...</p>
          </div>
        )}
        {renderFull()}
      </div>
    );
}

