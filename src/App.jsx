import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomTable from './CustomTable';
import NavBar from './NavBar';
import FileUpload from './FileUpload';
import LandingPage from "./LandingPage.jsx";
import FormatSelector from "./FormatSelector.jsx";
import './App.css';

function App () {
	return (
		<React.StrictMode>
			<BrowserRouter>
				<NavBar/>
				<Routes>
					<Route exact path='/' element={<LandingPage/>} />
					<Route exact path='/upload' element={<FileUpload/>} />
					<Route exact path='/display' element={<FormatSelector/>} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	)
}

export default App;
