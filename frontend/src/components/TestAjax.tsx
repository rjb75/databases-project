import {request} from 'http';
import React, {useEffect, useState} from 'react';
import Table from './Table';
import {Header} from './TableUtils';

function TextAjax() {
  const [result, setResult] = useState([]);

  //Testing POST
  useEffect(() => {
    fetch('/api/v1/persons', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        Email: 'ROBERT@ROBERT.com',
        F_name: 'ROBERT',
        M_name: 'R',
        L_name: 'WHAT',
        Pronouns: 'He/Him',
        Dietary_restriction: 'Vegan',
        Preferred_language: 'FN',
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  }, []);

  //Testing GET
  useEffect(() => {
    fetch('/api/v1/persons')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setResult(data.data);
      });
  }, []);

  const DataHeaders: Array<Header> = React.useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'Email',
      },
      {
        Header: 'First Name',
        accessor: 'F_name',
      },
      {
        Header: 'Middle Name',
        accessor: 'M_name',
      },
      {
        Header: 'Last Name',
        accessor: 'L_name',
      },
      {
        Header: 'Pronouns',
        accessor: 'Pronouns',
      },
      {
        Header: 'Preferred Language',
        accessor: 'Preferred_language',
      },
      {
        Header: 'Dietary Restriction',
        accessor: 'Dietary_restriction',
      },
    ],
    []
  );

  return (
    <>
      <Table columns={DataHeaders} data={result} />
    </>
  );
}

export default TextAjax;
