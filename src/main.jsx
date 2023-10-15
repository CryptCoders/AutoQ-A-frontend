import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {PrimeReactProvider} from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import {CSSReset, ChakraProvider} from '@chakra-ui/react';

ReactDOM.createRoot (document.getElementById ('root')).render (
	<React.StrictMode>
		<PrimeReactProvider>
			<ChakraProvider>
				<CSSReset/>
				<App/>
			</ChakraProvider>
		</PrimeReactProvider>
	</React.StrictMode>,
)
