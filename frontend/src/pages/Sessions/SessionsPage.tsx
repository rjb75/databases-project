import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import EventSelector from '../../components/Events/EventSelector';
import Navbar from '../../components/Navbar';
import AddStream from '../../components/Sessions/AddStream';
import StreamsListing from '../../components/Sessions/StreamsListing';
import { formatStreams, Stream } from '../../components/Sessions/StreamUtils';
import { useTypedSelector } from '../../hooks/reduxHooks';
import { UserRole } from '../../models/Enums';
import { ROOT_V2 } from '../../utils/APIConstants';
import './SessionsPage.scss';

const SessionsPage: React.FC = () => {

    const eventContext = useTypedSelector((state) => state.event);
    const userContext = useTypedSelector((state) => state.user);
    const [streams, setStreams] = useState<Stream[]>([]);

    useEffect(() => {
        if(eventContext.id != null) {
            axiosInstance
            .get(`${ROOT_V2}/streams/sessions/${eventContext.id}`)
            .then((res) => {
                setStreams(formatStreams(res.data.data))
            })
            .catch(err => console.error(err))
        }
    }, [eventContext])

    return ( 
        <>
            <Navbar displayEventSelector={userContext.data.role !== UserRole.Organizer}/>
            {
                userContext.data.role === UserRole.Organizer &&
                <div className='manage-streams-container'>
                    <EventSelector />
                    <AddStream />
                </div>
                
            }

            {
                streams.length === 0 ?
                <p className='event-select-error'>Please select an event</p> :
                <StreamsListing streams={streams} />
            }
        </>
    )
};

export default SessionsPage;