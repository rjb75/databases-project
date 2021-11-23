import React from "react";
import { Provider } from "react-redux";
import TestComponent from "./components/TestComponent";
import { store } from "./store";
import './styles/Main.scss'
import LogIn from './pages/Login/Login';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
