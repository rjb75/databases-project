import React from 'react';
import './FormListing.scss';

export interface OrganizerFormListingProps {
  title: string;
  questions: number;
  responses: number;
  editable: boolean;
}

const OrganizerFormListing: React.FC<OrganizerFormListingProps> = props => {
  return (
    <div className="form-listing-container">
      <div className="form-listing-inner-container">
        <h2 className="listing-title">{props.title}</h2>
        <p className="listing-questions">{props.questions} Questions</p>
        <a className="view-responses btn btn-primary--red">{props.responses} Responses</a>
        {props.editable && <a className="edit-form-link">Edit Form</a>}
      </div>
    </div>
  );
};

export default OrganizerFormListing;
