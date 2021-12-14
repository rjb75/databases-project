import React, {useState} from 'react';
import LoginBackground from '../../assets/loginFormBackground.svg';
import Logo from '../../assets/logo.svg';
import TextFieldInput from '../../components/TextFieldInput';
import './Login.scss';
import axiosInstance from '../../axios';
import {useNavigate} from 'react-router-dom';
import {ROOT_V1} from '../../utils/APIConstants';
import {useTypedDispatch} from '../../hooks/reduxHooks';
import {usersLoggedIn} from '../../actions/userActions/userActionCreator';

interface LogInErrors {
  email: string;
  password: string;
}

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LogInErrors>({
    email: '',
    password: '',
  });

  const validateData = () => {
    errors.email = '';
    errors.password = '';
    if (!email) {
      errors.email = 'Please enter an email.';
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
    ) {
      errors.email = 'Please enter a valid email.';
    }

    if (!password) {
      errors.password = 'Please enter a password.';
    }

    setErrors({...errors});
  };

  const sumbitLogin = () => {
    validateData();
    axiosInstance
      .post(`${ROOT_V1}/login`, {
        Email: email,
        Password: password,
      })
      .then(res => {
        navigate('/main');
        console.log('login response: ', res);
        dispatch(usersLoggedIn(res.data.data));
      })
      .catch(err => console.log('login error: ', err));
  };
  return (
    <div className="login-page-container">
      <div style={{margin: '30px 0px'}}>
        {' '}
        {/* not sure why it does not work in scss?? */}
        <div className="inner-login-page-container">
          <div className="login-left-logo-container">
            <img className="login-logo-image" src={Logo} />
          </div>
          <div className="login-form-container" style={{margin: 'auto'}}>
            <div className="login-header">
              <h3>{new Date().toLocaleString('default', {month: 'long'})}</h3>
            </div>
            <div>
              <img className="login-image" src={LoginBackground} />
            </div>
            <div className="login-inputs-container">
              <h2>sign in</h2>
              <TextFieldInput
                placeHolder="Enter Your Email"
                input={email}
                setInput={setEmail}
                isPassword={false}
                error={errors.email}
              />
              <TextFieldInput
                placeHolder="Enter Your Password"
                input={password}
                setInput={setPassword}
                isPassword={true}
                error={errors.password}
              />

              <div className="login-redirect-container">
                <span className="login-redirect-link" onClick={() => navigate('/signup')}>
                  Need an Account?
                </span>
                <a className="login-redirect-link" href="#">
                  Forgot Your Password?
                </a>
              </div>
              <button className="login-submit-button" onClick={sumbitLogin}>
                login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
