import { EVENT_CONTEXT_RESET, EVENT_CONTEXT_SET } from "../actions/eventActions/eventTypes";
import { Event } from '../models/Event';

interface Action {
    type: string;
    payload?: any;
}

const initialState: Event = {
    id: null,
    name: null
};

const eventReducer = (state = initialState, action: Action) => {
    switch(action.type) {
        case EVENT_CONTEXT_SET:
            return {
                ...state,
                ...action.payload,
            };
        case EVENT_CONTEXT_RESET:
            return {
                id: null,
                name: null,
            }
        default:
            return state;
    }
}

export default eventReducer;