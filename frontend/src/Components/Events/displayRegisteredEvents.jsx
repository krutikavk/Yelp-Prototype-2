import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import Navbar from '../Navbar/navbar';
import {
  loadEvents, loadNewEventPage, loadExactEventPage,
} from '../../_actions';
import Event from './eventcard';

class DisplayRegistered extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    const url = `${process.env.REACT_APP_BACKEND}/events/customers/${this.props.cid}`;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    // let url = 'http://localhost:3001/events/customers/' + this.props.cid

    axios.get(url)
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
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
    return (
      <div>
        <Navbar />
        { this.state.events.map((entry) => (
          <Event event={entry} />
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
    cid: state.custProfile.cid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadEvents: (countPerPage, payload) => dispatch(loadEvents(countPerPage, payload)),
    loadNewEventPage: (payload) => dispatch(loadNewEventPage(payload)),
    loadExactEventPage: (payload) => dispatch(loadExactEventPage(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayRegistered);
