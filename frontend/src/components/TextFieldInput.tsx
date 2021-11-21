import React from 'react';
import './TextFieldInput.scss';

interface TextFieldInputProps {
  placeHolder: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isPassword: boolean;
  error?: string;
}

const TextFieldInput: React.FC<TextFieldInputProps> = props => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setInput(e.target.value);
  };

  return (
    <div className="text-field-container">
      <div className="form-control">
        <input
          type={props.isPassword ? 'password' : 'text'}
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
