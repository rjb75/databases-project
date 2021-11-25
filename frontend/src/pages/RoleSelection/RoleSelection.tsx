import React, {useState} from 'react';
import {UserRole} from '../../models/Enums';
import SignUp from '../SignUp/SignUp';
import './RoleSelection.scss';

const RoleSelection: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [goToForm, setGoToForm] = useState(false);

  const handleNext = () => {
    if(role) {
      setGoToForm(true);
    }
  }

  return (
    <div>
      {goToForm ? (
        <SignUp role={role} />
      ) : (
        <div className="role-selection-container">
          <div className="role-form-container">
            <h1>What is your role?</h1>
            <div className="role-options-container">
              <div className="columns-container">
                <div
                  className={`role-column role-column-one ${
                    role === UserRole.Delegate ? 'role-active' : ''
                  }`}
                  onClick={() => setRole(UserRole.Delegate)}
                >
                  <h3>{UserRole.Delegate}</h3>
                </div>
                <div
                  className={`role-column role-column-two ${
                    role === UserRole.HeadDelegate ? 'role-active' : ''
                  }`}
                  onClick={() => setRole(UserRole.HeadDelegate)}
                >
                  <h3>{UserRole.HeadDelegate}</h3>
                </div>
                <div
                  className={`role-column role-column-three ${
                    role === UserRole.Organizer ? 'role-active' : ''
                  }`}
                  onClick={() => setRole(UserRole.Organizer)}
                >
                  <h3>{UserRole.Organizer}</h3>
                </div>
              </div>
            </div>
            <div className="role-next-button" onClick={handleNext}>Next ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
