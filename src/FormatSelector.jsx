import { SelectButton } from 'primereact/selectbutton';
import { useState } from "react";
import PaperFormat from "./PaperFormat.jsx";
import CustomTable from "./CustomTable.jsx";
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import { Dropdown } from 'primereact/dropdown';


export default function FormatSelector() {
	const options = ["Plain", "Table"];
	const levelOptions = [
		{
			"level": "understand",
			"header": "Understand Level Questions"
		},
		{
			"level": "remember",
			"header": "Remember Level Questions"
		},
		{
			"level": "apply",
			"header": "Apply Level Questions"
		}];
	
	const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);
	const [value, setValue] = useState(options[0]);
	
	return (
		<div className="toggle-btn-container">
			<div className="toggle-btn-sub-container">
				<div className="back-to-btn">
					<ReplyRoundedIcon className="back-to-icon"/>
					<div className="back-to-text">Back To Upload</div>
				</div>
				
				<SelectButton
					className="toggle-btn"
					values={value}
					onChange={(e) => {
						console.log(e.value);
						setValue(e.value);
					}}
					options={options}
					optionDisabled={value}
				/>
			</div>
   
			
			<div>
				
				<div className="question-type">
					<Dropdown
						className="question-type-header"
						varient="filled"
						value={selectedLevel}
						onChange={(e) => setSelectedLevel(e.value)}
						options={levelOptions}
						optionLabel="header"
                		placeholder="Select a Level"
					/>
				</div>
				{ value === "Plain" ? <PaperFormat/> : <CustomTable/>}
			</div>
			
        </div>
	)
}