import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  update, login, logout, loadRestaurants, filterRestaurantByDelivery, filterRestaurantByLocation, loadNewPage, loadExactPage
} from '../../_actions';
// import Navbar from '../Navbar/navbar';
// import { RestaurantListingsProvider, RestaurantListingsConsumer } from '../../_context/restaurantListingsProvider';
import Restaurant from './restaurantcard';
import MapSection from '../Map/map';
import RestFilter from '../Filter/restaurantfilter';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

// eslint-disable-next-line react/prefer-stateless-function
class SearchRestResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method: '',
      methodStates: ['All', 'Curbside pickup', 'Yelp Delivery', 'Dine In'],
      nbrAddress: '',
      nbrLatitude: '',
      nbrLongitude: '',
      restFetched: false,
    };

    this.methodHandler = this.methodHandler.bind(this);

    this.handleSelectAddress = this.handleSelectAddress.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);

    //Pagination handlers
    this.nextPageHandler = this.nextPageHandler.bind(this);
    this.prevPageHandler = this.prevPageHandler.bind(this);
    this.goToPageHandler = this.goToPageHandler.bind(this);
  }

  handleAddressChange = (address) => {
    this.setState({
      nbrAddress: address
    })
  }

  nextPageHandler = () => {
    this.props.loadNewPage({page: 1})
  }

  prevPageHandler = () => {
    this.props.loadNewPage({page: -1})
  }

  goToPageHandler = (event) => {
    this.props.loadExactPage(event.target.id);
  }

  methodHandler = (event) => {
    console.log("selected", event.target.value)
    this.props.filterRestaurantByDelivery(event.target.value);
    this.setState({
      method: event.target.value
    })
  }

  handleSelectAddress = address => {
    this.setState({nbrAddress : address});
    console.log(address);

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Location found: ', latLng)

        this.setState({
          nbrLatitude : latLng.lat,
          nbrLongitude : latLng.lng,
        })
        this.props.filterRestaurantByLocation(latLng.lat, latLng.lng);
      })
      .catch(error => console.error('Error', error));
  }

  componentDidMount() {
    console.log('RestaurantListingsProvider props: ', this.props);

    if(this.props.searchBy === 'Cuisine' && this.props.searchTxt !== '') {
      console.log("Search by cuisine: ", this.props.cuisineType)
      this.searchByCuisine(this.props.searchTxt, this.props.searchLat,  this.props.searctLng)
    } else if(this.props.searchBy === 'Delivery Type' && this.props.deliveryType !== ''){
      this.searchByDeliveryType(this.props.deliveryType, this.props.searchLat,  this.props.searctLng);
    } else if (this.props.searchBy === 'Dish Name' && this.props.searchTxt !== '') {
      this.searchByDishName(this.props.searchTxt, this.props.searchLat,  this.props.searctLng)
    } else {
      this.getAllRestaurants();
    }
  }

  getAllRestaurants() {

    const url = `${process.env.REACT_APP_BACKEND}/restaurants`;
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          console.log('response: ', response.data)
          this.props.loadRestaurants(3, response.data);
          this.setState({
            restFetched: true,
          })
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  searchByCuisine(cuisine, latitude, longitude) {
    let url = `${process.env.REACT_APP_BACKEND}/restaurants/search/cuisine`;
    const data = {
      rcuisine : cuisine,
    }
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    axios.post(url, data)
      .then(response => {
        if(response.status === 200){
          //When results return multiple rows, rowdatapacket object needs to be converted to JSON object again 
          //use JSON.parse(JSON.stringify()) to convert back to JSON object
          console.log("filtered by cuisine:", response.data)
          this.props.loadRestaurants(3, response.data);
          if(latitude !== '' && longitude !== '') {
            this.props.filterRestaurantByLocation(latitude, longitude);
          }
          this.setState({
            restFetched: true,
          })
        }
      }).catch(err =>{
          console.log("No response")
    });

    return;
  }

  searchByDeliveryType(dtype, latitude, longitude) {
    let url = `${process.env.REACT_APP_BACKEND}/restaurants/search/rdelivery`;
    const data = {
      rdelivery : dtype,
    }

    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    axios.post(url, data)
      .then(response => {
        if(response.status === 200){
          //When results return multiple rows, rowdatapacket object needs to be converted to JSON object again 
          //use JSON.parse(JSON.stringify()) to convert back to JSON object
          console.log("filtered by cuisine:", response.data)
          this.props.loadRestaurants(3, response.data);
          if(latitude !== '' && longitude !== '') {
            this.props.filterRestaurantByLocation(latitude, longitude);
          }
          this.setState({
            restFetched: true,
          })
        }
      }).catch(err =>{
          console.log("No response")
    });

    return;

  }

  searchByDishName(dname, latitude, longitude) {
    let url = `${process.env.REACT_APP_BACKEND}/restaurants/search/dish`;
    const data = {
      dname,
    }

    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    axios.post(url, data)
      .then(response => {
        if(response.status === 200){
          let rid = [...response.data];
          console.log("Recieved rids: ", response.data)
          console.log("Read rids: ", rid)
          let promiseArray = rid.map(dataarr => axios.get(`${process.env.REACT_APP_BACKEND}/restaurants/${dataarr}`));

          Promise.all( promiseArray )
          .then(
            results => {

              let responses = results.filter(entry => 
                entry.status === 200
              )
              let restaurants = [];
              responses.forEach(response => {
                restaurants.push(response.data)
              })
              if(restaurants.length > 0) {
                this.props.loadRestaurants(3, restaurants);
                if(latitude !== '' && longitude !== '') {
                  this.props.filterRestaurantByLocation(latitude, longitude);
                }
                this.setState({
                  restFetched: true,
                })
              }
            }
          )
          .catch(console.log);   
        }
      }).catch(err =>{
          console.log("No response")
    });

    return;

  }


  render() {

    //Pagination part
    const pageNumbers = [];

    let renderPageNumbers = null;
    
    const numberOfPages = Math.ceil(this.props.restDisp.filteredRestArr.length / this.props.restDisp.countPerPage);
    for(let i = 1; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
    console.log('pageNumbers: ', pageNumbers);
    renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li key={number}
          id={number}
          onClick= {this.goToPageHandler}
          class={`${this.props.restDisp.currentPage === number ? 'active' : ''}`}
        >
        {number}
        </li>
      )
    })
    

    // eslint-disable-next-line prefer-const
    let locations = [];
    // eslint-disable-next-line react/destructuring-assignment, react/prop-types
    this.props.restDisp.displayRestArr.forEach((item) => {
      // eslint-disable-next-line prefer-const
      let location = {
        name: item.rname,
        lat: item.rlatitude,
        lng: item.rlongitude,
      };
      locations.push(location);
    });

    // eslint-disable-next-line prefer-const
    const pins = {
      restaurants: locations,
    };


    return (

      <div>
        <div class="form-inline">
          <label for="ooption" style={{color:"black"}}>Filter by Service: </label>
          <select class="form-control" id="ooption" onChange = {this.methodHandler}>>
            <option value = {this.state.method}> Choose...</option>
            {this.state.methodStates.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          
          <PlacesAutocomplete
          value={this.state.nbrAddress}
          onChange={this.handleAddressChange}
          onSelect={this.handleSelectAddress}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                  placeholder: 'Enter Neighborhood...',
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
                      ? { backgroundColor: '#000000', cursor: 'pointer' }
                      : { backgroundColor: '#D3D3D3', cursor: 'pointer' };
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
        </div>
        <ul id="page-numbers">
          <li onClick={this.prevPageHandler}>Prev</li>
          {renderPageNumbers}
          <li onClick={this.nextPageHandler}>Next</li>
        </ul>
        <div className="left-half">
          <ul>
            {this.props.restDisp.displayRestArr.map((listing) => (
              <div>
                <Restaurant restaurant={listing} />
              </div>
            ))}
          </ul>
        </div>
        <div className="right-half">
          <div className="map">
            <div className="google-map">
              <MapSection location={pins} zoomLevel={17} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line arrow-body-style
const mapStateToProps = (state) => {
  return {
    cid: state.custProfile.cid,
    rid: state.restProfile.rid,
    isLogged: state.isLogged.isLoggedIn,
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
    restDisp: state.restDisplay,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    update: (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    loadRestaurants: (countPerPage, payload) => dispatch(loadRestaurants(countPerPage, payload)),
    filterRestaurantByDelivery: (payload) => dispatch(filterRestaurantByDelivery(payload)),
    filterRestaurantByLocation: (nbrLatitude, nbrLongitude) => dispatch(filterRestaurantByLocation(nbrLatitude, nbrLongitude)),
    loadNewPage: (payload) => dispatch(loadNewPage(payload)),
    loadExactPage: (payload) => dispatch(loadExactPage(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchRestResults);
