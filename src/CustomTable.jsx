import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {Button} from 'primereact/button';
import {Tooltip} from 'primereact/tooltip';
import {ProductService} from './service/ProductService';
import { useState, useEffect, useRef } from 'react';
import {InputText} from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useLocation } from 'react-router-dom';
// import axios from "axios";

const CustomTable = () => {
	const { state } = useLocation();
	const [products, setProducts] = useState (state);
	console.log(products);
	const dt = useRef (null);
	// const [loading, setLoading] = useState (false);
	const [filters, setFilters] = useState ({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		question: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		answer: { value: null, matchMode: FilterMatchMode.IN },
		type: { value: null, matchMode: FilterMatchMode.EQUALS },
		
	});
	const [globalFilterValue, setGlobalFilterValue] = useState ('');
	const cols = [
		{ field: 'question', header: 'Questions' },
		{ field: 'answer', header: 'Answers' },
		{ field: 'type', header: 'Type' }
	];
	
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
				console.log(state);
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
                    onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>

            <div className="flex align-items-center justify-content-end gap-2">
                <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        </div>
    );

	const ansTemplate = (data) => {

        return typeof (data.answer) === 'object' ? (
            <ol type='a'>
                {data.answer.map((ans, index) => (
                    <>
                        <li key={index} style={ans.correct ? { fontWeight: 'bold', color: '#00A86B' } : {}}>{ans.answer}</li>
                        <br />
                    </>
                ))
                }
            </ol>
        ) : <span>{data.answer}</span>
    }
	

	return (
		
		<div className="card">
			<Tooltip target=".export-buttons>button" position="bottom"/>
			
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
                <Column field="type" header='Type' body={(data) => data.type} />
			</DataTable>
		</div>
	);
}

export default CustomTable;