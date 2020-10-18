import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Main from './Components/Main';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component{
  render() {
  	return (
    // Use Browser Router to route to different pages
	    <BrowserRouter>
	      <div>
	        { /* App Component Has a Child Component called Main */}
	        <Main/>
	      </div>
	    </BrowserRouter>
	);
  }
}

export default App;
