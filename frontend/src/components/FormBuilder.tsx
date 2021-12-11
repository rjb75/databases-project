import React, {useState} from 'react';
import {ReactFormBuilder} from 'react-form-builder3';
import 'react-form-builder3/dist/app.css';
import './FormBuilder.scss';

interface FormBuilderProps {}

const FormBuilder: React.FC<FormBuilderProps> = props => {
  const [formContent, setFormContent] = useState<any>();

  const onPost = (data: any) => {
    setFormContent(data);
    console.log('onPost is: ', data);
  };

  const onSubmit = () => {
    if (!formContent.task_data || formContent.task_data.length == 0) {
      // show error message
      return;
    }

    const stringForm = JSON.stringify(formContent);
    console.log('stringfied form is: ', stringForm);

    // call api passing in formContent as data parameter
  };

  return (
    <div className="form-builder-container">
      <div className="form-builder-content-container">
        <div className="form-builder-header-container">
          <div>
            <h2 className="form-builder-title">Form Builder</h2>
          </div>
          <div className="form-builder-submit-button" onClick={onSubmit}>
            Publish Form
          </div>
        </div>
        <div className="form-divider"></div>
        <ReactFormBuilder onPost={onPost} />
      </div>
    </div>
  );
};

export default FormBuilder;
