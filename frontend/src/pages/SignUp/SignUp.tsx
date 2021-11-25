import React, {useState} from 'react';
import Logo from '../../assets/logo.svg';
import TextFieldInput from '../../components/TextFieldInput';
import DropDownField from '../../components/DropDownField';
import {Languages} from '../../models/Enums';
import './Signup.scss';
import {UserRole, DietaryRestriction} from '../../models/Enums';

interface SignUpErrors {
  email: string;
  password: string;
  firstName: string;
  jobTitle: string;
  school: string;
  preferredLanguage: string;
}

interface SignUpProps {
  role: UserRole;
}

const SignUp: React.FC<SignUpProps> = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [language, setLanguage] = useState('');
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [school, setSchool] = useState('');
  const [headDelegateTitle, setHeadDelegateTitle] = useState('');

  const initalErrors = {
    email: '',
    password: '',
    firstName: '',
    jobTitle: '',
    school: '',
    preferredLanguage: '',
  };

  const [errors, setErrors] = useState<SignUpErrors>({...initalErrors});

  var languages: any = [];
  var dietaryRestrictions: any = [];

  const schools = [{value: 'UNIVERSITY OF CALGARY', label: 'Univeristy of Calgary'}]; // Should be retrived from db
  function enumKeys<E>(e: E): (keyof E)[] {
    return Object.keys(e) as (keyof E)[];
  }

  enumKeys(Languages).map(key => languages.push({value: Languages[key], label: key}));
  enumKeys(DietaryRestriction).map(key =>
    dietaryRestrictions.push({
      value: DietaryRestriction[key],
      label: DietaryRestriction[key].toLocaleLowerCase(),
    })
  );

  const validateData = () => {
    errors.email = initalErrors.email;
    errors.password = initalErrors.password;
    errors.firstName = initalErrors.firstName;
    errors.jobTitle = initalErrors.jobTitle;
    errors.school = initalErrors.school;
    errors.preferredLanguage = initalErrors.preferredLanguage;
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

    if (!firstName) {
      errors.firstName = 'Please enter a first name.';
    }

    if (!language) {
      errors.preferredLanguage = 'Please select a language.';
    }

    if ((props.role == UserRole.Delegate || props.role == UserRole.HeadDelegate) && !school) {
      errors.school = 'Please select school.';
    }

    if (props.role == UserRole.HeadDelegate && !headDelegateTitle) {
      errors.jobTitle = 'Please enter a job tilte.';
    }

    setErrors({...errors});
  };

  const sumbitSignUp = () => {
    validateData();
    // handle API calls
  };

  return (
    <div className="signup-page-container">
        <div style={{margin: '30px 0px'}}> {/* not sure why it does not work in scss?? */}
      <div className="inner-signup-page-container">
        <div className="signup-left-logo-container">
          <img className="signup-logo-image" src={Logo} />
        </div>
        <div className="signup-form-container" style={{margin: 'auto'}}>
          <div className="signup-inputs-container">
            <h2>Register</h2>
            <TextFieldInput
              placeHolder="Enter Your Email"
              input={email}
              setInput={setEmail}
              isPassword={false}
              error={errors.email}
            />
            <TextFieldInput
              placeHolder="Enter Your First Name"
              input={firstName}
              setInput={setFirstName}
              isPassword={false}
              error={errors.firstName}
            />
            <TextFieldInput
              placeHolder="Enter Your Middle Name"
              input={middleName}
              setInput={setMiddleName}
              isPassword={false}
            />
            <TextFieldInput
              placeHolder="Enter Your Last Name"
              input={lastName}
              setInput={setLastName}
              isPassword={false}
            />
            <TextFieldInput
              placeHolder="Enter Your Password"
              input={password}
              setInput={setPassword}
              isPassword={true}
              error={errors.password}
            />
            <TextFieldInput
              placeHolder="Enter Your Pronouns"
              input={pronouns}
              setInput={setPronouns}
              isPassword={false}
            />
            {(props.role == UserRole.Delegate || props.role == UserRole.HeadDelegate) && (
              <DropDownField
                placeHolder="Select Your School"
                input={school}
                setInput={setSchool}
                options={schools}
                error={errors.school}
              />
            )}
            {props.role == UserRole.HeadDelegate && (
              <TextFieldInput
                placeHolder="Enter Your Job Tile"
                input={headDelegateTitle}
                setInput={setHeadDelegateTitle}
                isPassword={false}
                error={errors.jobTitle}
              />
            )}
            <DropDownField
              placeHolder="Select Your Preferred Language"
              input={language}
              setInput={setLanguage}
              options={languages}
              error={errors.preferredLanguage}
            />
            <DropDownField
              placeHolder="Select Your Dietary Restriction"
              input={dietaryRestriction}
              setInput={setDietaryRestriction}
              options={dietaryRestrictions}
            />
            <button className="signup-submit-button" onClick={sumbitSignUp}>
              signup
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SignUp;
