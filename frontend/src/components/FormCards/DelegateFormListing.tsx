import React from 'react';
import './FormListing.scss';

export interface DelegateFormListingProps {
  title: string;
  conference: string;
  completed: boolean;
}

const DelegateFormListing: React.FC<DelegateFormListingProps> = props => {
  return (
    <div className="form-listing-container">
      <div className="form-listing-inner-container">
        <div className="form-listings-fit">
          <h2 className="listing-title align-flex-start">{props.title}</h2>
          <p className="listing-conference-title">{props.conference}</p>
          <a
            className={`complete-form-button btn ${
              props.completed ? 'btn-primary--green' : 'btn-primary--red'
            }`}
          >
            {props.completed ? 'Completed' : 'Complete Form'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default DelegateFormListing;
