import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import pumpkin from './mediterranean.jpg';

class Eventcard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: false,
    };
  }

  render() {

    return (
      <Link to={{
        pathname: '/event',
        query: {
          eid: `${this.props.event.eid}`,
          ename: `${this.props.event.ename}`,
          edescription: `${this.props.event.edescription}`,
          eaddress: `${this.props.event.eaddress}`,
          edate: `${this.props.event.edate}`,
          ephoto: `${this.props.event.ephoto}`
        }
      }}
      >
        <div className="container-fluid style={{height: 100}}">
          <div className="row">
            <div className="col-12 mt-3">
              <div className="card">
                <div className="card-horizontal">
                  <div className="img-square-wrapper">
                    <img className="img-responsive img-thumbnail" src={this.props.event.ephoto} alt="restro" width="200"/>
                  </div>
                  <div className="card-body">
                    <p className="card-text font-weight-bold">{this.props.event.ename}</p>
                    <p className="card-text font-italic">{this.props.event.edescription}</p>
                    <p className="card-text font-italic">Address: {this.props.event.eaddress}</p>
                    <p className="card-text font-italic">Date: {this.props.event.edate.split('T')[0]}</p>
                    <p className="card-text font-italic">Hosted by: {this.props.event.rname}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <p className="card-text font-italic">Featured!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>


      /*

      //Pass restaurant information to display menu and then show when dishes are added to cart
        <div class="container-fluid style={{height: 100}}">
          <div class="row">
            <div class="col-12 mt-3">
              <div class="card">
                <div class="card-horizontal">
                  <div class="card-body">
                      <p class="card-text font-weight-bold">Name: {this.props.event.ename}</p>
                      <p class="card-text">Description: {this.props.event.edescription}</p>
                      <p class="card-text">Address: {this.props.event.eaddress}</p>
                      <p class="card-text">Schedule: {this.props.event.edate}</p>
                      <p class="card-text">Hosted By: {this.props.event.rname}</p>

                  </div>
                </div>
                <div class="card-footer">
                    <small class="text-muted">Featured!</small>
                </div>
              </div>
            </div>
          </div>
        </div>


  */


    )
  }

}

export default Eventcard;