import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CustomTable from './CustomTable'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <CustomTable/>
    </>
  )
}

export default App
