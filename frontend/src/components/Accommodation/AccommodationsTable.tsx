import React, {useEffect, useState} from 'react';
import {selectEventContext} from '../../actions/eventActions/eventSelector';
import {selectUserData} from '../../actions/userActions/userSelectors';
import axiosInstance from '../../axios';
import {useTypedSelector} from '../../hooks/reduxHooks';
import {UserRole} from '../../models/Enums';
import {ROOT_V2} from '../../utils/APIConstants';
import Table from '../Table/Table';

const Headers = [
  {Header: 'Room Number', accessor: 'Room_code'},
  {Header: 'Attendee', accessor: 'Attendee_name'},
  {Header: 'School', accessor: 'School'},
  {Header: 'Room Capacity', accessor: 'Room_capacity'},
];

interface AccommodationsTableRow {
  Room_code: number;
  Attendee_name: string;
  School: string;
  Room_capacity: string;
}

interface Accommodation {
  Room_number: string;
  F_name: string;
  L_name: string;
  School: string;
  Room_Total?: number;
  Room_code?: number;
}

interface AccommodationCapacity {
  Room_number: string;
  Room_Current: number;
  Room_Total: number;
}

interface SchoolAccommodations {
  Name: string;
  Persons: Person[];
  Room_number: string;
  Room_code: number;
}

interface Person {
  F_name: string;
  M_name: string;
  L_name: string;
  Preferred_language: string;
  Pronouns: string;
  Dietary_restriction: string;
  Email: string;
}

const AccommodationsTable = () => {
  const [tableData, setTableData] = useState<AccommodationsTableRow[]>([]);
  const [accommodationList, setAccommodationList] = useState<Accommodation[]>([]);
  const [accommodationCapacity, setAccommodationCapacity] = useState<AccommodationCapacity[]>([]);

  const eventContext = useTypedSelector(selectEventContext);
  const userContext = useTypedSelector(selectUserData);

  function formatAccommodationData() {
    setTableData(
      accommodationList?.map(a => {
        const roomCapacity = accommodationCapacity.find(r => r.Room_number === a.Room_number);
        return {
          Attendee_name: `${a.F_name} ${a.L_name}`,
          School: a.School,
          Room_code: a.Room_code,
          Room_capacity: `${roomCapacity.Room_Current}/${roomCapacity.Room_Total}`,
        };
      })
    );
  }

  function formatSchoolAccommodationData(data: SchoolAccommodations[]): Accommodation[] {
    var items: Accommodation[] = [];
    data?.forEach(a => {
      a.Persons.forEach(p => {
        items.push({
          Room_number: a.Room_number,
          F_name: p.F_name,
          L_name: p.L_name,
          School: a.Name,
          Room_code: a.Room_code,
        });
      });
    });
    return items;
  }

  useEffect(() => {
    if (eventContext.id) {
      if (userContext.Role === UserRole.Organizer) {
        axiosInstance
          .get(`${ROOT_V2}/accommodation/${eventContext.id}`)
          .then(res => setAccommodationList(res.data.data))
          .catch(err => console.log(err));
      } else {
        axiosInstance.get(`${ROOT_V2}/school/${userContext.Attendee_id}`).then(res => {
          const schoolId = res.data.data.Id;
          axiosInstance
            .get(`${ROOT_V2}/school/accommodation/${eventContext.id}/${schoolId}`)
            .then(res => setAccommodationList(formatSchoolAccommodationData(res.data.data)))
            .catch(err => console.log(err));
        });
      }

      axiosInstance
        .get(`${ROOT_V2}/accommodation/capacity/${eventContext.id}`)
        .then(res => setAccommodationCapacity(res.data.data))
        .catch(err => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (accommodationList?.length > 0 && accommodationCapacity?.length > 0) {
      formatAccommodationData();
    }
  }, [accommodationList, accommodationCapacity]);

  return (
    <>
      <Table columns={Headers} data={tableData} />
    </>
  );
};

export default AccommodationsTable;
