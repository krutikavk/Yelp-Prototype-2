import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  update, login, logout, loadCustomers, sortCustByFollowers, loadNewCustPage, loadExactCustPage, filterCustByFollow
} from '../../_actions';
import MapSection from '../Map/map';
import PlacesAutocomplete from 'react-places-autocomplete';
import CustomerCard from './customerCard';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

// eslint-disable-next-line react/prefer-stateless-function
class SearchCustResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followFilter: '',
      followFilterStates: ['All', 'Sort by Followers'],
      nbrAddress: '',
      nbrLatitude: '',
      nbrLongitude: '',
      custFetched: false,
    };

    this.followFilterHandler = this.followFilterHandler.bind(this);

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
    this.props.loadNewCustPage({page: 1})
  }

  prevPageHandler = () => {
    this.props.loadNewCustPage({page: -1})
  }

  goToPageHandler = (event) => {
    this.props.loadExactCustPage(event.target.id);
  }

  followFilterHandler = (event) => {
    console.log("selected", event.target.value)
    if(this.props.isLogged === true && 
      this.props.whoIsLogged === false && 
      (event.target.value === 'Followers' || event.target.value === 'Following')) {
        alert('here')
        this.props.filterCustByFollow(event.target.value, this.props.custProfile);
        this.setState({
          followFilter: event.target.value
        })
    } else if(event.target.value === 'Sort by Followers') {
      this.props.sortCustByFollowers();
      this.setState({
        followFilter: event.target.value
      })
    }
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
        this.props.filterCustomerByLocation(latLng.lat, latLng.lng);
      })
      .catch(error => console.error('Error', error));
  }

  componentDidMount() {
    console.log('searchCustResults props: ', this.props);
    if(this.props.searchBy === 'Location') {
      this.getAllCustomersByLocation(this.props.searchLat, this.props.searchLng)
    } else if (this.props.searchBy === 'Name') {
      this.searchByName(this.props.searchTxt)
    } else {
      this.getAllCustomers();
    }
  }


  getAllCustomers() {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    const url = `${process.env.REACT_APP_BACKEND}/customers`;
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          console.log('response: ', response.data)
          this.props.loadCustomers(3, response.data);
          this.setState({
            custFetched: true,
          })
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  searchByName(cname) {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    const url = `${process.env.REACT_APP_BACKEND}/customers/search/cname`;
    axios.post(url, {cname: cname})
      .then((response) => {
        if (response.status === 200) {
          console.log('response: ', response.data)
          this.props.loadCustomers(3, response.data);
          this.setState({
            custFetched: true,
          })
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  getAllCustomersByLocation(nbrLatitude, nbrLongitude) {
    const url = `${process.env.REACT_APP_BACKEND}/customers`;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          console.log('response: ', response.data)
          this.props.loadCustomers(3, response.data);
          this.props.filterCustomerByLocation(nbrLatitude, nbrLongitude);
          this.setState({
            custFetched: true,
          })
        }
      }).catch((err) => {
        console.log('No response');
      });
  }


  render() {

    //Pagination part
    const pageNumbers = [];
    let renderPageNumbers = null;
    
    const numberOfPages = Math.ceil(this.props.custDisp.filteredCustArr.length / this.props.custDisp.countPerPage);
    for(let i = 1; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
    console.log('===>', this.props.custDisp.displayCustArr)
    console.log('pageNumbers: ', pageNumbers);
    renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li key={number}
          id={number}
          onClick= {this.goToPageHandler}
          class={`${this.props.custDisp.currentPage === number ? 'active' : ''}`}
        >
        {number}
        </li>
      )
    })

    return (
      <div>
        <div class="form-inline">
          <label for="follow" style={{color:"black"}}>Filter by Follow: </label>
          <select class="form-control" id="follow" onChange = {this.followFilterHandler}>>
            <option value = {this.state.followFilter}> Choose...</option>
            {this.state.followFilterStates.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <ul id="page-numbers">
          <li onClick={this.prevPageHandler}>Prev</li>
          {renderPageNumbers}
          <li onClick={this.nextPageHandler}>Next</li>
        </ul>

        <ul>
          {this.props.custDisp.displayCustArr.map((listing) => (
              <div>
                <CustomerCard customer={listing} />
              </div>
            ))}
        </ul>

      </div>
    )
  }
}

// eslint-disable-next-line arrow-body-style
const mapStateToProps = (state) => {
  return {
    cid: state.custProfile.cid,
    rid: state.restProfile.rid,
    cfollowers: [...state.custProfile.cfollowers],
    cfollowing: [...state.custProfile.cfollowing],
    isLogged: state.isLogged.isLoggedIn,
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
    custDisp: state.custDisplay,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    update: (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    loadCustomers: (countPerPage, payload) => dispatch(loadCustomers(countPerPage, payload)),
    sortCustByFollowers: () => dispatch(sortCustByFollowers()),
    filterCustByFollow: (payload, custProfile) => dispatch(filterCustByFollow(payload, custProfile)),
    loadNewCustPage: (payload) => dispatch(loadNewCustPage(payload)),
    loadExactCustPage: (payload) => dispatch(loadExactCustPage(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCustResults);
