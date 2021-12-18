import React from 'react';
import AccommodationsTable from '../../components/Accommodation/AccommodationsTable';
import Navbar from '../../components/Navbar';
import './AccommodationsPage.scss';

const AccommodationsPage: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className='accommodations-container'>
                <AccommodationsTable />
            </div>
        </>
    )
}

export default AccommodationsPage;