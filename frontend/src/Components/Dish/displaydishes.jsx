import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  loadDishes, loadNewDishPage, loadExactDishPage,
} from '../../_actions';
import Dish from './dish';
import Navbar from '../Navbar/navbar';

class Dishes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //dishes: [],
      rid: '',
      rdelivery: '',
      change : 1,
    };

     //Pagination handlers
    this.nextPageHandler = this.nextPageHandler.bind(this);
    this.prevPageHandler = this.prevPageHandler.bind(this);
    this.goToPageHandler = this.goToPageHandler.bind(this);
  }

  nextPageHandler = () => {
    this.props.loadNewDishPage({page: 1})
    this.setState({change : this.state.change+1})
  }

  prevPageHandler = () => {
    this.props.loadNewDishPage({page: -1})
        this.setState({change : this.state.change+1})

  }

  goToPageHandler = (event) => {
    this.props.loadExactDishPage(event.target.id);
    this.setState({change : this.state.change+1})

  }

  componentDidMount(props) {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    const url = `${process.env.REACT_APP_BACKEND}/dishes/${this.props.location.query.rid}`;
    console.log('query: ', this.props.location.query);
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again 
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          const temp = JSON.parse(JSON.stringify(response.data));
          console.log('temp: ', temp);
          this.setState({
            //dishes: [...temp],
            rid: this.props.location.query.rid,
            rdelivery: this.props.location.query.rdelivery,
          });
          this.props.loadDishes(3, response.data);
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    // {this.state.dishes.length > 0 && <displayDishes dishes={this.state.dishes} />}
    console.log("Change :")
    let addDishes = null;
    if (this.props.isLogged === true && this.props.whoIsLogged === true) {
      addDishes = <Link to='/dishes/add'> <button id="btnLogin" className="btn btn-danger">Add Dishes</button></Link>
    }

    let warning = null;
    if (this.props.dishes.dishArr.length === 0) {
      warning = <p className="card-text font-italic">No dishes added by restaurant</p>
    }

    //Pagination part
    const pageNumbers = [];

    let renderPageNumbers = null;
    const numberOfPages = Math.ceil(this.props.dishes.dishArr.length / this.props.dishes.countPerPage);
    for (let i = 1; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
    console.log('pageNumbers: ', pageNumbers);
    renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li key={number}
          id={number}
          onClick= {this.goToPageHandler}
          class={`${this.props.dishes.currentPage === number ? 'active' : ''}`}
        >
        {number}
        </li>
      )
    })
    console.log('==> ', this.props.dishes.displayDishArr);
    return (

      <div>
        <Navbar />
        <div className="container-fluid style={{height: 100}}">
          <div className="row">
            <div className="col-12 mt-3">
              <div className="card">
                <div className="card-horizontal">
                  <img src={this.props.location.query.rphoto} style={{width: 250}} alt="" width></img>
                  <div className="card-body">
                    <p className="card-text font-weight-bold">{this.props.location.query.rname}</p>
                    <p className="card-text font-italic">Phone: {this.props.location.query.rphone}</p>
                    <p className="card-text font-italic">Address: {this.props.location.query.raddress}</p>
                    <p className="card-text font-italic">Service: {this.props.location.query.rdelivery}</p>
                    {addDishes}
                  </div>
                </div>
                <div className="card-footer">
                  {warning}
                  <ul id="page-numbers">
                    <li onClick={this.prevPageHandler}>Prev</li>
                    {renderPageNumbers}
                    <li onClick={this.nextPageHandler}>Next</li>
                  </ul>
                  {this.state.change % 2 == 1 ?
                    <p className="card-text">
                      {this.props.dishes.displayDishArr.map (dish => (
                        <Dish dish={dish} rid={this.state.rid} rdelivery={this.state.rdelivery} />
                      ))}
                    </p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogged: state.isLogged.isLoggedIn,
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
    dishes: state.dishes,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    loadDishes: (countPerPage, payload) => dispatch(loadDishes(countPerPage, payload)),
    loadExactDishPage: (payload) => dispatch(loadExactDishPage(payload)),
    loadNewDishPage: (payload) => dispatch(loadNewDishPage(payload)),
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishes);
