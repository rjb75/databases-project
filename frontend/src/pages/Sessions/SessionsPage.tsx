import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import StreamsListing from '../../components/Sessions/StreamsListing';
import { formatStreams, Stream } from '../../components/Sessions/StreamUtils';
import { ROOT_V1 } from '../../utils/APIConstants';

const SessionsPage: React.FC = () => {

    const [streams, setStreams] = useState<Stream[]>([]);

    useEffect(() => {
        axiosInstance
        .get(`${ROOT_V1}/streams`)
        .then((res) => {
            setStreams(formatStreams(res.data.data))
        })
        .catch(err => console.error(err))
    }, [])

    return ( 
        <>
            <StreamsListing streams={streams} />
        </>
    )
};

export default SessionsPage;