import React, {useState, useEffect} from 'react';
import {Event} from '../../models/Event';
import {useTypedSelector} from '../../hooks/reduxHooks';
import {selectUserData} from '../../actions/userActions/userSelectors';
import axiosInstance from '../../axios';
import {ROOT_V1} from '../../utils/APIConstants';
import Modal from 'react-modal';
import DropDownField from '../InputFields/DropDownField';
import './EventItem.scss';

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

interface EventProps {
  event: Event;
}

interface Stream {
  Title: string;
  Stream_number: string;
  Event_id: string;
}

const EventItem: React.FC<EventProps> = ({event}) => {
  Modal.setAppElement('#root');
  const userData = useTypedSelector(selectUserData);
  const [isRegisteredInEvent, setIsRegisteredInEvent] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventStreams, setEventStreams] = useState([]);
  const [chosenStream, setChosenStream] = useState('');
  const [chooseStreamError, setChooseStreamError] = useState('');

  const handleClose = () => {
    setChooseStreamError('');
    setChosenStream('');
    setModalOpen(false);
  };

  const onSubmit = () => {
    setChooseStreamError('');
    if (!chosenStream) {
      setChooseStreamError('Please select a stream.');
    } else {
      axiosInstance
        .post(`${ROOT_V1}/participating`, {
          Stream_number: chosenStream,
          Attendee_id: userData.Attendee_id,
        })
        .then(res => {
          console.log('add is participating response: ', res);
          axiosInstance
            .post(`${ROOT_V1}/ticket`, {
              Attendee_id: userData.Attendee_id,
              Ticket_number: 0,
              Is_valid: '1',
              Event_id: event.id,
            })
            .then(res => {
              setIsRegisteredInEvent(true);
              handleClose();
              console.log('add ticket: ', res);
            })
            .catch(err => console.log('add ticket: ', err));
        })
        .catch(err => console.log('add is participating error: ', err));
    }
  };

  const handleButtonClick = () => {
    setModalOpen(true);
    axiosInstance
      .get(`${ROOT_V1}/streams/${event.id}`)
      .then(res => {
        console.log('streams response: ', res);

        res.data.data?.map((s: Stream) =>
          eventStreams.push({
            value: s.Stream_number,
            label: s.Title,
          })
        );
        setEventStreams([...eventStreams]);
      })
      .catch(err => console.log('get count participating error: ', err));
  };

  useEffect(() => {
    axiosInstance
      .get(`${ROOT_V1}/participating/count/event/${userData.Attendee_id}/${event.id}`)
      .then(res => {
        console.log('get count participating response: ', res);
        setIsRegisteredInEvent(res.data.data != 0);
      })
      .catch(err => console.log('get count participating error: ', err));
  }, []);

  return (
    <div className="event-item-container">
      <>
        <h3>{event.name}</h3>
        {!isRegisteredInEvent && (
          <>
            <h6 className="event-item-register" onClick={handleButtonClick}>
              Register
            </h6>
          </>
        )}
      </>

      <Modal isOpen={modalOpen} onRequestClose={handleClose} style={customStyles}>
        <div className="add-form-container">
          <div className="add-form-inner-container">
            <h3 className="form-dialog-title">Register In Event</h3>
            <DropDownField
              placeHolder="Select Stream"
              input={chosenStream}
              setInput={setChosenStream}
              options={eventStreams}
              error={chooseStreamError}
            />
            <button className="add-form-submit-button" onClick={onSubmit}>
              Register
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventItem;
