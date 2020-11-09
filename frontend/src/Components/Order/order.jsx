import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import classnames from 'classnames';
import '../../App.css';

class Order extends Component {

  componentWillMount() {

  }

  render() {
    return (
      <Link to={{
        pathname: '/orderpage',
        query: {
          oid: `${this.props.order.oid}`,
          rid: `${this.props.order.rid}`,
          ooption: `${this.props.order.ooption}`,
          ostatus: `${this.props.order.ostatus}`,
          otype: `${this.props.order.otype}`,
          otime: `${this.props.order.otime}`,
          oaddress: `${this.props.order.oaddress}`,
        },
      }}
      >
        <div className="container-fluid style={{height: 100}}">
          <div className="row">
            <div className="col-12 mt-3">
              <div className="card">
                <div className="card-horizontal">
                  <div className="card-body">
                      <p className="card-text">Order ID: {this.props.order.oid}</p>
                      <p className="card-text">Restaurant ID: {this.props.order.rid}</p>
                      <p className="card-text">Service: {this.props.order.ooption}</p>
                      <p className="card-text">Status: {this.props.order.ostatus}</p>
                      <p className="card-text">Order Type: {this.props.order.otype}</p>
                      <p className="card-text">Time placed: {this.props.order.otime}</p>
                  </div>
                </div>
                <div className="card-footer">
                    <small className="text-muted">{this.props.order.ostatus}</small>
                    <p className="card-text">Status: {this.props.order.ostatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      /*
      <div className={columnClasses} style={{margin: '1rem 0' }}>
        <div className={cardClasses}>
          <div className="card-header">
            <div className="card-title-h5">{this.props.order.rid}</div>
          </div>
          <div className="card-body">
            <div className="card-title-h5">{this.props.order.oid}</div>
          </div>
          <div className="card-footer">
            <div className="card-title-h5">{this.props.order.ostatus}</div>
          </div>
          <div className="card-footer">
            <div className="card-title-h5">{this.props.order.ooption}</div>
          </div>
          <div className="card-footer">
            <div className="card-title-h5">{this.props.order.otype}</div>
          </div>
        </div>
      </div>
      */
    )
  }
}
export default Order;