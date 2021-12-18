import React from 'react';
import './TextFieldInput.scss';

interface TextFieldInputProps {
  placeHolder: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
  type?: string;
}

const TextFieldInput: React.FC<TextFieldInputProps> = props => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setInput(e.target.value);
  };

  return (
    <div className="text-field-container">
      <div className="text-field-form-control">
        <input
          type={props.type || 'text'}
          value={props.input}
          onChange={handleValueChange}
          placeholder={props.placeHolder}
        />
        <div className="errors">{props.error}</div>
      </div>
    </div>
  );
};

export default TextFieldInput;
