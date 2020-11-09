
import React, { Component } from 'react';
import '../../App.css';
import Order from './order';
import axios from 'axios';
import Filter from '../Filter/orderfilter';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  update, login, logout, loadOrders, loadNewOrderPage, loadExactOrderPage, 
  filterOrdersByOption, filterOrdersByType, filterOrdersByStatus,
} from '../../_actions';
import Navbar from '../Navbar/navbar';

class OrdersDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ooption: '',
      ooptionStates: ['All', 'Pickup', 'Delivery', 'Dine in'],
      ostatus: '',
      ostatusStates: ['All', 'Order received', 'Preparing', 'Pickup ready','Picked up', 'On the way', 'Delivered'],
      otype: '',
      otypeStates: ['All', 'New', 'Picked up', 'Delivered', 'Cancelled'],
      orderFetched: false,
    };

    this.ooptionHandler = this.ooptionHandler.bind(this);
    this.ostatusHandler = this.ostatusHandler.bind(this);
    this.otypeHandler = this.otypeHandler.bind(this);

    //Pagination handlers
    this.nextPageHandler = this.nextPageHandler.bind(this);
    this.prevPageHandler = this.prevPageHandler.bind(this);
    this.goToPageHandler = this.goToPageHandler.bind(this);
  }

  ooptionHandler = (event) => {
    console.log("selected", event.target.value)
    this.props.filterOrdersByOption(event.target.value)
    this.setState({
      ooption: event.target.value
    })
  }


  ostatusHandler = (event) => {
    console.log("selected", event.target.value)
    this.props.filterOrdersByStatus(event.target.value)
    this.setState({
      ostatus: event.target.value
    })
  }


  otypeHandler = (event) => {
    console.log("selected", event.target.value)
    this.props.filterOrdersByType(event.target.value)
    this.setState({
      otype: event.target.value
    })
  }

  nextPageHandler = () => {
    this.props.loadNewOrderPage({page: 1})
  }

  prevPageHandler = () => {
    this.props.loadNewOrderPage({page: -1})
  }

  goToPageHandler = (event) => {
    this.props.loadExactOrderPage(event.target.id);
  }

  componentDidMount() {
    // replace this URL with search URL

    let url = `${process.env.REACT_APP_BACKEND}/orders`;
    if(this.props.whoIsLogged === false) {
      url += `/customers/${this.props.cid}`
    } else {
      url += `/restaurants/${this.props.rid}`
    }
    console.log('endpoint: ', url)
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.get(url)
      .then((response) => {
        console.log('Status Code : ', response.data);
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          const temp = JSON.parse(JSON.stringify(response.data));
          this.props.loadOrders(3, response.data);
          this.setState({
            orderFetched: true,
          })
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    let redirectVar = null;
    let id = '';
    let type = '';

    if (this.props.isLogged === false) {
      redirectVar = <Redirect to="/login"/>
    } else {
      if(this.props.whoIsLogged === false) {
        // customer login
        id = this.props.cid;
        type = 'customers';
      } else {
        id = this.props.rid
        type = 'restaurants'
      }
    }

    //Pagination part
    const pageNumbers = [];

    let renderPageNumbers = null;
    
    const numberOfPages = Math.ceil(this.props.orders.filteredOrderArr.length / this.props.orders.countPerPage);
    for(let i = 1; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
    console.log('pageNumbers: ', pageNumbers);
    renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li key={number}
          id={number}
          onClick= {this.goToPageHandler}
          class={`${this.props.orders.currentPage === number ? 'active' : ''}`}
        >
        {number}
        </li>
      )
    })

    return (
      <div>
        <Navbar />
        <div class="form-inline">
          <div className="form-group">
            <label for="ooption">Filter by Service: </label>
            <select className="form-control" id="ooption" onChange = {this.ooptionHandler}>>
              <option value = {this.state.ooption}> Choose...</option>
              {this.state.ooptionStates.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label for="ostatus">Filter by Order Status: </label>
            <select className="form-control" id="ooption" onChange = {this.ostatusHandler}>>
              <option value = {this.state.ostatus}> Choose...</option>
              {this.state.ostatusStates.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label for="otype">Filter by Order Type: </label>
            <select className="form-control" id="ooption" onChange = {this.otypeHandler}>>
              <option value = {this.state.otype}> Choose...</option>
              {this.state.otypeStates.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ul id="page-numbers">
          <li onClick={this.prevPageHandler}>Prev</li>
          {renderPageNumbers}
          <li onClick={this.nextPageHandler}>Next</li>
        </ul>
        {this.props.orders.displayOrderArr.map((order) => (
          <div>
            <Order order={order} />
          </div>
        ))}
        
      </div>

      /*
      <div>
        <Navbar/>
        <div>
          {redirectVar}
          <div className="container">
            <OrderListingsProvider id = {id} type = {type} >
              <OrderListingsConsumer>
                {function(value) {
                  const { orderListings, updateFilter } = value
                  return (
                    <div>
                      <Filter updateFilter={updateFilter}/>
                      <ul>
                        {orderListings.map(listing => (
                          <Order order = {listing}/>
                        ))}
                      </ul>
                    </div>
                  )
                }}
              </OrderListingsConsumer>
            </OrderListingsProvider >
          </div>
        </div>
      </div>
      */
    )
  }
}

const mapStateToProps = (state) => {
    return {
      cid: state.custProfile.cid,
      rid: state.restProfile.rid,
      isLogged: state.isLogged.isLoggedIn,
      whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
      orders: state.orders,
    }
}

function mapDispatchToProps(dispatch) {  
  return {
    update : (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    loadOrders: (countPerPage, payload) => dispatch(loadOrders(countPerPage, payload)),
    loadExactOrderPage: (payload) => dispatch(loadExactOrderPage()),
    loadNewOrderPage: (payload) => dispatch(loadNewOrderPage(payload)),
    filterOrdersByOption: (payload) => dispatch(filterOrdersByOption(payload)),
    filterOrdersByStatus: (payload) => dispatch(filterOrdersByStatus(payload)),
    filterOrdersByType: (payload) => dispatch(filterOrdersByType(payload)),
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersDisplay);
