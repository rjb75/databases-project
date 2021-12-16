import {RootState} from '../../store';

export const selectFillingForm = (state: RootState) => state.form.fillingForm;
export const selectViewSubmissionForm = (state: RootState) => state.form.viewFormSubmissions;
export const selectSingleFormSubmission = (state: RootState) => state.form.singleFormSubmission;
