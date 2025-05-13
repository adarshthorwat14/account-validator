import React from 'react'
import Validator from './components/Validator.jsx'
import './styles/style.css';
import FileUploader from './components/FileUploader.jsx';

const App = () => {
  return (
    <div>
     <Validator />
      <FileUploader />
    </div>
  )
}

export default App
