import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  update, login, logout, loadRestaurants, filterRestaurantByDelivery, filterRestaurantByLocation
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
    };

    this.methodHandler = this.methodHandler.bind(this);

    this.handleSelectAddress = this.handleSelectAddress.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  handleAddressChange = (address) => {
    this.setState({
      nbrAddress: address
    })
  }

  methodHandler = (event) => {
    console.log("selected", event.target.value)

    

    this.props.filterRestaurantByDelivery(event.target.value);
    this.setState({
      method: event.target.value
    })
    /*
    setTimeout(() => {
      this.props.updateFilter(this.state)
    }, 0);
    */
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
    this.getAllRestaurants();
  }

  getAllRestaurants() {

    const url = `${process.env.REACT_APP_BACKEND}/restaurants`;
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          this.props.loadRestaurants(3, response.data);
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    let redirectVar = null;
    // Accessing props from Navbar as this.props.location.state.xxx
    console.log('Passed props', this.props);
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

    /*
      <div>
        <section className="container">
          <RestaurantListingsProvider
            searchBy={this.props.searchBy}
            searchTxt={this.props.searchTxt}
            searchAddress={this.props.searchAddress}
            searchLat={this.props.searchLat}
            searchLng={this.props.searchLng}
            cuisineType={this.props.cuisineType}
            deliveryType={this.props.deliveryType}
          >
            <RestaurantListingsConsumer>
              {(value) => {
                const { restaurantListings, updateFilter } = value;
                console.log('listings: ', restaurantListings);
                // eslint-disable-next-line prefer-const
                let locations = [];
                restaurantListings.forEach((item) => {
                 console.log('Restaurant context provider item: ', item.rlatitude, item.rlongitude);
                  // eslint-disable-next-line prefer-const
                  let location = {
                    name: item.rname,
                    lat: item.rlatitude,
                    lng: item.rlongitude,
                  };
                  locations.push(location);
                });
                // eslint-disable-next-line prefer-const
                let pins = {
                  restaurants: locations,
                };
                return (
                  <div>
                    <div className="left-half">
                      <RestFilter updateFilter={updateFilter} />
                      <ul>
                        {restaurantListings.map((listing) => (
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
              }}
            </RestaurantListingsConsumer>
          </RestaurantListingsProvider>
        </section>
      </div>

      */
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchRestResults);
