import React from 'react';
import {Provider} from 'react-redux';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import {store} from './store';
import LogIn from './pages/Login/Login';
import SampleSignout from './pages/SampleSignout/SampleSignout';
import RoleSelection from './pages/RoleSelection/RoleSelection';
import FormBuilder from './components/Forms/FormBuilder';
import FormGenerator from './components/Forms/FormGenerator';
import FormViewer from './components/Forms/FormViewer';
import OrganizerFormTable from './pages/OrganizerFormTable/OrganizerFormTable';
import FormCards from './pages/FormCards/FormCards';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './store';

import './styles/Main.scss';
import TextAjax from './components/TestAjax';
import SessionsPage from './pages/Sessions/SessionsPage';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/signup" element={<RoleSelection />} />
            <Route path="/organizer-form-table" element={<OrganizerFormTable />} />
            <Route path="/form-cards" element={<FormCards />} />
            <Route path="/form" element={<FormGenerator formContent="" />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/view-form-submission" element={<FormViewer />} />
            <Route path="/main" element={<SampleSignout />} />
            <Route path="/test" element={<TextAjax />} />
            <Route path="/sessions" element={<SessionsPage />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
