import React, {useState} from 'react';
import Navbar from '../../components/Navbar';
import './DelegateFormCards.scss';
import DelegateFormListing from '../../components/FormCards/DelegateFormListing';
import {UserRole} from '../../models/Enums';
import {DelegateFormCompletion} from '../../components/FormCards/DelegateFormListing';

interface DelegateFormCardsProps {
  userType: UserRole;
}

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

const DelegateFormCards: React.FC<DelegateFormCardsProps> = props => {
  return (
    <div className="delegate-form-cards-container">
      <Navbar activeLink="Forms" />
      <div className="delegate-form-cards-inner-container">
        <div className="delegate-form-cards-grid-container">
          <DelegateFormListing
            title="Delegate Form"
            conference="Technology Conference"
            completed={false}
            userType={props.userType}
            delegates={delegateData}
          />
          <DelegateFormListing
            title="Food Form"
            conference="Technology Conference"
            completed={true}
            userType={props.userType}
            delegates={delegateData}
          />
        </div>
      </div>
    </div>
  );
};

export default DelegateFormCards;
