import Peer from 'simple-peer'

export default class VideoCall {
    peer: Peer.Instance = new Peer()
    init = (stream:MediaStream | null, initiator:boolean): Peer.Instance => {
        this.peer = new Peer({
            initiator: initiator,
            stream: stream ? stream : undefined,
            trickle: false,
            reconnectTimer: 1000,
            config: {
                iceServers: [
                    { urls: process.env.REACT_APP_STUN_SERVERS && process.env.REACT_APP_STUN_SERVERS.split(',') },
                   /*  {
                        urls: process.env.REACT_APP_TURN_SERVERS && process.env.REACT_APP_TURN_SERVERS.split(','),
                        username: process.env.REACT_APP_TURN_USERNAME,
                        credential: process.env.REACT_APP_TURN_CREDENCIAL
                    }, */
                ]
            }
        }) 
        return this.peer
    }
    connect = (otherId:string) => {
        this.peer.signal(otherId)
    }  
} 