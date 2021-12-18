import React, { useState } from 'react';
import axiosInstance from '../../axios';
import { ROOT_V2 } from '../../utils/APIConstants';
import Card from '../Cards/Card';
import TextFieldInput from '../InputFields/TextFieldInput';
import './AssignAccommodation.scss';

interface AssignAccommodationProps {
    roomId: string
}

const AssignAccommodation: React.FC<AssignAccommodationProps> = ({roomId}) => {
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    function assignToAccommodation() {
        if(email != '') {
            setError('');
            axiosInstance
            .post(`${ROOT_V2}/accommodation/attendee`, {
                Accommodation_id: roomId,
                Attendee_email: email
            })
            .then((res) => closeForm())
            .catch((err) => setError(err))
        }
    }

    function clearForm() {
        setEmail('');
    }

    function closeForm() {
        clearForm();
        setFormVisible(false);
    }

    return (
        <>
            <a className='btn btn-primary--orange' onClick={() => setFormVisible(true)}>+</a>
            {
                formVisible &&
                <div className='assign-accommodation-form-container'>
                    <Card class='form-container'>
                        <div className='form-container'>
                            <p className='assign-accommodation-close-button' onClick={closeForm}>X</p>
                            <h3>Add Attendee to Room</h3>
                            <TextFieldInput input={email} setInput={setEmail} placeHolder='Attendee Email'/>
                            <a className='btn btn-primary--red'>Assign Accommodation</a>
                        </div>
                    </Card>
                </div>
            }
        </>
    )
}

export default AssignAccommodation;