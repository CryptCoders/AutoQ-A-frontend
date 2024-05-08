import { SelectButton } from 'primereact/selectbutton';
import { useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import PaperFormat from './PaperFormat.jsx';
import CustomTable from './CustomTable.jsx';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import { Dropdown } from 'primereact/dropdown';

export default function FormatSelector() {
	const options = ["Paper" , "Table"];
	const { state } = useLocation();
	const levelOptions = [];
	
	for (let key in state) {
		levelOptions.push({
			"level": key,
			"header": key.charAt(0).toUpperCase() + key.slice(1) + " Level Questions"
		})
	}

	const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);
	const [value, setValue] = useState(options[0]);
	const navigate = useNavigate();

	return (
		<div className="toggle-btn-container">
			<div className="toggle-btn-sub-container">
				<div className="back-to-btn" onClick={ () => navigate('/upload') } style={{ cursor: 'pointer' }}>
					<ReplyRoundedIcon className="back-to-icon"/>
					<div className="back-to-text">Back To Upload</div>
				</div>
				
				<SelectButton
					className="toggle-btn"
					value={value}
					options={options}
					optionDisabled={(option) => option === value}
					onChange={(e) => {
						setValue(e.value)
					}}
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

				{ value === "Paper" ? <PaperFormat qaData={state[selectedLevel.level].data}/> : <CustomTable qaData={state[selectedLevel.level].data}/> }
			</div>
		</div>
	);
}