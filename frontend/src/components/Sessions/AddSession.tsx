import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import { ROOT_V1, ROOT_V2 } from '../../utils/APIConstants';
import AddButton from '../../assets/add-button.svg';
import './AddSession.scss';
import Card from '../Cards/Card';
import TextFieldInput from '../InputFields/TextFieldInput';

interface AddSessionProps {
    streamNumber: string;
}

const AddSession: React.FC<AddSessionProps> = ({streamNumber}) => {
    const [addSessionForm, setAddSessionForm] = useState<boolean>(false);
    const [location, setLocation] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    function createSession() {
        axiosInstance
        .post(`${ROOT_V1}/session`, {
            Location: location,
            Duration_minutes: parseInt(duration),
            Title: title,
            Description: description,
            Start_time: `${startTime}:00Z`,
        })
        .then(res => {
            addSessionToStream(res.data.session_number);
        })
        .catch(err => console.error(err))
    }

    function addSessionToStream(sessionId: string) {
        axiosInstance
        .post(`${ROOT_V2}/stream/session`, {
            Stream_number: streamNumber,
            Session_number: sessionId
        })
        .then((res) => closeForm())
        .catch(err => console.error(err))
    }

    useEffect(() => {
        console.log(startTime);
    }, [startTime])

    function clearFields() {
        setLocation('');
        setDuration('');
        setTitle('');
        setDescription('');
    }

    function closeForm() {
        setAddSessionForm(false);
        clearFields();
    }

    function updateDuration(e: string) {
        if(parseInt(e) !== NaN) {
            console.log(parseInt(e))
            setDuration(e)
        }
    }

    return (
        <>
            <img className="stream-add-button" src={AddButton} onClick={() => setAddSessionForm(true)} />
            {
                addSessionForm &&
                <div className='add-session-form-container'>
                    <Card class='form-container'>
                        <>
                            <p className='add-session-close-button' onClick={closeForm}>X</p>
                            <h3>Create a Session</h3>
                            <TextFieldInput input={title} setInput={setTitle} placeHolder='Session Title' />
                            <TextFieldInput input={description} setInput={setDescription} placeHolder='Session Description' />
                            <TextFieldInput input={location} setInput={setLocation} placeHolder='Session Location' />
                            <TextFieldInput input={duration} setInput={updateDuration} placeHolder='Session Duration' type={'number'}/>
                            <TextFieldInput input={startTime} setInput={setStartTime} type='datetime-local' placeHolder=''/>
                            <a className='btn btn-primary--red' onClick={createSession}>Create Session</a>
                        </>
                    </Card>
                </div>
            }
        </>
    )
}

export default AddSession;