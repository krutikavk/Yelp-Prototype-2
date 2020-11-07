import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

class  extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false;
    }
  }
  render() {
    if(this.state.expand === true) {

    }

    return (
      <Link to={{
          pathname: '/restaurant',
          query: {
            convid: `${this.props.conversation._id}`
            rid: `${this.props.conversation.rid}`,
            rname: `${this.props.conversation.rname}`,
            cid: `${this.props.conversation.cid}`,
            cname: `${this.props.conversation.cname}`,
            latest: `${this.props.conversation.latest}`,
            messages: `${this.props.conversation.messages}`,
          },
            rid: `${this.props.restaurant._id}`, 
            remail: `${this.props.restaurant.remail}`,
            rname: `${this.props.restaurant.rname}`,
            rphone: `${this.props.restaurant.rphone}`,
            rabout: `${this.props.restaurant.rabout}`,
            rphoto: `${this.props.restaurant.rphoto}`,
            rlocation: `${this.props.restaurant.rlocation}`,
            rlatitude: `${this.props.restaurant.rlatitude}`,
            rlongitude: `${this.props.restaurant.rlongitude}`,
            raddress: `${this.props.restaurant.raddress}`,
            rcuisine: `${this.props.restaurant.rcuisine}`,
            rdelivery: `${this.props.restaurant.rdelivery}`,
          }
        }}>
        <div className="container-fluid style={{height: 100}}">
          <div className="row">
            <div className="col-12 mt-3">
              <div className="card">
                <div className="card-horizontal">
                  <div className="card-body">
                      <p className="card-text">Name: {this.props.conversation.rname}</p>
                      <p className="card-text">Message: {this.props.conversation.messages[0]}</p>
                       <p className="card-text">...</p>
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
    )
  }

}