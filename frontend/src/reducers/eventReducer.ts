import {
  EVENT_CONTEXT_RESET,
  EVENT_CONTEXT_SET,
  EVENT_LIST_SET,
} from '../actions/eventActions/eventTypes';
import {Event} from '../models/Event';

interface Action {
  type: string;
  payload?: any;
}

interface initialStateInterface {
  event: Event;
  list: Array<Event>;
}

const initialState: initialStateInterface = {
  event: {
    id: '',
    name: '',
  },
  list: [],
};

const eventReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case EVENT_CONTEXT_SET:
      return {
        ...state,
        event: {...action.payload},
      };
    case EVENT_CONTEXT_RESET:
      return {
        event: {id: null, name: null},
        list: [],
      };
    case EVENT_LIST_SET:
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};

export default eventReducer;
