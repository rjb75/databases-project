import React, {useState} from 'react';
import Card from '../Cards/Card';
import TextFieldInput from '../InputFields/TextFieldInput';
import './AddStream.scss';
import axiosInstance from '../../axios';
import {ROOT_V1, ROOT_V2} from '../../utils/APIConstants';
import {useTypedSelector} from '../../hooks/reduxHooks';

const AddStream: React.FC = () => {
  const [addStreamForm, setAddStreamForm] = useState<boolean>(false);
  const [streamName, setStreamName] = useState<string>('');
  const eventContext = useTypedSelector(state => state.event);

  function addStream() {
    if (streamName !== '') {
      axiosInstance
        .post(`${ROOT_V1}/stream`, {
          Title: streamName,
          Event_id: eventContext.id,
        })
        .then(res => {
          setStreamName('');
          setAddStreamForm(false);
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <>
      <a className='btn btn-primary--purple' onClick={() => setAddStreamForm(true)}>Create a Stream</a>
      {addStreamForm && (
        <div className="add-stream-form-container">
          <Card class="form-container">
            <>
              <h3>Create a Stream</h3>
              <TextFieldInput
                input={streamName}
                setInput={setStreamName}
                isPassword={false}
                placeHolder="Stream Title"
              />
              <a className="btn btn-primary--red" onClick={() => addStream()}>
                Add Stream
              </a>
            </>
          </Card>
        </div>
      )}
    </>
  );
};

export default AddStream;
