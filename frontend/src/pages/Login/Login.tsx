import React, {useState} from 'react';
import LoginBackground from '../../assets/loginFormBackground.svg';
import Logo from '../../assets/logo.svg';
import TextFieldInput from '../../components/TextFieldInput';
import './Login.scss';

interface LogInProps {}

const LogIn: React.FC<LogInProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="login-page-container">
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
          />
          <TextFieldInput
            placeHolder="Enter Your Password"
            input={password}
            setInput={setPassword}
            isPassword={true}
          />

          <div className="login-redirect-container">
            <a className="login-redirect-link" href="#">
              Need an Account?
            </a>
            <a className="login-redirect-link" href="#">
              Forgot Your Password?
            </a>
          </div>
          <button className="login-submit-button">login</button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LogIn;
