import React, {useState, useEffect} from 'react';
import Navbar from '../../components/Navbar';
import './FormCards.scss';
import OrganizerFormListing from '../../components/FormCards/OrganizerFormListing';
import {UserRole} from '../../models/Enums';
import DelegateFormListing from '../../components/FormCards/DelegateFormListing';
import {useTypedSelector} from '../../hooks/reduxHooks';
import {selectUserData} from '../../actions/userActions/userSelectors';
import {ROOT_V1} from '../../utils/APIConstants';
import {useNavigate} from 'react-router-dom';
import {removeInvlaidCharacters} from '../../utils/JSONUtils';
import axiosInstance from '../../axios';
import {selectEventContext} from '../../actions/eventActions/eventSelector';

interface FormCardsProps {}

interface OrganizerForm {
  Created_by: string;
  Data: string;
  Event_id: string;
  Id: string;
  Form_name: string;
  Responses: number;
}

export interface DelegateResponse {
  Name: string;
  Response: number;
}

interface HeadForm {
  Created_by: string;
  Data: string;
  Event_id: string;
  Id: string;
  Form_name: string;
  Head_response: number;
  Delegate_responses: Array<DelegateResponse>;
}

interface DelegateForm {
  Created_by: string;
  Data: string;
  Event_id: string;
  Id: string;
  Form_name: string;
  Response: number;
}

const FormCards: React.FC<FormCardsProps> = props => {
  const navigate = useNavigate();
  const userData = useTypedSelector(selectUserData);
  const eventId = useTypedSelector(selectEventContext)?.id;
  const [organizerEventForms, setOrganizerEventForms] = useState<Array<OrganizerForm>>([]);
  const [headEventForms, setHeadEventForms] = useState<Array<HeadForm>>([]);
  const [delegateEventForms, setDelegateEventForms] = useState<Array<DelegateForm>>([]);

  useEffect(() => {
    if (eventId) {
      if (userData.Role == UserRole.Organizer) {
        axiosInstance
          .get(`${ROOT_V1}/forms/organizer/${eventId}`)
          .then(res => {
            console.log('get forms response: ', res);
            setOrganizerEventForms(res.data.data);
          })
          .catch(err => console.log('get forms error: ', err));
      } else if (userData.Role == UserRole.HeadDelegate) {
        axiosInstance
          .get(`${ROOT_V1}/forms/head/${eventId}/${userData.Attendee_id}`)
          .then(res => {
            console.log('get head forms response: ', res);
            setHeadEventForms(res.data.data);
          })
          .catch(err => console.log('get forms error: ', err));
      } else {
        axiosInstance
          .get(`${ROOT_V1}/forms/delegate/${eventId}/${userData.Attendee_id}`)
          .then(res => {
            console.log('get delegate forms response: ', res);
            setDelegateEventForms(res.data.data);
          })
          .catch(err => console.log('get forms error: ', err));
      }
    }
  }, [eventId]);

  return (
    <div className="form-cards-container">
      <Navbar activeLink="Forms" />
      <div className="form-cards-inner-container">
        {userData.Role == UserRole.Organizer && (
          <div className="form-cards-buttons-container">
            <div className="form-cards-button" onClick={() => navigate('/form-builder')}>
              Create New Form
            </div>
          </div>
        )}
        <>
          <div className="form-cards-grid-container">
            {userData.Role == UserRole.Organizer ? (
              <>
                {organizerEventForms?.map((form, index) => (
                  <OrganizerFormListing
                    key={index}
                    formId={form.Id}
                    title={form.Form_name}
                    questions={JSON.parse(removeInvlaidCharacters(form.Data)).task_data.length}
                    responses={form.Responses}
                    editable={true}
                  />
                ))}
              </>
            ) : userData.Role == UserRole.HeadDelegate ? (
              <>
                {headEventForms?.map((form, index) => (
                  <DelegateFormListing
                    key={index}
                    formId={form.Id}
                    title={form.Form_name}
                    conference="Technology Conference"
                    completed={form.Head_response > 0}
                    userType={userData.Role}
                    delegates={form.Delegate_responses ? form.Delegate_responses : []}
                  />
                ))}
              </>
            ) : (
              <>
                {delegateEventForms?.map((form, index) => (
                  <DelegateFormListing
                    key={index}
                    formId={form.Id}
                    title={form.Form_name}
                    conference="Technology Conference"
                    completed={form.Response > 0}
                    userType={userData.Role}
                  />
                ))}
              </>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default FormCards;
