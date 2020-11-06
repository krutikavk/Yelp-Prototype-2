import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/navbar';

// eslint-disable-next-line react/prefer-stateless-function
class Search extends Component {
  render() {
    return (

      <div>
        <Navbar />
        <br />
        <div className="login-form card col-12 col-lg-4 login-card mt-2 hv-center" >
          <br />
          <br />
          <Link to='/customers/search' class="btn btn-danger">Search Users</Link>
          <br />
          <br />
          <Link to='/restaurants/search' class="btn btn-danger">Search Restaurants</Link>
          <br />
          <br />
          <Link to='/events/search' class="btn btn-danger">Search Events</Link>
          <br />
        </div>
      </div>
    );
  }
}

export default Search;
