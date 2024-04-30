import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {Button} from 'primereact/button';
import {Tooltip} from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/InputText';
import TextArea from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { useLocation } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import axios from 'axios';

const CustomTable = () => {
	const { state } = useLocation();
	const dt = useRef (null);
	const counter = useRef(0);
	const [ visible, setVisible ] = useState(false);
	const [ modalHeader, setModalHeader ] = useState("");
	const [ modalContent, setModalContent ] = useState(<></>);
	const [ checkAnswer, setCheckAnswer ] = useState([]);
	const [ score, setScore ] = useState(undefined);
	
	// const [loading, setLoading] = useState (false);
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
	// console.log(state)
	
	const exportColumns = cols.map ((col) => ({ title: col.header, dataKey: col.field }));
	// useEffect (() => {
	// 	ProductService.getProducts ().then ((data) => setProducts (data));
	// }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
				doc.autoTable (exportColumns, state);
				doc.save ('products.pdf');
			});
		});
	};
	
	const exportExcel = () => {
		import('xlsx').then ((xlsx) => {
			const worksheet = xlsx.utils.json_to_sheet (products);
			const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
			const excelBuffer = xlsx.write (workbook, {
				bookType: 'xlsx',
				type: 'array'
			});
			
			saveAsExcelFile (excelBuffer, 'products');
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
		return typeof (data.option) === 'object' ? (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap'
				}}
			>
				<ol type='a' style={{ width: '70%' }}>
					{data.option.map ((ans, index) => (
						<>
							<li
								key={index}
								style={{ color: '#000' }}
								className={ data.answer === ans ? 'ans-effect' : '' }
							>
								{ ans }
							</li>
							<br/>
						</>
					))
					}
				</ol>
				
				<Button
					style={{
						textTransform: 'uppercase'
					}}
					onClick={() => {
						setScore(undefined);
						setCheckAnswer(['', '']);
						setVisible(true);
						setModalHeader("Check MCQ here");
						setModalContent(
							<ol type='a' style={{ width: '70%' }}>
								{data.option.map ((ans, index) => (
									<>
										<li
											key={index}
											style={{ color: data.answer === ans ? '#2CC55E' : '#000' }}
										>
											{ ans }
										</li>
										<br/>
									</>
								))
								}
							</ol>
						)
					}}
				>
					✅
					Check your answer
				</Button>
			</div>
		) : (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap'
				}}
			>
				<span className='blur-effect' style={{ width: '70%' }}>
					{ data.answer }
				</span>
				
				<Button
					onClick={() => {
						setScore(undefined);
						setCheckAnswer([data.answer, '']);
						setVisible(true);
						setModalHeader ("Check here");
						setModalContent(
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<TextArea
									style={{
										width: '60rem',
										borderRadius: '5px',
										fontSize: '1rem',
										margin: '1rem',
										border: '2px solid #6366F1',
										padding: '1rem'
									}}
									minRows={ 9 }
									placeholder={ "Write your answer here..." }
									onChange={ (e) => { setCheckAnswer([data.answer, e.target.value]) } }
								/>
							</div>
						)
					}}
				>
					💪🏻
					Try Yourself!
				</Button>
			</div>
		)
	}
	
	return (
		<div className="card">
			<Dialog
				visible={ visible }
				header={ modalHeader }
				onHide={() => setVisible(false)}
				style={{
					minWidth: '50vw',
				}}
			>
				{ modalContent }
				
				{
					modalHeader === 'Check MCQ here' ? <></> : score === 0 || !isNaN(score) ? (
						<Typography
							variant="h5"
							component="h5"
							style={{
								color: '#2CC55E'
							}}
						>
							We have evaluated your answer to be: { score }/10
						</Typography>
					) : (
						<Button
							icon="pi pi-verified"
							label="Evaluate"
							onClick={ handleEvaluate }
						/>
					)
				}
			</Dialog>
			
			<Tooltip target=".export-buttons>button" position="bottom"/>
			
			{ state && (
				<DataTable
					ref={ dt }
					value={ state }
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
					<Column field="question" header='Questions' body={(data) => data.question} />
					<Column field="answer" header='Answers' body={(data) => ansTemplate(data)} />
				</DataTable>
				)}
		</div>
	);
}

export default CustomTable;