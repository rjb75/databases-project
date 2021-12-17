import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
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
        console.log(streams)
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
            <Navbar />
            {
                true &&
                <AddStream />
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