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
import {selectEventContext} from '../actions/eventActions/eventSelector';
import {UserRole} from '../models/Enums';
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

const Navbar: React.FC<NavbarProps> = props => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const eventContext = useTypedSelector(selectEventContext);
  const userContext = useTypedSelector(selectUserData);
  const [dropdownOpen, setDropDownOpen] = useState(false);

  const handleSignOut = () => {
    axiosInstance
      .post(`${ROOT_V1}/signout`)
      .then(res => {
        navigate('/');
        dispatch(userSignedOut());
        storage.removeItem('persist:root');
        localStorage.clear();
        console.log('signout response: ', res);
      })
      .catch(err => console.log('signout error: ', err));
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
        <p className="navigation-eventtitle">{eventContext.name || APP_NAME}</p>
        {userContext.Role == UserRole.Organizer && (
          <>
            <a className="navigation-createevent">Create Event</a>
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
  );
};

export default Navbar;
