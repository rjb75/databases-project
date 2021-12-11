import React, {useState} from 'react';
import {ReactFormGenerator} from 'react-form-builder3';
import 'react-form-builder3/dist/app.css';
import './FormGenerator.scss';

interface FormGeneratorProps {
  formContent: string;
}

const formContent = {
  task_data: [
    {
      key: 'Header',
      name: 'Header Text',
      icon: 'fas fa-heading',
      static: true,
      content: '<p style="text-align:center;">Post Event Form ',
      id: '4EF154B7-FC69-44CD-914A-9F0788975442',
      element: 'Header',
      text: 'Header Text',
      required: false,
      bold: false,
      italic: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: true,
    },
    {
      key: 'Paragraph',
      name: 'Paragraph',
      static: true,
      icon: 'fas fa-paragraph',
      content: 'This form is optional ',
      id: '76A1D1C9-69E0-4659-A664-2833025C858B',
      element: 'Paragraph',
      text: 'Paragraph',
      required: false,
      bold: false,
      italic: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: true,
    },
    {
      key: 'Dropdown',
      canHaveAnswer: true,
      name: 'Dropdown',
      icon: 'far fa-caret-square-down',
      label: 'What is your gender ',
      field_name: 'dropdown_8E7F9A1B-6F2C-4BE9-B7C4-ECB4492CA252',
      options: [
        {
          value: 'male',
          text: 'Male',
          key: 'dropdown_option_267CA0D4-0974-4AE7-A0DA-0B54A939E1F7',
        },
        {
          value: 'female',
          text: 'Female',
          key: 'dropdown_option_DA0CEF84-FEA8-4993-8386-2FFBB2769355',
        },
        {
          value: 'other',
          text: 'Other',
          key: 'dropdown_option_CD170967-5856-4E24-B337-D9FA21F3C161',
        },
      ],
      id: 'F58B32C7-469D-4A6B-BFD5-9E2BDECBCA04',
      element: 'Dropdown',
      text: 'Dropdown',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: true,
    },
    {
      key: 'Checkboxes',
      canHaveAnswer: true,
      name: 'Checkboxes',
      icon: 'far fa-check-square',
      label: 'What is your gender rooming preference? ',
      field_name: 'checkboxes_9670B055-BBA1-4AF9-9A6E-05304B84165F',
      options: [
        {
          value: 'comfortable_with_males',
          text: 'Comfortable with Males',
          key: 'checkboxes_option_469EE79D-F03F-43BE-B84C-DAA8114FD5E6',
        },
        {
          value: 'comfortable_with_females',
          text: 'Comfortable with Females',
          key: 'checkboxes_option_E4C5820A-7ACE-43D4-B197-433335912B38',
        },
        {
          value: 'comfortable_with_non_binary',
          text: 'Comfortable with Non-Binary',
          key: 'checkboxes_option_25A129A3-AB5E-493D-81DB-68EF087C9EF7',
        },
      ],
      id: 'EF5BEE63-8960-4832-95F1-736579A6ED98',
      element: 'Checkboxes',
      text: 'Checkboxes',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: true,
    },
    {
      key: 'RadioButtons',
      canHaveAnswer: true,
      name: 'Multiple Choice',
      icon: 'far fa-dot-circle',
      label: 'Which speaker did you enjoy the most? ',
      field_name: 'radiobuttons_B75EF64A-9CAA-465E-92F2-580303E52C54',
      options: [
        {
          value: 'speaker_a',
          text: 'Speaker A',
          key: 'radiobuttons_option_B35F18B8-7245-4F43-8620-34BB5E3EC613',
        },
        {
          value: 'speaker_b',
          text: 'Speaker B',
          key: 'radiobuttons_option_6F57C96E-2582-4A98-83FE-5F24F9C0D953',
        },
        {
          value: 'speaker_c',
          text: 'Speaker C',
          key: 'radiobuttons_option_0140D4D3-1F78-4720-A81C-7B8BAFF86337',
        },
      ],
      id: 'AFB77A4A-E33F-4400-8714-B2E7FDB90CBC',
      element: 'RadioButtons',
      text: 'Multiple Choice',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: true,
    },
    {
      key: 'TextInput',
      canHaveAnswer: true,
      name: 'Text Input',
      label: 'What are you looking forward to at the conference? ',
      icon: 'fas fa-font',
      field_name: 'text_input_C9C1DFD1-48F1-4A31-95CF-A46E499CD7A1',
      id: '88EE93CB-D499-4AAB-92A8-B695A766940E',
      element: 'TextInput',
      text: 'Text Input',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: false,
    },
    {
      key: 'NumberInput',
      canHaveAnswer: true,
      name: 'Number Input',
      label: 'How many events did you attend with us? ',
      icon: 'fas fa-plus',
      field_name: 'number_input_9B877AC9-4774-44C4-9734-55EC619FFE72',
      id: 'DFFAC715-805B-4EB2-AE08-864BC3433C89',
      element: 'NumberInput',
      text: 'Number Input',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: false,
    },
    {
      key: 'Range',
      name: 'Range',
      icon: 'fas fa-sliders-h',
      label: 'How easy was it to hear the speakers ',
      field_name: 'range_F4D16156-05A5-40D3-B672-0242B3E0A107',
      step: 1,
      default_value: 3,
      min_value: 1,
      max_value: 5,
      min_label: 'Easy',
      max_label: 'Difficult',
      id: '9462F20D-8316-484D-A4A7-99268A63A060',
      element: 'Range',
      text: 'Range',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: true,
    },
    {
      key: 'Camera',
      name: 'Camera',
      icon: 'fas fa-camera',
      label: 'Add any pictures from the event ',
      field_name: 'camera_9B982A9B-1DB4-4B29-A716-014C6DF0D4FD',
      id: '03CEA02B-BD96-40C8-A1C2-8BDA164FE9BA',
      element: 'Camera',
      text: 'Camera',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: false,
    },
    {
      key: 'DatePicker',
      canDefaultToday: true,
      canReadOnly: true,
      dateFormat: 'MM/dd/yyyy',
      timeFormat: 'hh:mm aa',
      showTimeSelect: false,
      showTimeSelectOnly: false,
      name: 'Date',
      icon: 'far fa-calendar-alt',
      label: "Today's date ",
      field_name: 'date_picker_0AF69C67-7CC5-4901-80DB-189CB2D441DB',
      id: 'A31DA480-676F-4185-9FD7-B716DBC4325E',
      element: 'DatePicker',
      text: 'Date',
      required: false,
      readOnly: false,
      defaultToday: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: false,
    },
    {
      key: 'Rating',
      canHaveAnswer: true,
      name: 'Rating',
      label: 'How would you rate the event? ',
      icon: 'fas fa-star',
      field_name: 'rating_6B790101-EB7B-4472-BCCD-8C61EE625A97',
      id: '2D21903C-6F2E-475F-BEA2-89AB8D4B4FF3',
      element: 'Rating',
      text: 'Rating',
      required: false,
      canHavePageBreakBefore: true,
      canHaveAlternateForm: true,
      canHaveDisplayHorizontal: true,
      canHaveOptionCorrect: true,
      canHaveOptionValue: true,
      canPopulateFromApi: true,
      dirty: false,
    },
  ],
};


const FormGenerator: React.FC<FormGeneratorProps> = props => {
  // const jsonForm = JSON.parse(props.formContent);

  const handleSubmit = (data: any) => {
    const stringForm = JSON.stringify(formContent);
    console.log('stringfied form is: ', stringForm);

    // call api to store the form
  }

  return (
    <div className="form-generator-container">
      <div className="form-generator-inner-container">
        <div className="form-container">
          <ReactFormGenerator
            data={formContent.task_data}
            submitButton={
              <button type='submit' className='submit-form-button'>
                Submit
              </button>
            }
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FormGenerator;
