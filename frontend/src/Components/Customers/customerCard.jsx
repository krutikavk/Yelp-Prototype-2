import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

// eslint-disable-next-line react/prefer-stateless-function
class CustomerCard extends Component {
  render() {
    return (
    // Pass restaurant information to display menu and then show when dishes are added to cart
      <div className="container-fluid style={{height: 100}}">
        <div className="row">
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-horizontal">
                <div className="img-square-wrapper">
                  <img className="img-responsive img-thumbnail" src={this.props.customer.cphoto} alt="" width="300" />
                </div>
                <div className="card-body">
                  <p className="card-text font-weight-bold font-italic">
                    {this.props.customer.cname}
                  </p>
                  <p className="card-text text-muted font-italic">
                    Here since:
                     {this.props.customer.cjoined.split('T')[0]}
                  </p>
                  <p className="card-text text-muted font-italic">
                    Location: {this.props.customer.caddress}
                  </p>
                  <p className="card-text text-muted font-italic">
                    Followers: {this.props.customer.cfollowers.length}
                  </p>
                  <p className="card-text text-muted font-italic">
                    Following: {this.props.customer.cfollowing.length}
                  </p>
                </div>
              </div>
              <div className="card-footer">
                <small className="text-muted">Featured!</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerCard;
