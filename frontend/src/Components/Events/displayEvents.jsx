import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import locationIcon from '@iconify/icons-mdi/map-marker';
import { Icon } from '@iconify/react';
import GoogleMapReact from 'google-map-react';
import {
  update, login, logout, customerLogin, loadEvents, loadNewEventPage, loadExactEventPage, sortEventsAsc, sortEventsDesc
} from '../../_actions';
import Event from './eventcard';
import '../Map/map.css';
import Navbar from '../Navbar/navbar';

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" color="#ff6347" width="40" height="40" />
    <p className="pin-text" style={{ color:"#ff6347" }}>{ text } </p>
  </div>
);

class DisplayEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      eventFilter: '',
      eventFilterStates: ['All', 'Ascending', 'Descending']
    };

    // Pagination handlers
    this.nextPageHandler = this.nextPageHandler.bind(this);
    this.prevPageHandler = this.prevPageHandler.bind(this);
    this.goToPageHandler = this.goToPageHandler.bind(this);

    this.eventFilterHandler = this.eventFilterHandler.bind(this);
  }

  nextPageHandler = () => {
    this.props.loadNewEventPage({page: 1})
  }

  prevPageHandler = () => {
    this.props.loadNewEventPage({page: -1})
  }

  goToPageHandler = (event) => {
    this.props.loadExactEventPage(event.target.id);
  }

  eventFilterHandler = (event) => {
    console.log("selected", event.target.value)
    if(event.target.value === 'Ascending'){
      this.props.sortEventsAsc();
    }
    if(event.target.value === 'Descending') {
      this.props.sortEventsDesc();
    }
    this.setState({
      method: event.target.value
    })
  }

  componentDidMount() {
    // replace this URL with search URL
    const url = `${process.env.REACT_APP_BACKEND}/events`;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.get(url)
      .then((response) => {
        console.log('Status Code : ', response.data);
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          const temp = JSON.parse(JSON.stringify(response.data));
          this.props.loadEvents(3, response.data);
          this.setState({
            events: [...temp],
          });
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    const pageNumbers = [];
    let renderPageNumbers = null;
    const numberOfPages = Math.ceil(this.props.filteredEventArr.length / this.props.countPerPage);
    for (let i = 1; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
    console.log('pageNumbers: ', pageNumbers);
    renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li key={number}
          id={number}
          onClick={this.goToPageHandler}
          class={`${this.props.currentPage === number ? 'active' : ''}`}
        >
        {number}
        </li>
      )
    });

    return (
      <div>
        <Navbar />
        <ul id="page-numbers">
          <li onClick={this.prevPageHandler}>Prev</li>
          {renderPageNumbers}
          <li onClick={this.nextPageHandler}>Next</li>
        </ul>
        <div class="form-inline">
          <label for="ooption" style={{color:"black"}}>Filter by Date: </label>
          <select class="form-control" id="ooption" onChange = {this.eventFilterHandler}>>
            <option value = {this.state.eventFilter}> Choose...</option>
            {this.state.eventFilterStates.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {this.props.displayEventArr.map((event) => (
          <div>
            <Event event={event} />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eventArr: [...state.eventDisplay.eventArr],
    filteredEventArr: [...state.eventDisplay.filteredEventArr],
    displayEventArr: [...state.eventDisplay.displayEventArr],
    countPerPage: state.eventDisplay.countPerPage,
    currentPage: state.eventDisplay.currentPage,
    isLogged: state.isLogged.isLoggedIn,
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    update: (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    customerLogin: () => dispatch(customerLogin()),
    loadEvents: (countPerPage, payload) => dispatch(loadEvents(countPerPage, payload)),
    loadNewEventPage: (payload) => dispatch(loadNewEventPage(payload)),
    loadExactEventPage: (payload) => dispatch(loadExactEventPage(payload)),
    sortEventsAsc: () => dispatch(sortEventsAsc()),
    sortEventsDesc: () => dispatch(sortEventsDesc()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayEvents);
