import React, {useState, useEffect} from 'react';
import Navbar from '../../components/Navbar';
import './OrganizerFormTable.scss';
import Table from '../../components/Table/Table';
import {useTypedSelector, useTypedDispatch} from '../../hooks/reduxHooks';
import { viewFormSubmissions, viewSingleFormSubmission } from '../../actions/formActions/formActionCreators';
import {selectViewSubmissionForm} from '../../actions/formActions/formSelectors';
import axiosInstance from '../../axios';
import {ROOT_V1} from '../../utils/APIConstants';
import {useNavigate} from 'react-router-dom';

interface OrganizerFormTableProps {
  
}

interface FormSubmissionData {
  Data: string;
  Answer_data: string;
	Name: string;
	Dietary_restriction: string;
	Preferred_language: string;
	School_name: string;
	Stream: string;
	Registration_status: string
}

const headers = [
  {Header: 'Name', accessor: 'Name'},
  {Header: 'School', accessor: 'School_name'},
  {Header: 'Stream', accessor: 'Stream'},
  {Header: 'Dietary Restriction', accessor: 'Dietary_restriction'},
  {Header: 'Preferred Language', accessor: 'Preferred_language'},
  {Header: 'Registration Status', accessor: 'Registration_status'},
];

const OrganizerFormTable: React.FC<OrganizerFormTableProps> = props => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const formId = useTypedSelector(selectViewSubmissionForm);
  const [tableData, setTableData] = useState<Array<FormSubmissionData>>([]);

  const handleTableRowClicked = (data: string, answerData: string) => {
    console.log("ececution function called", data);
    dispatch(viewSingleFormSubmission({Data: data, AnswerData: answerData}));
    navigate('/view-form-submission');
  } 

  useEffect(() => {
    axiosInstance
        .get(`${ROOT_V1}/forms/submissions/${formId}`)
        .then(res => {
          console.log('get form submissions response: ', res);
          setTableData(res.data.data);
        })
        .catch(err => console.log('get form submissions error: ', err));
  }, []);

  return (
    <div className="organizer-form-table-container">
      <Navbar displayTabs={false} />
      <div className="organizer-form-table-inner-container">
        <div className="organizer-form-table-buttons-container">
          <div className="organizer-form-table-button" onClick={() => navigate('/form-cards')}>
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.75 14.5C21.75 14.7404 21.6546 14.9709 21.4846 15.1409C21.3146 15.3108 21.0841 15.4063 20.8438 15.4063H10.344L14.2354 19.2959C14.3197 19.3802 14.3865 19.4802 14.4321 19.5903C14.4777 19.7004 14.5012 19.8184 14.5012 19.9375C14.5012 20.0567 14.4777 20.1747 14.4321 20.2848C14.3865 20.3949 14.3197 20.4949 14.2354 20.5792C14.1511 20.6634 14.0511 20.7303 13.941 20.7759C13.8309 20.8215 13.7129 20.8449 13.5938 20.8449C13.4746 20.8449 13.3566 20.8215 13.2465 20.7759C13.1364 20.7303 13.0364 20.6634 12.9522 20.5792L7.51466 15.1417C7.43026 15.0575 7.3633 14.9575 7.31762 14.8474C7.27193 14.7373 7.24841 14.6192 7.24841 14.5C7.24841 14.3808 7.27193 14.2628 7.31762 14.1527C7.3633 14.0426 7.43026 13.9426 7.51466 13.8584L12.9522 8.42092C13.1223 8.25075 13.3531 8.15515 13.5938 8.15515C13.8344 8.15515 14.0652 8.25075 14.2354 8.42092C14.4056 8.59109 14.5012 8.82189 14.5012 9.06255C14.5012 9.3032 14.4056 9.534 14.2354 9.70417L10.344 13.5938H20.8438C21.0841 13.5938 21.3146 13.6893 21.4846 13.8592C21.6546 14.0292 21.75 14.2597 21.75 14.5Z"
                fill="#4F4F4F"
              />
            </svg>

            {'Return'}
          </div>
          <div className="organizer-form-table-button">Edit Form</div>
        </div>
        <h1 className="organizer-form-table-title">Delegate Form Table</h1>
        <div className="organizer-form-table-container">
          <Table columns={headers} data={tableData} clickable={true} clickExecution={handleTableRowClicked}/>
        </div>
      </div>
    </div>
  );
};

export default OrganizerFormTable;
