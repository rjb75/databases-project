import React, { useState } from 'react';
import axiosInstance from '../../axios';
import { ROOT_V1 } from '../../utils/APIConstants';
import AddButton from '../../assets/add-button.svg';
import './AddSession.scss';
import Card from '../Cards/Card';
import TextFieldInput from '../InputFields/TextFieldInput';

const AddSession: React.FC = () => {
    const [addSessionForm, setAddSessionForm] = useState<boolean>(false);
    const [location, setLocation] = useState<string>('');
    const [duration, setDuration] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    function createSession() {
        axiosInstance
        .post(`${ROOT_V1}/session`, {
            Location: location,
            Duration_minutes: duration,
            Title: title,
            Description: description,
        })
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }

    return (
        <>
            <img className="stream-add-button" src={AddButton} onClick={() => setAddSessionForm(true)} />
            {
                addSessionForm &&
                <div className='add-session-form-container'>
                    <Card class='form-container'>
                        <>
                            <h3>Create a Session</h3>
                            <TextFieldInput input={title} setInput={setTitle} isPassword={false} placeHolder='Session Title' />
                            <TextFieldInput input={description} setInput={setDescription} isPassword={false} placeHolder='Session Description' />
                            <TextFieldInput input={location} setInput={setLocation} isPassword={false} placeHolder='Session Location' />
                            <a className='btn btn-primary--red' onClick={createSession}>Create Session</a>
                        </>
                    </Card>
                </div>
            }
        </>
    )
}

export default AddSession;