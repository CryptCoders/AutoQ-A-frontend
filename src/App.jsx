import './App.css';
import CustomTable from './CustomTable';
import NavBar from './NavBar';
import FileUpload from './FileUpload';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from "./LandingPage.jsx";
import Card from "./Card.jsx";

function App () {
	return (
		<>
			
			<BrowserRouter>
				{/*<LandingPage/>*/}
				<NavBar/>
				<Routes>
					<Route exact path='/' element={<LandingPage/>} />
					<Route exact path='/upload' element={<FileUpload/>} />
					<Route exact path='/qa' element={<CustomTable/>} />
					<Route exact path='/cards' element={<Card/>} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App;
