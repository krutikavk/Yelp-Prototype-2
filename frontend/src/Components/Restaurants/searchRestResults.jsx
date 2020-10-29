import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  update, login, logout, loadRestaurants,
} from '../../_actions';
import Navbar from '../Navbar/navbar';

import { RestaurantListingsProvider, RestaurantListingsConsumer } from '../../_context/restaurantListingsProvider';
import Restaurant from './restaurantcard';
import MapSection from '../Map/map';
import RestFilter from '../Filter/restaurantfilter';

// eslint-disable-next-line react/prefer-stateless-function
class SearchRestResults extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    console.log('RestaurantListingsProvider props: ', this.props);

  /*
    if (this.props.searchBy === 'Cuisine' && this.props.cuisineType !== '') {
      console.log("Search by cuisine: ", this.props.cuisineType)
      this.getRestaurantByCuisine(this.props.cuisineType);
    } else if(this.props.searchBy === 'Delivery Type' && this.props.deliveryType !== ''){
      this.getRestaurantByDtype(this.props.deliveryType);
    } else if (this.props.searchBy === 'Dish Name' && this.props.searchTxt !== '') {
      this.getRestaurantByDname(this.props.searchTxt)
    } else {
      this.getAllRestaurants();
    }

    */
    this.getAllRestaurants();
  }

  getAllRestaurants() {

    const url = `${process.env.REACT_APP_BACKEND}/restaurants`;
    axios.get(url)
      .then(response => {
        if(response.status === 200){
          //When results return multiple rows, rowdatapacket object needs to be converted to JSON object again 
          //use JSON.parse(JSON.stringify()) to convert back to JSON object
          let locations = [];
          response.data.forEach(item => {
            let location = {
              name: item.rname,
              lat: item.rlatitude,
              lng: item.rlongitude
            }
            locations.push(location)
          });

          let pins = {
            restaurants: locations
          }
          this.props.loadRestaurants(3, response.data);
          /*
          this.setState({ 
            restaurantListings: response.data, 
          })
          */
        }
      }).catch(err =>{
          console.log("No response")
    });

    return;
  }

  render() {
    let redirectVar = null;
    // Accessing props from Navbar as this.props.location.state.xxx
    console.log('Passed props', this.props);
    return (

      <div>
        Searched restaurants
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
    )
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchRestResults);
