import React from 'react';
import AllAttendeesTable from '../../components/Dashboard/AllAttendeesTable';
import EventsListing from '../../components/Events/EventsListing';
import Navbar from '../../components/Navbar';
import { useTypedSelector } from '../../hooks/reduxHooks';
import { UserRole } from '../../models/Enums';
import { selectUserData } from '../../actions/userActions/userSelectors';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
    const userContext = useTypedSelector(selectUserData);

    return(
        <>
            <Navbar displayEventSelector={true} />
            {
                userContext.Role === UserRole.Organizer ?
                <AllAttendeesTable /> :
                <EventsListing />
            }
            
        </>
    )
}

export default Dashboard;