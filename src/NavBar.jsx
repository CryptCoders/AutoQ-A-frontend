import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

export default function NavBar () {
	const navigate = useNavigate();

	const items = [
		{
			label: 'AutoQA'
		}
	];

	return (
		<Menubar onClick={() => navigate('/')} model={items}/>
	)
}