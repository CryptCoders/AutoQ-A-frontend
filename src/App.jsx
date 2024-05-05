import './App.css';
import CustomTable from './CustomTable';
import NavBar from './NavBar';
import FileUpload from './FileUpload';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from "./LandingPage.jsx";
import Card from "./Card.jsx";
import PaperFormat from "./PaperFormat.jsx";
import {Pagination} from "@mui/material";
import React from "react";
import FormatSelector from "./FormatSelector.jsx";

function App () {
	return (
		<React.StrictMode>
			
			<BrowserRouter>
				{/*<LandingPage/>*/}
				<NavBar/>
				<Routes>
					<Route exact path='/' element={<LandingPage/>} />
					<Route exact path='/upload' element={<FileUpload/>} />
					<Route exact path='/qa' element={<CustomTable/>} />
					<Route exact path='/cards' element={<Card/>} />
					<Route exact path='/p' element={<FormatSelector/>} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	)
}

export default App;
