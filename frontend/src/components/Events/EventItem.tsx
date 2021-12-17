import React from 'react';
import { Event } from '../../models/Event';

interface EventProps {
    event: Event;
}

const EventItem: React.FC<EventProps> = ({event}) => {
    return (
        <>
            <h3>{event.name}</h3>
        </>
    )
}

export default EventItem;