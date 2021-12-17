import React, { useEffect } from 'react';
import AllAttendeesTable from '../../components/Dashboard/AllAttendeesTable';
import EventsListing from '../../components/Dashboard/EventsListing';
import Navbar from '../../components/Navbar';
import { useTypedSelector } from '../../hooks/reduxHooks';
import './Dashboard.scss';

const Headers = [
    // {Header: "Email", accessor: "Email"},
    {Header: "First Name", accessor: "F_name"},
    {Header: "Last Name", accessor: "L_name"},
    {Header: "Pronouns", accessor: "Pronouns"},
    {Header: "Language", accessor: "Preferred_language"},
    {Header: "Dietary Restriction", accessor: "Dietary_restriction"},
]

const Dashboard: React.FC = () => {
    const userContext = useTypedSelector((state) => state.user.data);

    return(
        <>
            <Navbar />
            {
                userContext.role == 'organizer' ?
                <AllAttendeesTable /> :
                <EventsListing />
            }
            
        </>
    )
}

export default Dashboard;