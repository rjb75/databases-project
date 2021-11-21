import * as React from 'react';
import {App} from './App';
import './styles/Main.scss';
import LogIn from './pages/Login/Login';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';

export interface IMainProps {
  app: App; // Reference to our App.ts class
}

export class Main extends React.Component<IMainProps> {
  constructor(props: IMainProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LogIn />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
