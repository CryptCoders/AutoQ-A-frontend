import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

export default function NavBar () {
	const navigate = useNavigate();

	const items = [
		{
			label: 'AutoQA',
			icon: <QuestionAnswerOutlinedIcon />
		}
	];

	return (
		<Menubar onClick={() => navigate('/')} model={items} style={{ backgroundColor: "#008ceb", borderRadius: '0px' }} />
	)
}