import {
  FILL_FORM,
  VIEW_FORM_SUBMISSIONS,
  VIEW_SINGLE_FORM_SUBMISSION,
} from '../actions/formActions/formTypes';

interface Action {
  type: string;
  payload?: any;
}

interface FormState {
  fillingForm: string;
  viewFormSubmissions: string;
  singleFormSubmission: string;
}

const initialState: FormState = {
  fillingForm: null,
  viewFormSubmissions: null,
  singleFormSubmission: null,
};

const formReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case FILL_FORM:
      return {
        ...state,
        fillingForm: action.payload,
      };
    case VIEW_FORM_SUBMISSIONS:
      return {
        ...state,
        viewFormSubmissions: action.payload,
      };
    case VIEW_SINGLE_FORM_SUBMISSION:
      return {
        ...state,
        singleFormSubmission: action.payload,
      };
    default:
      return state;
  }
};

export default formReducer;
