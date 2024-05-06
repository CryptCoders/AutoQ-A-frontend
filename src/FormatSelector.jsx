import { SelectButton } from 'primereact/selectbutton';
import { useState } from "react";
import PaperFormat from "./PaperFormat.jsx";
import CustomTable from "./CustomTable.jsx";

export default function FormatSelector() {
	const options = ["Plain", "Table"];
	const [value, setValue] = useState(options[0]);
	
	return (
		<div className="toggle-btn-container">
            <SelectButton
				className="toggle-btn"
				value={value}
				onChange={(e) => {
					console.log(e.value);
					setValue(e.value);
				}}
				options={options}
			/>
			
			<div>
				<div className="question-type">Understand Level Questions</div>
				{ value === "Plain" ? <PaperFormat/> : <CustomTable/>}
			</div>
			
        </div>
	)
}