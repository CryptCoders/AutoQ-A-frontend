import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {Button} from 'primereact/button';
import {Tooltip} from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import TextArea from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import NotFound from "./NotFound.jsx";
import { formatQuestion, formatAnswer } from "./service/format.js";

const CustomTable = ({ qaData }) => {
	console.log(qaData)
	const dt = useRef (null);
	const counter = useRef(0);
	const [ visible, setVisible ] = useState(false);
	const [ modalHeader, setModalHeader ] = useState("");
	const [ modalContent, setModalContent ] = useState(<></>);
	const [ checkAnswer, setCheckAnswer ] = useState([]);
	const [ score, setScore ] = useState(undefined);
	
	const [filters, setFilters] = useState ({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		question: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		answer: { value: null, matchMode: FilterMatchMode.IN }
	});
	
	const [globalFilterValue, setGlobalFilterValue] = useState ('');
	const cols = [
		{ field: 'question', header: 'Questions' },
		{ field: 'answer', header: 'Answers' }
	]
	
	const exportColumns = cols.map ((col) => ({title: col.header, dataKey: col.field}));
	
	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = {...filters};
		
		_filters['global'].value = value;
		
		setFilters (_filters);
		setGlobalFilterValue (value);
	};
	const exportCSV = (selectionOnly) => {
		dt.current.exportCSV ({ selectionOnly });
	};
	
	const exportPdf = () => {
		import('jspdf').then ((jsPDF) => {
			import('jspdf-autotable').then (() => {
				const doc = new jsPDF.default (0, 0);
				doc.autoTable(exportColumns, qaData);
				doc.save ('question-answer');
			});
		});
	};
	
	const exportExcel = () => {
		import('xlsx').then ((xlsx) => {
			const worksheet = xlsx.utils.json_to_sheet (qaData);
			const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
			const excelBuffer = xlsx.write (workbook, {
				bookType: 'xlsx',
				type: 'array'
			});
			
			saveAsExcelFile (excelBuffer, 'question-answer');
		});
	};
	
	const saveAsExcelFile = (buffer, fileName) => {
		import('file-saver').then ((module) => {
			if (module && module.default) {
				let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
				let EXCEL_EXTENSION = '.xlsx';
				const data = new Blob ([buffer], {
					type: EXCEL_TYPE
				});
				
				module.default.saveAs (data, fileName + '_export_' + new Date ().getTime () + EXCEL_EXTENSION);
			}
		});
	};
	
	const header = (
		<div className="flex align-items-center justify-content-between gap-2">
			<span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange} placeholder="Keyword Search" 
				/>
            </span>

            <div className="flex align-items-center justify-content-end gap-2">
                <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        </div>
    );
	
	const handleEvaluate = async () => {
		setScore(undefined);
		
		const response = await axios.post('http://127.0.0.1:5000/evaluate-answer', {
			desired_answer: checkAnswer[0],
			user_answer: checkAnswer[1]
		}, {
            headers: {
                "Content-Type": "application/json"
            }
        });
		
		setScore(response?.data?.score);
	};

	const ansTemplate = (data) =>{
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap'
				}}
			>
				<span className='blur-effect' style={{ width: '70%' }}>
					{ formatAnswer(data.answer) }
				</span>
				
				<div className="qa-format1-evaluate">
					<button
						className="qa-format1-evaluate-btn"
						onClick={() => {
							setScore(0);
							setCheckAnswer([data.answer, '']);
							setVisible(true);
							setModalContent(
								<div className="modal-container">
									<TextArea
										className="modal-answer"
										minRows={9}
										placeholder={"Write your answer here..."}
										onChange={(e) => {
											setCheckAnswer([data.answer, e.target.value])
										}}
									/>
								</div>
							)
						}}
					>
						Evaluate
					</button>
				</div>
			</div>
		)
	}
	
	return (
		<div className="card" style={{ background: 'transparent',display:'flex',justifyContent:'center'}}>
			<Dialog
				className="modal-main-container"
				visible={visible}
				header="Provide your answer, we'll evaluate it for you!"
				onHide={() => {
					setVisible(false);
					setCheckAnswer([]);
					setScore(undefined);
				}}
			>
				{modalContent}

				{
					score === undefined ? (
						<Typography
							className="modal-evaluate-text"
							variant="h5"
							component="h5"
							style={{
								color: '#B14BF4'
							}}
						>
							We have evaluated your answer to be: {score}/10
						</Typography>
					) : (
						<Button
							className="modal-evaluate-btn"
							icon="pi pi-verified"
							label="Evaluate"
							onClick={handleEvaluate}
						/>
					)
				}
			</Dialog>
			
			<Tooltip target=".export-buttons>button" position="bottom"/>
			
			{ qaData && Object.keys(qaData).length ? (
				<DataTable
					style={{ background: 'transparent !important',width:'80%'}}
					ref={ dt }
					value={ qaData }
					showGridlines
					paginator
					rows={ 5 }
					rowsPerPageOptions={ [5, 10, 25, 50] }
					dataKey="id"
					filters={ filters }
					header={ header }
					globalFilterFields={[
						'question',
						'answer',
						'type'
					]}
					tableStyle={{ minWidth: '50rem' }}
				
				>
					<Column header="Sr No" headerStyle={{ width: '3rem' }} body={(data, options) => options.rowIndex + 1}></Column>
					<Column field="question" header='Questions' body={(data) => formatQuestion(data.question)} style={{fontWeight:'600'}} />
					<Column field="answer" header='Answers' body={(data) => ansTemplate(data)} />
				</DataTable>
				): <NotFound/>
			}
		</div>
	);
}

export default CustomTable;