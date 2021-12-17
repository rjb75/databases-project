import React from 'react';
import {NavLink} from 'react-router-dom';
import Icon from '../assets/icon.svg';
import {useTypedSelector} from '../hooks/reduxHooks';
import {APP_NAME} from '../utils/TextConstants';
import EventSelector from './Events/EventSelector';
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
  const eventContext = useTypedSelector(state => state.event);
  return (
    <nav className="navigation navigation-primary">
      <div className="navigation-topbar">
        <NavLink className="navigation-homebutton" to="/">
          <img src={Icon} />
        </NavLink>
        <p className="navigation-eventtitle">{eventContext.name || APP_NAME}</p>
        <a className="navigation-createevent">Create Event</a>
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
