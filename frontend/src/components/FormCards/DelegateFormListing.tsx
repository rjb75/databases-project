import React from 'react';
import './FormListing.scss';
import {UserRole} from '../../models/Enums';
import {DelegateResponse} from '../../pages/FormCards/FormCards';
import { useTypedDispatch } from '../../hooks/reduxHooks';
import { fillForm } from '../../actions/formActions/formActionCreators';
import {useNavigate} from 'react-router-dom';

export interface DelegateFormCompletion {
  Name: string;
  completed: boolean;
}

export interface DelegateFormListingProps {
  title: string;
  conference: string;
  completed: boolean;
  userType: UserRole;
  formId: string;
  delegates?: Array<DelegateResponse>;
}

const DelegateFormListing: React.FC<DelegateFormListingProps> = props => {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();

  const handleButtonClicked = () => {
    dispatch(fillForm(props.formId));
    navigate('/form');
  }
  
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
            onClick={props.completed ? () => {} : handleButtonClicked}
            className={`complete-form-button btn ${
              props.completed ? 'btn-primary--green' : 'btn-primary--red'
            }`}
          >
            {props.completed ? 'Completed' : 'Complete Form'}
          </a>
          {props.userType == UserRole.HeadDelegate && (
            <div className="align-flex-start">
              {props.delegates.length > 0 && (
                <>
                  <h4 className="delegate-form-names-title">Form Status</h4>
                </>
              )}
              <div className="form-listing-delegates-list-container">
                {props.delegates.map(d => (
                  <p
                    className={`form-listing-delegate-name-${
                      d.Response > 0 ? 'complete' : 'uncomplete'
                    }`}
                  >
                    {d.Name}
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
