import { Menubar } from 'primereact/menubar';
import { useNavigate,Link } from 'react-router-dom';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

export default function NavBar () {
	const navigate = useNavigate();

	return (
		// <Menubar onClick={() => navigate('/')} model={items} style={{ backgroundColor: "#008ceb", borderRadius: '0px' }} />
		<div className='navbar'>
				<div onClick={() => navigate('/')} className='logo-container-link' to="/" >
					<div className='logo-container' >
						< QuestionAnswerOutlinedIcon />
						<span>AutoQA</span>
					</div>
				</div>
		</div>
	)
}