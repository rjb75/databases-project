import React, {useState} from 'react';
import Card from '../Cards/Card';
import {CardSize} from '../Cards/CardUtils';
import {StreamsProps, Stream} from './StreamUtils';
import './StreamsListing.scss';
import SessionsListing from './SessionsListing';
import Modal from 'react-modal';
import TextFieldInput from '../InputFields/TextFieldInput';
import {useTypedSelector} from '../../hooks/reduxHooks';
import {selectEventContext} from '../../actions/eventActions/eventSelector';
import {selectUserData} from '../../actions/userActions/userSelectors';
import {UserRole} from '../../models/Enums';
import axiosInstance from '../../axios';
import {ROOT_V1} from '../../utils/APIConstants';
import AddStream from './AddStream';
import AddSession from './AddSession';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const StreamsListing: React.FC<StreamsProps> = ({streams}) => {
  Modal.setAppElement('#root');
  const userContext = useTypedSelector(selectUserData);
  const currentevent = useTypedSelector(selectEventContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteEmailErrors, setInviteEmailErrors] = useState('');
  const [inviteStream, setInviteStream] = useState<Stream>(null);

  const validateData = () => {
    setInviteEmailErrors('');
    if (!inviteEmail) {
      setInviteEmailErrors('Please enter an email.');
      return false;
    }

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inviteEmail)) {
      setInviteEmailErrors('Please enter a valid email.');
      return false;
    }

    return true;
  };

  const handleClose = () => {
    setInviteEmailErrors('');
    setInviteEmail('');
    setInviteStream(null);
    setModalOpen(false);
  };

  const handleInviteClick = (s: Stream) => {
    setInviteStream(s);
    setModalOpen(true);
  };

  const onSubmit = () => {
    if (validateData()) {
      axiosInstance
        .post(`${ROOT_V1}/event/invite`, {
          Event_id: currentevent.id,
          Stream_number: inviteStream.uuid,
          User_email: inviteEmail,
          Event_name: currentevent.name,
          Stream_name: inviteStream.title,
        })
        .then(res => {
          handleClose();
          console.log('send email response: ', res);
        })
        .catch(err => console.log('send email error: ', err));
    }
  };

  return (
    <div className="stream-listing">
      {streams ? (
        streams.map(s => {
          return (
            <Card size={CardSize.Large} key={s.uuid}>
              <>
                { 
                  userContext.data.role === UserRole.Organizer &&
                  <AddSession streamNumber={s.uuid} />
                }
                <div className="stream-listing-title-container">
                  <h2>{s.title}</h2>
                  {userContext.Role == UserRole.Organizer && (
                    <p className="stream-listing-invite" onClick={() => handleInviteClick(s)}>
                      Invite Attendee
                    </p>
                  )}
                </div>
                <SessionsListing sessions={s.sessions} />
              </>
            </Card>
          );
        })
      ) : (
        <p>No Streams Found</p>
      )}
      <Modal isOpen={modalOpen} onRequestClose={handleClose} style={customStyles}>
        <div className="add-form-container">
          <div className="add-form-inner-container">
            <h3 className="form-dialog-title">Invite Attendee</h3>
            <TextFieldInput
              placeHolder="Enter Invitee Email"
              input={inviteEmail}
              setInput={setInviteEmail}
              error={inviteEmailErrors}
            />
            <button className="add-form-submit-button" onClick={onSubmit}>
              Invite
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StreamsListing;
