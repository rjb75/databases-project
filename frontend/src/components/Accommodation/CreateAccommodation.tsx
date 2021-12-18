import React, { useState } from 'react';
import { selectEventContext } from '../../actions/eventActions/eventSelector';
import axiosInstance from '../../axios';
import { useTypedSelector } from '../../hooks/reduxHooks';
import { ROOT_V1 } from '../../utils/APIConstants';
import Card from '../Cards/Card';
import TextFieldInput from '../InputFields/TextFieldInput';
import './CreateAccommodation.scss';

const CreateAccommodation: React.FC = () => {
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [capacity, setCapacity] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [province, setProvince] = useState<string>('');
    const [streetAddress, setStreetAddress] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [roomCode, setRoomCode] = useState<string>(''); 
    const [error, setError] = useState<string>('');

    const eventContext = useTypedSelector(selectEventContext);

    function validateFields(): boolean {
        if(
            parseInt(capacity) > 0 &&
            country !== '' &&
            province !== '' &&
            streetAddress !== '' &&
            postalCode !== '' &&
            parseFloat(roomCode) > 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    function addAccommodation() {
        setError('');
        if(validateFields()) {
            axiosInstance
            .post(`${ROOT_V1}/accommodation`, {
                Capacity: parseInt(capacity),
                Country: country,
                Province: province,
                Street_address: streetAddress,
                Postal_code: postalCode,
                Event_id: eventContext.id,
                Room_code: roomCode
            })
            .then(closeForm)
            .catch((err) => setError(err))
        } else {
            setError('Invalid Input');
        }
    }

    function clearForm() {
        setCapacity('');
        setCountry('');
        setProvince('');
        setStreetAddress('');
        setPostalCode('');
        setRoomCode('');
    }

    function closeForm() {
        clearForm();
        setFormVisible(false);
    }

    return (
        <>
            <a className='btn btn-primary--purple add-accommodation-button' onClick={() => setFormVisible(true)}>Create Accommodation</a>
            {
                formVisible &&
                <div className='add-accommodation-form-container'>
                    <Card class='form-container'>
                        <div className='form-container'>
                            <p className='add-accommodation-close-button' onClick={closeForm}>X</p>
                            <h3>Create an Accommodation</h3>
                            <TextFieldInput input={capacity} setInput={setCapacity} placeHolder='Capacity' type='number' />
                            <TextFieldInput input={country} setInput={setCountry} placeHolder='Country'/>
                            <TextFieldInput input={province} setInput={setProvince} placeHolder='Province' />
                            <TextFieldInput input={streetAddress} setInput={setStreetAddress} placeHolder='Address' />
                            <TextFieldInput input={postalCode} setInput={setPostalCode} placeHolder='Postal Code' />
                            <TextFieldInput input={roomCode} setInput={setRoomCode} placeHolder='Room Code' type='number' />
                            {
                                error !== '' &&
                                <p className='text--red'>{error}</p>
                            }
                            <a className='btn btn-primary--red' onClick={addAccommodation}>Add Accommodation</a>
                        </div>
                    </Card>
                </div>
            }
        </>
    )
}

export default CreateAccommodation;