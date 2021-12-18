import React, {useState, useEffect} from 'react';
import Logo from '../../assets/logo.svg';
import TextFieldInput from '../../components/InputFields/TextFieldInput';
import DropDownField from '../../components/InputFields/DropDownField';
import {Languages} from '../../models/Enums';
import './SignUp.scss';
import {UserRole, DietaryRestriction} from '../../models/Enums';
import axiosInstance from '../../axios';
import {useNavigate} from 'react-router-dom';
import Modal from 'react-modal';

interface SignUpErrors {
  email: string;
  password: string;
  firstName: string;
  jobTitle: string;
  school: string;
  preferredLanguage: string;
}

interface SchoolErrors {
  name: string;
  country: string;
  streetAddress: string;
  capacity: string;
}

interface SignUpProps {
  role: UserRole;
}

interface School {
  Id: string;
  Name: string;
  Country: string;
  Province: string;
  Street_address: string;
  Postal_code: string;
}

const SignUp: React.FC<SignUpProps> = props => {
  Modal.setAppElement('#root');
  const [allSchools, setAllSchools] = useState<Array<School>>([]);
  const navigate = useNavigate();
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCapacity, setNewSchoolCapacity] = useState('');
  const [newSchoolCountry, setNewSchoolCountry] = useState('');
  const [newSchoolProvince, setNewSchoolProvince] = useState('');
  const [newSchoolStreet, setNewSchoolStreet] = useState('');
  const [newSchoolPostalCode, setNewSchoolPostalCode] = useState('');

  const initalSignupErrors = {
    email: '',
    password: '',
    firstName: '',
    jobTitle: '',
    school: '',
    preferredLanguage: '',
  };

  const initalSchoolErrors = {
    name: '',
    country: '',
    streetAddress: '',
    capacity: '',
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const [signupErrors, setSignupErrors] = useState<SignUpErrors>({...initalSignupErrors});
  const [schoolErrors, setSchoolErrors] = useState<SchoolErrors>({...initalSchoolErrors});

  var languages: any = [];
  var dietaryRestrictions: any = [];

  const schools = allSchools.map(s => ({value: s.Id, label: s.Name}));
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

  const handleClose = () => {
    setDialogOpen(false);
    schoolErrors.name = initalSchoolErrors.name;
    schoolErrors.country = initalSchoolErrors.country;
    schoolErrors.capacity = initalSchoolErrors.capacity;
    schoolErrors.streetAddress = initalSchoolErrors.streetAddress;
    setNewSchoolName('');
    setNewSchoolCapacity('');
    setNewSchoolCountry('');
    setNewSchoolStreet('');
    setNewSchoolPostalCode('');
  };

  const validateSignupData = () => {
    let errorPresent = false;
    signupErrors.email = initalSignupErrors.email;
    signupErrors.password = initalSignupErrors.password;
    signupErrors.firstName = initalSignupErrors.firstName;
    signupErrors.jobTitle = initalSignupErrors.jobTitle;
    signupErrors.school = initalSignupErrors.school;
    signupErrors.preferredLanguage = initalSignupErrors.preferredLanguage;
    if (!email) {
      signupErrors.email = 'Please enter an email.';
      errorPresent = true;
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
    ) {
      signupErrors.email = 'Please enter a valid email.';
      errorPresent = true;
    }

    if (!password) {
      signupErrors.password = 'Please enter a password.';
      errorPresent = true;
    }

    if (!firstName) {
      signupErrors.firstName = 'Please enter a first name.';
      errorPresent = true;
    }

    if (!language) {
      signupErrors.preferredLanguage = 'Please select a language.';
      errorPresent = true;
    }

    if ((props.role == UserRole.Delegate || props.role == UserRole.HeadDelegate) && !school) {
      signupErrors.school = 'Please select school.';
      errorPresent = true;
    }

    if (props.role == UserRole.HeadDelegate && !headDelegateTitle) {
      signupErrors.jobTitle = 'Please enter a job tilte.';
      errorPresent = true;
    }

    setSignupErrors({...signupErrors});
    return !errorPresent;
  };

  const validateSchoolData = () => {
    let errorPresent = false;
    schoolErrors.name = initalSchoolErrors.name;
    schoolErrors.country = initalSchoolErrors.country;
    schoolErrors.capacity = initalSchoolErrors.capacity;
    schoolErrors.streetAddress = initalSchoolErrors.streetAddress;

    if (!newSchoolName) {
      schoolErrors.name = 'Please enter a name.';
      errorPresent = true;
    }

    if (!newSchoolCountry) {
      schoolErrors.country = 'Please enter a country';
      errorPresent = true;
    }

    if (!newSchoolStreet) {
      schoolErrors.streetAddress = 'Please enter an address';
      errorPresent = true;
    }

    if (isNaN(+newSchoolCapacity)) {
      schoolErrors.capacity = 'Please enter a number';
      errorPresent = true;
    }

    setSchoolErrors({...schoolErrors});
    return !errorPresent;
  };

  const sumbitSignUp = () => {
    if (!validateSignupData()) {
      return;
    }
    if (props.role == UserRole.Organizer) {
      axiosInstance
        .post('api/v1/register/organizer', {
          Email: email,
          Password: password,
          F_name: firstName,
          M_name: middleName,
          L_name: lastName,
          Pronouns: pronouns,
          Dietary_restriction: dietaryRestriction,
          Preferred_language: language,
          Role: props.role,
        })
        .then(res => {
          navigate('/');
          console.log('organizer signup response: ', res);
        })
        .catch(err => console.log('organizer signup error: ', err));
    } else {
      axiosInstance
        .post('api/v1/register', {
          Email: email,
          Password: password,
          F_name: firstName,
          M_name: middleName,
          L_name: lastName,
          Pronouns: pronouns,
          Dietary_restriction: dietaryRestriction,
          Preferred_language: language,
          Role: props.role,
          School_id: school,
          Job_title: props.role == UserRole.HeadDelegate ? headDelegateTitle : null,
        })
        .then(res => {
          navigate('/');
          console.log('signup response: ', res);
        })
        .catch(err => console.log('signup error: ', err));
    }
  };

  const submitSchool = () => {
    if (!validateSchoolData()) {
      return;
    }
    axiosInstance.post('api/v1/school', {
      Id: null,
      Name: newSchoolName,
      Capacity: newSchoolCapacity ? newSchoolCapacity : null,
      Country: newSchoolCountry,
      Province: newSchoolProvince ? newSchoolProvince : null,
      Street_address: newSchoolStreet,
      Postal_code: newSchoolPostalCode ? newSchoolPostalCode : null,
    }).then(res => {
      handleClose();
      console.log('add school response: ', res);
    })
    .catch(err => console.log('add school error: ', err));
  };


  useEffect(() => {
    axiosInstance.get('api/v1/schools').then(res => {
      console.log('schools response: ', res);
      setAllSchools(res.data.data);
    })
    .catch(err => console.log('get schools error: ', err));
  }, []);

  return (
    <div className="signup-page-container">
      <div style={{margin: '30px 0px'}}>
        {' '}
        {/* not sure why it does not work in scss?? */}
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
                error={signupErrors.email}
              />
              <TextFieldInput
                placeHolder="Enter Your First Name"
                input={firstName}
                setInput={setFirstName}
                error={signupErrors.firstName}
              />
              <TextFieldInput
                placeHolder="Enter Your Middle Name"
                input={middleName}
                setInput={setMiddleName}
              />
              <TextFieldInput
                placeHolder="Enter Your Last Name"
                input={lastName}
                setInput={setLastName}
              />
              <TextFieldInput
                placeHolder="Enter Your Password"
                input={password}
                setInput={setPassword}
                type={'password'}
                error={signupErrors.password}
              />
              <TextFieldInput
                placeHolder="Enter Your Pronouns"
                input={pronouns}
                setInput={setPronouns}
              />
              {(props.role == UserRole.Delegate || props.role == UserRole.HeadDelegate) && (
                <DropDownField
                  placeHolder="Select Your School"
                  input={school}
                  setInput={setSchool}
                  options={schools}
                  error={signupErrors.school}
                />
              )}
              {props.role == UserRole.HeadDelegate && (
                <div onClick={() => setDialogOpen(true)} className="signup-add-school-button">
                  + Register School
                </div>
              )}
              {props.role == UserRole.HeadDelegate && (
                <TextFieldInput
                  placeHolder="Enter Your Job Tile"
                  input={headDelegateTitle}
                  setInput={setHeadDelegateTitle}
                  error={signupErrors.jobTitle}
                />
              )}
              <DropDownField
                placeHolder="Select Your Preferred Language"
                input={language}
                setInput={setLanguage}
                options={languages}
                error={signupErrors.preferredLanguage}
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
      <Modal isOpen={dialogOpen} onRequestClose={handleClose} style={customStyles}>
        <div className="add-school-container">
          <div className="add-school-inner-container">
            <h3 className="signup-dialog-title">Register New School</h3>
            <TextFieldInput
              placeHolder="Enter School Name"
              input={newSchoolName}
              setInput={setNewSchoolName}
              error={schoolErrors.name}
            />
            <TextFieldInput
              placeHolder="Enter School Capacity"
              input={newSchoolCapacity}
              setInput={setNewSchoolCapacity}
              error={schoolErrors.capacity}
            />
            <TextFieldInput
              placeHolder="Enter School Country"
              input={newSchoolCountry}
              setInput={setNewSchoolCountry}
              error={schoolErrors.country}
            />
            <TextFieldInput
              placeHolder="Enter School Province"
              input={newSchoolProvince}
              setInput={setNewSchoolProvince}
            />
            <TextFieldInput
              placeHolder="Enter School Street Address"
              input={newSchoolStreet}
              setInput={setNewSchoolStreet}
              error={schoolErrors.streetAddress}
            />
            <TextFieldInput
              placeHolder="Enter School Postal Code"
              input={newSchoolPostalCode}
              setInput={setNewSchoolPostalCode}
            />
            <button className="add-school-submit-button" onClick={submitSchool}>
              Add School
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SignUp;
