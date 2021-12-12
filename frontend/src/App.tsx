import React from 'react';
import {Provider} from 'react-redux';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import {store} from './store';
import LogIn from './pages/Login/Login';
import SampleSignout from './pages/SampleSignout/SampleSignout';
import RoleSelection from './pages/RoleSelection/RoleSelection';
import SignUp from './pages/SignUp/SignUp';
import FormBuilder from './components/FormBuilder';
import FormGenerator from './components/FormGenerator';

import './styles/Main.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<FormBuilder />} />
          <Route path="/form" element={<FormGenerator formContent=''/>} />
          <Route path="/form-builder" element={<FormBuilder />} />
          <Route path="/main" element={<SampleSignout />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
