import React from 'react';
import {useTable} from 'react-table';
import {Header} from './TableUtils';
import './Table.scss';

type OnCLickFunctionType = (data: string, answerData: string) => void;

interface TableProps {
  data: Array<any>;
  columns: Array<Header>;
  clickable?: boolean;
  clickExecution?: OnCLickFunctionType;
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
          {rows.map((row, index) => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()} className={props.clickable ? 'table-row-clickable' : ''} onClick={
                  props.clickable && props.clickExecution
                    ? () => props.clickExecution(data[index].Data, data[index].Answer_data)
                    : () => {}
                }>
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
