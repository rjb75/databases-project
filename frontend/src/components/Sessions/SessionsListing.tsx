import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import { formatSessions, Session, SessionsProps } from './SessionUtils';
import './SessionsListing.scss';
import SessionItem from './SessionItem';
import { ROOT_V1 } from '../../utils/APIConstants';


const SessionsListing: React.FC<SessionsProps> = ({stream}) => {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        axiosInstance
        .get(`${ROOT_V1}stream/session/${stream}`)
        .then((res) => {
            setSessions(formatSessions(res.data.data))
        })
        .catch(err => console.error(err))
    }, [stream])

    return (
        <ul className='stream-sessions-listing'>
            {
                sessions ?
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