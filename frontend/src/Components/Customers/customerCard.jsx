import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

// eslint-disable-next-line react/prefer-stateless-function
class CustomerCard extends Component {
  render() {
    const query = {
      cid: this.props.customer.cid,
      cemail: this.props.customer.cemail,
      cpassword: this.props.customer.cpassword,
      cname: this.props.customer.cname,
      cphone: this.props.customer.cphone,
      cabout: this.props.customer.cabout,
      cjoined: this.props.customer.cjoined,
      cphoto: this.props.customer.cphoto,
      cfavrest: this.props.customer.cfavrest,
      cfavcuisine: this.props.customer.cfavcuisine,
      cfollowers: [...this.props.customer.cfollowers],
      cfollowing: [...this.props.customer.cfollowing],
      clatitude: this.props.customer.clatitude,
      clongitude: this.props.customer.clongitude,
      caddress: this.props.customer.caddress,
    };
    return (
    // Pass restaurant information to display menu and then show when dishes are added to cart
      <Link to={{
        pathname: '/customer/profile',
        query,
      }}
      >
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
      </Link>
    );
  }
}

export default CustomerCard;
