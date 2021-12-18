import React, {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import storage from 'redux-persist/lib/storage';
import Icon from '../assets/icon.svg';
import {APP_NAME} from '../utils/TextConstants';
import EventSelector from './Events/EventSelector';
import axiosInstance from '../axios';
import {ROOT_V1} from '../utils/APIConstants';
import {useTypedDispatch, useTypedSelector} from '../hooks/reduxHooks';
import {userSignedOut} from '../actions/userActions/userActionCreator';
import {selectUserData} from '../actions/userActions/userSelectors';
import {selectEventContext, selectEventList} from '../actions/eventActions/eventSelector';
import {setEventContext, setEventList} from '../actions/eventActions/eventActionCreator';
import {UserRole} from '../models/Enums';
import Modal from 'react-modal';
import TextFieldInput from './InputFields/TextFieldInput';
import './Navbar.scss';

export interface NavbarLink {
  text: string;
  link: string;
  enabled: boolean;
}

export interface NavbarProps {
  links?: Array<NavbarLink>;
  displayEventSelector?: boolean;
  displayTabs?: boolean;
  activeLink?: string;
}

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

const Navbar: React.FC<NavbarProps> = props => {
  Modal.setAppElement('#root');
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const eventContext = useTypedSelector(selectEventContext);
  const userContext = useTypedSelector(selectUserData);
  const eventList = useTypedSelector(selectEventList);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventNameErrors, setEventNameErrors] = useState('');
  const [addedEventId, setAddedEventId] = useState('');

  const handleSignOut = () => {
    axiosInstance
      .post(`${ROOT_V1}/signout`)
      .then(res => {
        navigate('/');
        dispatch(userSignedOut());
        dispatch(
          setEventContext({
            id: null,
            name: null,
          })
        );
        storage.removeItem('persist:root');
        localStorage.clear();
        console.log('signout response: ', res);
      })
      .catch(err => console.log('signout error: ', err));
  };

  const handleClose = () => {
    setEventNameErrors('');
    setModalOpen(false);
  };

  const onSubmit = () => {
    setEventNameErrors('');
    if (!eventName) {
      setEventNameErrors('Please enter a name.');
    } else {
      axiosInstance
        .post(`${ROOT_V1}/event/organizer`, {
          Id: '',
          Name: eventName,
          Email: userContext.Email,
        })
        .then(res => {
          console.log('add event response: ', res);
          setAddedEventId(res.data.data);
          if (eventList) {
            dispatch(setEventList([...eventList, {id: res.data.data, name: eventName}]));
          } else {
            dispatch(setEventList([{id: res.data.data, name: eventName}]));
          }
          handleClose();
        })
        .catch(err => console.log('add event error: ', err));
    }
  };

  const defaultRoutes: Array<NavbarLink> = [
    {
      link: '/dashboard',
      text: 'Dashboard',
      enabled: true,
    },
    {
      link: '/form-cards',
      text: 'Forms',
      enabled: true,
    },
    {
      link: '/sessions',
      text: 'Sessions',
      enabled: true,
    },
    {
      link: '/accommodations',
      text: 'Accommodations',
      enabled: true,
    },
  ];
  const {links = defaultRoutes} = props;

  return (
    <>
      <nav className="navigation navigation-primary">
        <div className="navigation-topbar">
          <div className="navigation-homebutton" onClick={() => setDropDownOpen(!dropdownOpen)}>
            <img src={Icon} />
            <div hidden={!dropdownOpen} className={`navigation-drop-down`}>
              <div className="navigation-drop-down-option" onClick={handleSignOut}>
                Sign Out
              </div>
            </div>
          </div>
          <p className="navigation-eventtitle">{eventContext?.name || APP_NAME}</p>
          {userContext.Role == UserRole.Organizer && (
            <>
              <a className="navigation-createevent" onClick={() => setModalOpen(true)}>
                Create Event
              </a>
            </>
          )}
        </div>
        {props.displayTabs == true ||
          (props.displayTabs == undefined && (
            <div className="navigation-bottombar">
              {links.map(l => {
                if (l.enabled) {
                  return (
                    <NavLink
                      className={`navigation-link ${props.activeLink == l.text ? ' active' : ''}`}
                      key={`navitem-${l.link}`}
                      to={l.link}
                    >
                      <span className="navigation-link-text">{l.text}</span>
                    </NavLink>
                  );
                }
              })}
            </div>
          ))}
        {(props.displayEventSelector == undefined || props.displayEventSelector == true) && (
          <div className="event-selector-container">
            <EventSelector />
          </div>
        )}
      </nav>
      <Modal isOpen={modalOpen} onRequestClose={handleClose} style={customStyles}>
        <div className="add-form-container">
          <div className="add-form-inner-container">
            <h3 className="form-dialog-title">Add Event</h3>
            <TextFieldInput
              placeHolder="Enter Event Name"
              input={eventName}
              setInput={setEventName}
              error={eventNameErrors}
            />

            <button className="add-form-submit-button" onClick={onSubmit}>
              Add
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
