import React from 'react';
import './FormListing.scss';
import { useTypedDispatch } from '../../hooks/reduxHooks';
import { viewFormSubmissions } from '../../actions/formActions/formActionCreators';
import {useNavigate} from 'react-router-dom';

export interface OrganizerFormListingProps {
  title: string;
  questions: number;
  responses: number;
  editable: boolean;
  formId: string;
}

const OrganizerFormListing: React.FC<OrganizerFormListingProps> = props => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();

  const handleResponsesClick = () => {
    dispatch(viewFormSubmissions(props.formId));
    navigate('/organizer-form-table');

  }

  return (
    <div className="form-listing-container">
      <div className="form-listing-inner-container">
        <h2 className="listing-title">{props.title}</h2>
        <p className="listing-questions">{props.questions} Questions</p>
        <a className="view-responses btn btn-primary--red" onClick={handleResponsesClick}>{props.responses} Responses</a>
      </div>
    </div>
  );
};

export default OrganizerFormListing;
