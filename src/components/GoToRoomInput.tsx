import React, { useState, FunctionComponent } from 'react'
import { Redirect } from 'react-router-dom';
import shortId from 'shortid'
import {Camera} from "./Camera"

export const GoToRoomInput:FunctionComponent = ()  => {
  let [roomId, setRoomId] = useState(shortId.generate());
  let [redirect, setRedirect] = useState(false)
  return (
      <div className="enter-room-container">
          <input type="text" value={roomId} placeholder="Room id" onChange={(event) => {
            setRoomId(event.target.value)
          }}/>
          <button onClick={() => { setRedirect(true)
          }
          }>Enter</button>
          <Camera></Camera>
          {redirect && <Redirect to={`/${roomId}`} />}
      </div>)
}