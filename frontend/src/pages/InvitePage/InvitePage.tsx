import React, {useState, useEffect} from 'react';
import TextFieldInput from '../../components/InputFields/TextFieldInput';
import DropDownField from '../../components/InputFields/DropDownField';
import {Languages, DietaryRestriction} from '../../models/Enums';
import {useParams} from 'react-router-dom';
import axiosInstance from '../../axios';
import SessionsListing from '../../components/Sessions/SessionsListing';
import {ROOT_V1} from '../../utils/APIConstants';
import {formatSessions} from '../../components/Sessions/SessionUtils';
import Card from '../../components/Cards/Card';
import './InvitePage.scss';
import '../SignUp/SignUp.scss';
import '../../components/Sessions/SessionsListing.scss';
import arrowRight from '../../assets/arrow-right.svg';
import arrowLeft from '../../assets/arrow-left.svg';
import { CardSize } from '../../components/Cards/CardUtils';

interface InvitePageProps {}
const InvitePage: React.FC<InvitePageProps> = props => {
  const params = useParams();
  const [eventName, setEventName] = useState('');
  const [streamName, setStreamName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [language, setLanguage] = useState('');
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const sumbitForm = () => {
    if (userInfo && !userInfo.F_name && !firstName) {
      setFirstNameError('Please enter a first name');
    } else {
      if (userInfo && !userInfo.F_name) {
        axiosInstance
          .post(`${ROOT_V1}/person/update/unregistered/`, {
            Email: userInfo.Email,
            F_name: firstName,
            M_name: middleName,
            L_name: lastName,
            Pronouns: pronouns,
            Preferred_language: language,
            Dietary_restriction: dietaryRestriction,
          })
          .then(res => {
            console.log('update user response: ', res);
          })
          .catch(err => console.log('update user error: ', err));
      }
      axiosInstance
        .post(`${ROOT_V1}/participating`, {
          Stream_number: params.streamNumber,
          Attendee_id: userInfo.Attendee_id,
        })
        .then(res => {
          console.log('add is participating response: ', res);
          axiosInstance
            .post(`${ROOT_V1}/ticket`, {
              Attendee_id: userInfo.Attendee_id,
              Ticket_number: 0,
              Is_valid: '1',
              Event_id: params.eventId,
            })
            .then(res => {
              setShowForm(false);
              console.log('add ticket: ', res);
            })
            .catch(err => console.log('add ticket: ', err));
        })
        .catch(err => console.log('add is participating error: ', err));
    }
  };

  const handleRightClicked = () => {
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  };

  const handleLeftClicked = () => {
    if (currentPage > 0) {
      setCurrentPage(0);
    }
  };

  var languages: any = [];
  var dietaryRestrictions: any = [];

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

  useEffect(() => {
    axiosInstance
      .get(`${ROOT_V1}/person/token/${params.token}`)
      .then(res => {
        console.log('get user from token response: ', res);
        setUserInfo(res.data.data);
        axiosInstance
          .get(`${ROOT_V1}/participating/count/${params.streamNumber}/${res.data.data.Attendee_id}`)
          .then(res => {
            console.log('get count participating response: ', res);
            setShowForm(res.data.data == 0);
          })
          .catch(err => console.log('get count participating error: ', err));
      })
      .catch(err => console.log('get user from token error: ', err));
    axiosInstance
      .get(`${ROOT_V1}/event/${params.eventId}`)
      .then(res => {
        console.log('get event response: ', res);
        setEventName(res.data.data.Name);
      })
      .catch(err => console.log('get event error: ', err));
    axiosInstance
      .get(`${ROOT_V1}/stream/${params.streamNumber}`)
      .then(res => {
        console.log('get stream response: ', res);
        setStreamName(res.data.data.Title);
      })
      .catch(err => console.log('get stream error: ', err));
  }, []);

  useEffect(() => {
    if (currentPage == 1 && sessions == null) {
      axiosInstance
        .get(`${ROOT_V1}/stream/session/${params.streamNumber}`)
        .then(res => {
          console.log('get sessions response: ', res);
          setSessions(res.data.data);
        })
        .catch(err => console.log('get sessions error: ', err));
    }
  }, [currentPage]);

  return (
    <div className="invite-page">
      <div className="invite-page-container">
        <div className="invite-card">
          <div className="invite-card-arrows-container">
            <div>
              <img
                src={arrowLeft}
                alt=""
                className="invite-card-arrow"
                onClick={handleLeftClicked}
              />
            </div>
            <div>
              <img
                src={arrowRight}
                alt=""
                className="invite-card-arrow"
                onClick={handleRightClicked}
              />
            </div>
          </div>
          {currentPage == 0 ? (
            <>
              <h1 className="invite-card-title">Hey, you are invited!</h1>
              <div className="invite-card-wrapper">
                <div>
                  <div className="invite-card-event-name-container">
                    <h2 className="invite-card-event-name">{eventName}</h2>
                  </div>
                  <div className="invite-card-stream-container">
                    <h4>{streamName}</h4>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='card invite-card-sessions-container'>
                <SessionsListing sessions={formatSessions(sessions)} />
            </div>
          )}
        </div>
        {showForm && (
          <div className="invite-form-inputs-side">
            <div className="signup-page-container">
              <div className="signup-form-container" style={{margin: 'auto'}}>
                <div className="signup-inputs-container add-padding">
                  <h2>Registration</h2>
                  {userInfo && !userInfo.F_name && (
                    <>
                      <TextFieldInput
                        placeHolder="Enter Your First Name"
                        input={firstName}
                        setInput={setFirstName}
                        isPassword={false}
                        error={firstNameError}
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
                        placeHolder="Enter Your Pronouns"
                        input={pronouns}
                        setInput={setPronouns}
                        isPassword={false}
                      />
                      <DropDownField
                        placeHolder="Select Your Preferred Language"
                        input={language}
                        setInput={setLanguage}
                        options={languages}
                      />
                      <DropDownField
                        placeHolder="Select Your Dietary Restriction"
                        input={dietaryRestriction}
                        setInput={setDietaryRestriction}
                        options={dietaryRestrictions}
                      />
                    </>
                  )}
                  <button
                    className="signup-submit-button submit-button-adjust"
                    onClick={sumbitForm}
                  >
                    COMPLETE REGISTATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePage;
