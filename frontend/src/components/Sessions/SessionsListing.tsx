import React from 'react';
import { SessionsProps } from './SessionUtils';
import './SessionsListing.scss';
import SessionItem from './SessionItem';


const SessionsListing: React.FC<SessionsProps> = ({sessions}) => {

    return (
        <ul className='stream-sessions-listing'>
            {
                sessions.length > 0 ?
                sessions.map((s) => {
                    return (
                        <li key={s.uuid} className='session-list-item'>
                            <SessionItem session={s} />
                        </li>
                    )
                }) : <p>No sessions found</p>
            }
        </ul>
    )
}

export default SessionsListing;