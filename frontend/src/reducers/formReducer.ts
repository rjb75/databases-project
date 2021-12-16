import {FILL_FORM} from '../actions/formActions/formTypes';

interface Action {
  type: string;
  payload?: any;
}

interface FormState {
  fillingForm: string;
}

const initialState: FormState = {
  fillingForm: null,
};

const formReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case FILL_FORM:
      return {
        ...state,
        fillingForm: action.payload,
      };
    default:
      return state;
  }
};

export default formReducer;
