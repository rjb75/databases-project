import React from 'react';
import { SessionProps } from './SessionUtils';
import './SessionItem.scss';

const SessionItem: React.FC<SessionProps> = ({session}) => {
    return (
        <>
            <h3>{session.title}</h3>
            <strong>{session.start}</strong>
            <p>{session.description}</p>
            <p className='duration-indicator btn-primary--purple-dark'>{session.duration} minutes</p>
        </>
    )
}

export default SessionItem;