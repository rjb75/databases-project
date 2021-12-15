import React from 'react';
import {useTable} from 'react-table';
import {Header} from './TableUtils';
import './Table.scss'

interface TableProps {
  data: Array<any>;
  columns: Array<Header>;
}

const Table: React.FC<TableProps> = props => {
  const {data, columns} = props;

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
    columns,
    data,
  });

  return (
    <div className="primary-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;