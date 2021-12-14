import React, {useState} from 'react';
import Navbar from '../../components/Navbar';
import './DelegateFormCards.scss';
import DelegateFormListing from '../../components/FormCards/DelegateFormListing';

interface DelegateFormCardsProps {}

const DelegateFormCards: React.FC<DelegateFormCardsProps> = props => {
  return (
    <div className="delegate-form-cards-container">
      <Navbar activeLink="Forms" />
      <div className="delegate-form-cards-inner-container">
        <div className="delegate-form-cards-grid-container">
            <DelegateFormListing title='Delegate Form' conference='Technology Conference' completed={false} />
            <DelegateFormListing title='Food Form' conference='Technology Conference' completed={true} />
        </div>
      </div>
    </div>
  );
};

export default DelegateFormCards;
