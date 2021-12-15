import React from 'react';
import './FormListing.scss';
import {UserRole} from '../../models/Enums';

export interface DelegateFormCompletion {
  name: string;
  completed: boolean;
}

export interface DelegateFormListingProps {
  title: string;
  conference: string;
  completed: boolean;
  userType: UserRole;
  delegates?: Array<DelegateFormCompletion>;
}

const DelegateFormListing: React.FC<DelegateFormListingProps> = props => {
  return (
    <div className="form-listing-container">
      <div
        className={`form-listing-inner-container${
          props.userType == UserRole.HeadDelegate ? ' limit-width' : ''
        }`}
      >
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
          {props.userType == UserRole.HeadDelegate && (
            <div className="align-flex-start">
              <h4 className="delegate-form-names-title">Form Status</h4>
              <div className="form-listing-delegates-list-container">
                {props.delegates.map(d => (
                  <p
                    className={`form-listing-delegate-name-${
                      d.completed ? 'complete' : 'uncomplete'
                    }`}
                  >
                    {d.name}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DelegateFormListing;
