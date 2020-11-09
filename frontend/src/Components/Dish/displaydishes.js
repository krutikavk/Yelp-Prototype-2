import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  update, login, logout, restaurantLogin 
} from '../../_actions';
import { nachospic } from './nachospic.png';
import Dish from './dish';
import Navbar from '../Navbar/navbar';

class Dishes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dishes: [],
      rid: '',
      rdelivery: '',
    };
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
            dishes: [...temp],
            rid: this.props.location.query.rid,
            rdelivery: this.props.location.query.rdelivery,
          });
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    // {this.state.dishes.length > 0 && <displayDishes dishes={this.state.dishes} />}

    let addDishes = null;
    if (this.props.isLogged === true && this.props.whoIsLogged === true) {
      addDishes = <Link to='/dishes/add'> <button id="btnLogin" className="btn btn-danger">Add Dishes</button></Link>
    }

    let warning = null;
    if (this.state.dishes.length === 0) {
      warning = <p className="card-text font-italic">No dishes added by restaurant</p>
    }

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
                    <p className="card-text">
                      {this.state.dishes.map (dish => (
                        <Dish dish={dish} rid={this.state.rid} rdelivery={this.state.rdelivery} />
                      ))}
                    </p>
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
  };
};

export default connect(mapStateToProps)(Dishes);
