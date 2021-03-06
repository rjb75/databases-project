import React, {useState, useEffect} from 'react';
import {ReactFormGenerator} from 'react-form-builder3';
import 'react-form-builder3/dist/app.css';
import './FormGenerator.scss';
import {useTypedSelector} from '../../hooks/reduxHooks';
import {selectSingleFormSubmission} from '../../actions/formActions/formSelectors';
import {removeInvlaidCharacters} from '../../utils/JSONUtils';
import {useNavigate} from 'react-router-dom';

interface FormViewerProps {}

const FormViewer: React.FC<FormViewerProps> = props => {
  const navigate = useNavigate();
  const formData = useTypedSelector(selectSingleFormSubmission);

  const formContent = JSON.parse(removeInvlaidCharacters(formData.Data));
  const formAnswers = JSON.parse(removeInvlaidCharacters(formData.AnswerData));

  return (
    <div className="form-generator-container">
      <div className="view-form-buttons-container">
        <div className="view-form-return-button" onClick={() => navigate('/organizer-form-table')}>
          <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.75 14.5C21.75 14.7404 21.6546 14.9709 21.4846 15.1409C21.3146 15.3108 21.0841 15.4063 20.8438 15.4063H10.344L14.2354 19.2959C14.3197 19.3802 14.3865 19.4802 14.4321 19.5903C14.4777 19.7004 14.5012 19.8184 14.5012 19.9375C14.5012 20.0567 14.4777 20.1747 14.4321 20.2848C14.3865 20.3949 14.3197 20.4949 14.2354 20.5792C14.1511 20.6634 14.0511 20.7303 13.941 20.7759C13.8309 20.8215 13.7129 20.8449 13.5938 20.8449C13.4746 20.8449 13.3566 20.8215 13.2465 20.7759C13.1364 20.7303 13.0364 20.6634 12.9522 20.5792L7.51466 15.1417C7.43026 15.0575 7.3633 14.9575 7.31762 14.8474C7.27193 14.7373 7.24841 14.6192 7.24841 14.5C7.24841 14.3808 7.27193 14.2628 7.31762 14.1527C7.3633 14.0426 7.43026 13.9426 7.51466 13.8584L12.9522 8.42092C13.1223 8.25075 13.3531 8.15515 13.5938 8.15515C13.8344 8.15515 14.0652 8.25075 14.2354 8.42092C14.4056 8.59109 14.5012 8.82189 14.5012 9.06255C14.5012 9.3032 14.4056 9.534 14.2354 9.70417L10.344 13.5938H20.8438C21.0841 13.5938 21.3146 13.6893 21.4846 13.8592C21.6546 14.0292 21.75 14.2597 21.75 14.5Z"
              fill="#4F4F4F"
            />
          </svg>
          {'Return'}
        </div>
      </div>
      <div className="form-generator-inner-container">
        <div className="form-container">
          {formContent.task_data && (
            <ReactFormGenerator
              hide_actions={true}
              read_only={true}
              data={formContent.task_data}
              answer_data={formAnswers.task_data}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormViewer;
