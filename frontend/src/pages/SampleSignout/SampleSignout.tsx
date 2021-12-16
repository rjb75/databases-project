import React from 'react';
import axiosInstance from '../../axios';
import {useNavigate} from 'react-router-dom';
import {ROOT_V1} from '../../utils/APIConstants';
import {useTypedSelector} from '../../hooks/reduxHooks';
import {selectUserData} from '../../actions/userActions/userSelectors';
import Navbar from '../../components/Navbar';

const SampleSignout: React.FC = () => {
  const navigate = useNavigate();
  const userData = useTypedSelector(selectUserData);

  const signOut = () => {
    axiosInstance
      .post(`${ROOT_V1}/signout`)
      .then(res => {
        navigate('/');
        console.log('signout response: ', res);
      })
      .catch(err => console.log('signout error: ', err));
  };

  const getPersons = () => {
    axiosInstance
      .get(`${ROOT_V1}/persons`)
      .then(res => {
        console.log('get persons response: ', res);
      })
      .catch(err => console.log('get persons error: ', err));
  };
  return (
    <div>
      <Navbar />
      <button onClick={signOut}>Sign Out</button>
      <button onClick={getPersons}>Get Persons</button>
      <div>userInfo: {JSON.stringify(userData)}</div>
    </div>
  );
};

export default SampleSignout;
