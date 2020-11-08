import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../Navbar/navbar';
import pumpkin from './mediterranean.jpg';
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

    // Pagination handlers
    this.nextPageHandler = this.nextPageHandler.bind(this);
    this.prevPageHandler = this.prevPageHandler.bind(this);
    this.goToPageHandler = this.goToPageHandler.bind(this);
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

  componentDidMount() {
    console.log('Mounted registered events');
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const url = `${process.env.REACT_APP_BACKEND}/events/restaurants/${this.props.rid}`;
    // let url = 'http://localhost:3001/events/restaurants/' + this.props.rid
    console.log('url:', url);

    axios.get(url)
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log('customer IDs', response.data);
          const hosted = JSON.parse(JSON.stringify(response.data));
          this.props.loadEvents(3, hosted);
          this.setState({
            events: [...hosted],
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
        { this.props.displayEventArr.map((entry) => (
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
    cid: state.eventDisplay.cid,
    rid: state.restProfile.rid,
  };
};

function mapDispatchToProps(dispatch) {
  return {

    loadEvents: (countPerPage, payload) => dispatch(loadEvents(countPerPage, payload)),
    loadNewEventPage: (payload) => dispatch(loadNewEventPage(payload)),
    loadExactEventPage: (payload) => dispatch(loadExactEventPage(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayRegistered);
