import React from 'react';
import './DropDownField.scss';

export interface Option {
  value: number | string;
  label: string;
}
interface DropDownFieldProps {
  placeHolder: string;
  input: string | number;
  setInput: React.Dispatch<React.SetStateAction<string | number>>;
  error?: string;
  options: Array<Option>;
}

const DropDownField: React.FC<DropDownFieldProps> = props => {
  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.setInput(e.target.value);
  };

  return (
    <div className="drop-down-field-container">
      <div className="form-control">
        <select value={props.input} onChange={handleValueChange}>
        <option value="" disabled selected>{props.placeHolder}</option>
          {props.options.map((o: Option) => (
            <option value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="errors">{props.error}</div>
      </div>
    </div>
  );
};

export default DropDownField;
