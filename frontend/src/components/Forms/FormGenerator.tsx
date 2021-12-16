import React, {useState, useEffect} from 'react';
import {ReactFormGenerator} from 'react-form-builder3';
import 'react-form-builder3/dist/app.css';
import './FormGenerator.scss';
import {useTypedSelector} from '../../hooks/reduxHooks';
import {selectFillingForm} from '../../actions/formActions/formSelectors';
import { selectUserData } from '../../actions/userActions/userSelectors';
import axiosInstance from '../../axios';
import {ROOT_V1} from '../../utils/APIConstants';
import {removeInvlaidCharacters} from '../../utils/JSONUtils';
import {useNavigate} from 'react-router-dom';

interface FormGeneratorProps {
  formContent: string;
}

const FormGenerator: React.FC<FormGeneratorProps> = props => {
  const navigate = useNavigate();
  const userData = useTypedSelector(selectUserData);
  const currentForm = useTypedSelector(selectFillingForm);
  const [formContent, setFormContent] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleSubmit = (data: any) => {
    const stringifiedResponse = JSON.stringify({task_data: data});
    axiosInstance
      .post(`${ROOT_V1}/form/complete`, {
        Form_id: formData.Id,
        Attendee_id: userData.Attendee_id,
        Filled_data: stringifiedResponse,
      })
      .then(res => {
        navigate('/form-cards');
        console.log('complete form response: ', res);
      })
      .catch(err => console.log('complete form error: ', err));
  };

  useEffect(() => {
    axiosInstance
      .get(`${ROOT_V1}/form/${currentForm}`)
      .then(res => {
        console.log('get form response: ', res);
        setFormContent(JSON.parse(removeInvlaidCharacters(res.data.data.Data)));
        setFormData(res.data.data);
      })
      .catch(err => console.log('get form error: ', err));
  }, [currentForm]);

  return (
    <div className="form-generator-container">
      <div className="form-generator-inner-container">
        <div className="form-container">
          {formContent && (
            <ReactFormGenerator
              data={formContent.task_data}
              submitButton={
                <button type="submit" className="submit-form-button">
                  Submit
                </button>
              }
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormGenerator;
