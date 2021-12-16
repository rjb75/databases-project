import React, {useState} from 'react';
import {ReactFormBuilder} from 'react-form-builder3';
import 'react-form-builder3/dist/app.css';
import './FormBuilder.scss';
import Modal from 'react-modal';
import TextFieldInput from '../components/InputFields/TextFieldInput';
import {ROOT_V1} from '../utils/APIConstants';
import axiosInstance from '../axios';
import {useTypedSelector} from '../hooks/reduxHooks';
import {selectUserData} from '../actions/userActions/userSelectors';
import {useNavigate} from 'react-router-dom';

interface FormBuilderProps {}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const FormBuilder: React.FC<FormBuilderProps> = props => {
  const navigate = useNavigate();
  const userData = useTypedSelector(selectUserData);
  const eventId = '2e9c306d-f83c-4bb0-b0d9-bc12a0d0fe91'; // should get from redux when event dashboard page is added
  const [formContent, setFormContent] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formNameErrors, setFormNameErrors] = useState('');

  const handleClose = () => {
    setFormNameErrors('');
    setModalOpen(false);
  };

  const onPost = (data: any) => {
    setFormContent(data);
    console.log('onPost is: ', data);
  };

  const onSubmit = () => {
    setFormNameErrors('');
    if (!formName) {
      setFormNameErrors('Please enter a form name.');
      return;
    }

    if (!formContent.task_data || formContent.task_data.length == 0) {
      // show error message
      return;
    }

    const stringForm = JSON.stringify(formContent);
    
    axiosInstance
      .post(`${ROOT_V1}/form`, {
        Id: '',
        Data: stringForm,
        Created_by: userData.Email,
        Event_id: eventId,
        Form_name: formName,
      })
      .then(res => {
        navigate('/form-cards');
        console.log('create form response: ', res);
      })
      .catch(err => console.log('create form error: ', err));
  };

  return (
    <div className="form-builder-container">
      <div className="form-builder-content-container">
        <div className="form-builder-header-container">
          <div>
            <h2 className="form-builder-title">Form Builder</h2>
          </div>
          <div className="form-builder-submit-button" onClick={() => setModalOpen(true)}>
            Publish Form
          </div>
        </div>
        <div className="form-divider"></div>
        <ReactFormBuilder onPost={onPost} />
      </div>
      <Modal isOpen={modalOpen} onRequestClose={handleClose} style={customStyles}>
        <div className="add-form-container">
          <div className="add-form-inner-container">
            <h3 className="form-dialog-title">Add New Form</h3>
            <TextFieldInput
              placeHolder="Enter Form Name"
              input={formName}
              setInput={setFormName}
              isPassword={false}
              error={formNameErrors}
            />
            <button className="add-form-submit-button" onClick={onSubmit}>
              Publish Form
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FormBuilder;
