import React from 'react';
import {Provider} from 'react-redux';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import {store} from './store';
import LogIn from './pages/Login/Login';
import SampleSignout from './pages/SampleSignout/SampleSignout';

import './styles/Main.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/main" element={<SampleSignout />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
