import React from 'react';
import { selectUserData } from '../../actions/userActions/userSelectors';
import AccommodationsTable from '../../components/Accommodation/AccommodationsTable';
import CreateAccommodation from '../../components/Accommodation/CreateAccommodation';
import Navbar from '../../components/Navbar';
import { useTypedSelector } from '../../hooks/reduxHooks';
import { UserRole } from '../../models/Enums';
import './AccommodationsPage.scss';

const AccommodationsPage: React.FC = () => {
    const userContext = useTypedSelector(selectUserData);

    return (
        <>
            <Navbar />
            {
                userContext.Role === UserRole.Organizer &&
                <div className='manage-accommodations-container'>
                    <CreateAccommodation />
                </div>    
            }
            <div className='accommodations-container'>
                <AccommodationsTable />
            </div>
        </>
    )
}

export default AccommodationsPage;