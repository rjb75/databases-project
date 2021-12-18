import React, { useEffect, useState } from 'react';
import { setEventContext } from '../../actions/eventActions/eventActionCreator';
import { selectUserData } from '../../actions/userActions/userSelectors';
import axiosInstance from '../../axios';
import { useTypedDispatch, useTypedSelector } from '../../hooks/reduxHooks';
import { selectEventContext } from '../../actions/eventActions/eventSelector';
import { Event, formatEvents } from '../../models/Event';
import { ROOT_V1, ROOT_V2 } from '../../utils/APIConstants';
import './EventSelector.scss';

const EventSelector: React.FC = () => {
    

    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const [eventList, setEventList] = useState<Event[]>([]);

    const eventContext = useTypedSelector(selectEventContext)
    const userContext = useTypedSelector(selectUserData)
    const dispatch = useTypedDispatch()

    useEffect(() => {
        axiosInstance
        .get(`${ROOT_V2}/attendee/event/${userContext.Email}`)
        .then(res => {
            console.log(res);
            setEventList(formatEvents(res.data.data))
        })
        .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        if(eventList.length === 1) {
            dispatch(setEventContext(eventList[0]))
        }
    }, [eventList])

    function handleSelectEvent(event: Event) {
        dispatch(setEventContext(event));
        setDropDownOpen(false);
    }

    function handleOpenDropdown() {
        if(eventList.length > 1) {
            setDropDownOpen(true);
        }
    }

    return (
        <>
            {
                true &&
                <div className='event-selector'>
                    <div className='current-event-container' onClick={handleOpenDropdown}>
                        <p className={`current-event-text ${eventList.length > 1 && 'enable-dropdown'}`}>{eventContext.name || 'Select an Event'}</p>
                    </div>
                    {
                        dropDownOpen &&
                        <div className='event-dropdown-list'>
                            {
                                eventList.map((e) => {
                                    return (
                                        <p className='event-item' key={e.id} onClick={() => handleSelectEvent(e)}>{e.name}</p>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default EventSelector;