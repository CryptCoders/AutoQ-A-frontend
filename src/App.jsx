import './App.css';
import CustomTable from './CustomTable';
import NavBar from './NavBar';
import FileUpload from './FileUpload';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App () {
	return (
		<>
			<BrowserRouter>
				<NavBar/>
				<Routes>
					<Route exact path='/' element={<FileUpload/>} />
					<Route exact path='/qa' element={<CustomTable/>} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App;
