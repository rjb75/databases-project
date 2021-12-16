import {FILL_FORM} from './formTypes';

export const fillForm = (formId: string) => ({
  type: FILL_FORM,
  payload: formId,
});
