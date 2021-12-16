import {FILL_FORM, VIEW_FORM_SUBMISSIONS, VIEW_SINGLE_FORM_SUBMISSION} from './formTypes';

interface SingleSubmissionPayload {
  Data: string;
  AnswerData: string;
}

export const fillForm = (formId: string) => ({
  type: FILL_FORM,
  payload: formId,
});

export const viewFormSubmissions = (formId: string) => ({
  type: VIEW_FORM_SUBMISSIONS,
  payload: formId,
});

export const viewSingleFormSubmission = (data: SingleSubmissionPayload) => ({
  type: VIEW_SINGLE_FORM_SUBMISSION,
  payload: data,
});
