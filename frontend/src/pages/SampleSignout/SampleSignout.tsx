import React from 'react';
import axiosInstance from '../../axios';
import {useNavigate} from 'react-router-dom';

const SampleSignout: React.FC = () => {
  const navigate = useNavigate();

  const signOut = () => {
    axiosInstance
      .post('api/v1/signout')
      .then(res => {
        navigate('/');
        console.log('signout response: ', res);
      })
      .catch(err => console.log('signout error: ', err));
  };

  const getPersons = () => {
    axiosInstance
      .get('/api/v1/persons')
      .then(res => {
        console.log('get persons response: ', res);
      })
      .catch(err => console.log('get persons error: ', err));
  };
  return (
    <div>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={getPersons}>Get Persons</button>
    </div>
  );
};

export default SampleSignout;
