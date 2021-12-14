import React, {useState} from 'react';
import Navbar from '../../components/Navbar';
import './OrganizerFormCards.scss';
import FormListing from '../../components/Forms/FormListing';

interface OrganizerFormCardsProps {}

const OrganizerFormCards: React.FC<OrganizerFormCardsProps> = props => {
  return (
    <div className="organizer-form-cards-container">
      <Navbar activeLink="Forms" />
      <div className="organizer-form-cards-inner-container">
        <div className="organizer-form-cards-buttons-container">
          <div className="organizer-form-cards-button">Create New Form</div>
        </div>
        <div className="organizer-form-cards-grid-container">
          <FormListing title="Head Delegate Form" questions={5} responses={24} editable={true} />
          <FormListing title="Delegate Form" questions={11} responses={142} editable={true} />
          <FormListing title="Food Form" questions={3} responses={5} editable={true} />
        </div>
      </div>
    </div>
  );
};

export default OrganizerFormCards;
