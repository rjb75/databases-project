import React, {useState} from 'react';
import Navbar from '../../components/Navbar';
import './FormCards.scss';
import OrganizerFormListing from '../../components/FormCards/OrganizerFormListing';
import {UserRole} from '../../models/Enums';
import {DelegateFormCompletion} from '../../components/FormCards/DelegateFormListing';
import DelegateFormListing from '../../components/FormCards/DelegateFormListing';

interface FormCardsProps {}
const userType = UserRole.HeadDelegate; // for now change user type to view different pages
const delegateData: Array<DelegateFormCompletion> = [
  {
    name: 'Robert Brown',
    completed: true,
  },
  {
    name: 'Risat Haque',
    completed: true,
  },
  {
    name: 'Ahmed Abdullah',
    completed: false,
  },
];

const FormCards: React.FC<FormCardsProps> = props => {
  return (
    <div className="form-cards-container">
      <Navbar activeLink="Forms" />
      <div className="form-cards-inner-container">
        {userType == UserRole.Organizer && (
          <div className="form-cards-buttons-container">
            <div className="form-cards-button">Create New Form</div>
          </div>
        )}
        <div className="form-cards-grid-container">
          {userType == UserRole.Organizer ? (
            <>
              <OrganizerFormListing
                title="Head Delegate Form"
                questions={5}
                responses={24}
                editable={true}
              />
              <OrganizerFormListing
                title="Delegate Form"
                questions={11}
                responses={142}
                editable={true}
              />
              <OrganizerFormListing title="Food Form" questions={3} responses={5} editable={true} />
            </>
          ) : (
            <>
              <DelegateFormListing
                title="Delegate Form"
                conference="Technology Conference"
                completed={false}
                userType={userType}
                delegates={delegateData}
              />
              <DelegateFormListing
                title="Food Form"
                conference="Technology Conference"
                completed={true}
                userType={userType}
                delegates={delegateData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCards;
