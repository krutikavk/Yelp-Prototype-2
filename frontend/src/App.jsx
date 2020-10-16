import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Main from './Components/Main';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        { /* App Component Has a Child Component called Main */}
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
