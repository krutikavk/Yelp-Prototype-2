import React,{Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import {update, login, logout} from '../../_actions';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import SearchCustResults from '../Customers/searchCustResults.jsx';
import Navbar from '../Navbar/navbar';

//create the Navbar Component
class SearchCust extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchBy: '',
      searchStates: ['Location', 'Name'],
      searchTxt: '',
      searchAddress : '',
      searchLat: 0.0,
      searchLng: 0.0,
      searchStarted: false                        
    };  
    
    this.searchByHandler     = this.searchByHandler.bind(this);
    this.searchTextHandler   = this.searchTextHandler.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSelectAddress = this.handleSelectAddress.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  searchByHandler = (event) => {
    console.log("selected", event.target.value)
    this.setState({
      searchBy: event.target.value,
      searchStarted: false
    })
  }

  searchTextHandler = (event) => {
    console.log('Entered ', event.target.value)
    this.setState({
      searchTxt: event.target.value,
      searchStarted: false
    })
  }

  handleAddressChange = (address) => {
    this.setState({
      searchAddress: address,
      searchStarted: false
    })
  }

  handleSelectAddress = address => {
    this.setState({searchAddress : address});
    console.log(address);

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Location found: ', latLng)
        this.setState({
          searchLat : latLng.lat,
          searchLng : latLng.lng,
          searchStarted: false
        })
      })
      .catch(error => console.error('Error', error));
  }

  submitSearch = (event) => {
    event.preventDefault();
    //set the with credentials to true
    axios.defaults.withCredentials = true;

    //searchStates: ['Location', 'Cuisine', 'Delivery Type', 'Dish Name']
    this.setState({
      searchStarted: true
    })
    console.log("Submit search state", this.state)
  }

  render() {
    let locationSearch = null;
    if(this.state.searchBy === 'Location') {
      locationSearch = (
        <PlacesAutocomplete
          value={this.state.searchAddress}
          onChange={this.handleAddressChange}
          onSelect={this.handleSelectAddress}
          >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'form-control mr-sm-0',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      )
    }

    let nameSearch = null;
    if(this.state.searchBy === 'Name') {
      nameSearch = (
          <input
          className="form-control mr-sm-2"
          type="text"
          placeholder="Customer Name..."
          onChange={this.searchTextHandler}>
        </input>
      )
    }

    let search = (
      <li className="nav-item">
        <form className="form-inline" action="/" >
          <select class="form-control" id="searchBy" onChange = {this.searchByHandler}>>
            <option value = {this.state.searchBy}> Search By...</option>
            {this.state.searchStates.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
            ))}
          </select>

          {nameSearch}
          {locationSearch}
          
          <button
            onClick={this.submitSearch}
            className="btn btn-danger btn-sm"
            type="submit">
              Search Users
          </button>
        </form>
      </li>
    )

    let searchComponent = <SearchCustResults  
                            searchBy = {this.state.searchBy} 
                            searchTxt = {this.state.searchTxt}
                            searchAddress = {this.state.searchAddress}
                            searchLat = {this.state.searchLat}
                            searchLng = {this.state.searchLng}
                          />

    let searchResults = this.state.searchStarted ? <SearchCustResults  
                            searchBy = {this.state.searchBy} 
                            searchTxt = {this.state.searchTxt}
                            searchAddress = {this.state.searchAddress}
                            searchLat = {this.state.searchLat}
                            searchLng = {this.state.searchLng}
                          /> 
                          : null
    
    //{this.state.searchResults ? <SearchRestResults /> : null}
    
    return(

      <div>
        <Navbar/>
        <nav className="navbar navbar-expand-sm bg-light navbar-light">
          
          <ul className="navbar-nav mx-auto">
            {search}
          </ul>
        </nav>
        {searchResults}
      </div>
    )
  }
}

//importedname: state.reducer.statename
/*
const mapStateToProps = (state) => {
    return {
      cid: state.custProfile.cid,
      cemail: state.custProfile.cemail,
      cpassword: state.custProfile.cpassword,
      cname: state.custProfile.cname,
      cphone: state.custProfile.cphone,
      cabout: state.custProfile.cabout,
      cjoined: state.custProfile.cjoined,
      cphoto: state.custProfile.cphoto,
      cfavrest: state.custProfile.cfavrest,
      cfavcuisine: state.custProfile.cfavcuisine,

      rid: state.restProfile.rid,
      remail: state.restProfile.remail,
      rpassword: state.restProfile.rpassword,
      rname: state.restProfile.rname,
      rphone: state.restProfile.rphone,
      rabout: state.restProfile.rabout,
      rlocation: state.restProfile.rlocation,
      rlatitude: state.restProfile.rlatitude,
      rlongitude: state.restProfile.rlongitude,
      raddress: state.restProfile.raddress,
      rcuisine: state.restProfile.rcuisine,
      rdelivery: state.restProfile.rdelivery,

      isLogged: state.isLogged.isLoggedIn,
      whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
    }
}

//const mapDispatchToProps = (dispatch) => { since this does not call a function directly it cannot be a function

function mapDispatchToProps(dispatch) {  
  return {
    update : (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCust);
*/
export default SearchCust;
