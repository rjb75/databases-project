import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import { ROOT_V2 } from '../../utils/APIConstants';
import Table from '../Table/Table';

const Headers = [
    {Header: "First Name", accessor: "F_name"},
    {Header: "Last Name", accessor: "L_name"},
    {Header: "Pronouns", accessor: "Pronouns"},
    {Header: "Language", accessor: "Preferred_language"},
    {Header: "Dietary Restriction", accessor: "Dietary_restriction"},
]

const AllAttendeesTable: React.FC = () => {
    const eventId = '7c77fa2c-5bbe-11ec-9564-06df870c4a43'
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        axiosInstance
        .get(`${ROOT_V2}/attendee/${eventId}`)
        .then((res) => {
            setTableData(res.data?.data)
        })
        .catch(err => console.error(err))
    }, [])

    return (
        <div className='organizer-dashboard-container'>
                <Table columns={Headers} data={tableData}/>
        </div>
    )
}

export default AllAttendeesTable;