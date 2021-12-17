import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import Navbar from '../../components/Navbar';
import StreamsListing from '../../components/Sessions/StreamsListing';
import { formatStreams, Stream } from '../../components/Sessions/StreamUtils';
import { ROOT_V2 } from '../../utils/APIConstants';

const SessionsPage: React.FC = () => {

    const [streams, setStreams] = useState<Stream[]>([]);

    //TODO: get event from redux
    const eventId = '7c77fa2c-5bbe-11ec-9564-06df870c4a43'

    useEffect(() => {
        axiosInstance
        .get(`${ROOT_V2}/streams/sessions/${eventId}`)
        .then((res) => {
            setStreams(formatStreams(res.data.data))
        })
        .catch(err => console.error(err))
    }, [])

    return ( 
        <>
            <Navbar />
            <StreamsListing streams={streams} />
        </>
    )
};

export default SessionsPage;