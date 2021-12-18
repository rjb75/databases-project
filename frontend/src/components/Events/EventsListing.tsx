import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import { Event, formatEvents } from '../../models/Event';
import { ROOT_V2 } from '../../utils/APIConstants';
import Card from '../Cards/Card';
import EventItem from './EventItem';
import './EventListing.scss';

const EventsListing: React.FC = () => {
    const [eventList, setEventList] = useState<Event[]>([]);

    useEffect(() => {
        axiosInstance
        .get(`${ROOT_V2}/events`)
        .then(res => setEventList(formatEvents(res.data.data)))
        .catch(err => console.error(err))
    }, [])

    return (
        <div className='events-listing-container'>
            {
                eventList.map((e) => {
                    return (
                        <Card key={e.id}>
                            <EventItem event={e} />
                        </Card>
                    )
                })
            }
        </div>
    )
}

export default EventsListing;