import React, { FunctionComponent } from 'react';
import {Video} from './components/Video'
import './App.css';
import './styles/video.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GoToRoomInput } from './components/GoToRoomInput';
export const App: FunctionComponent = () => {

  return (<>
      <BrowserRouter>
          <Switch>
              <Route path="/" exact component={GoToRoomInput}/>

              <Route path="/:roomId" exact component={Video}/>

          </Switch>
      </BrowserRouter>
      </>
    )
};

