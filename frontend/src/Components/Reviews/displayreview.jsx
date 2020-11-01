import React, { Component } from 'react';
import '../../App.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon, InlineIcon } from '@iconify/react';
import starIcon from '@iconify/icons-typcn/star';

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linkReviewTo: {},
    };
  }

  componentDidMount() {

    let url = '';
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    if (this.props.whoIsLogged === true) {
      // for restaurant login, link review to customer
      // url = 'http://localhost:3001/customers/' + this.props.review.cid;
      url = `${process.env.REACT_APP_BACKEND}/customers/${this.props.review.cid}`;
    } else {
      // for customer login, link review to restaurant
      // url = 'http://localhost:3001/restaurants/' + this.props.review.rid
      url = `${process.env.REACT_APP_BACKEND}/restaurants/${this.props.review.rid}`;
    }
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          const temp = JSON.parse(JSON.stringify(response.data));
          this.setState({
            // Expecting just one row of result, so return row 0!!
            // Do not =[...temp] or temp
            linkReviewTo: temp,
          });
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    let linkto = '';
    const query = this.state.linkReviewTo;
    let name = '';
    if (this.props.whoIsLogged === false) {
      // customer login--link to restaurant
      linkto = '/restaurant';
      console.log('here');
      console.log('query data: ', query);
      name = this.state.linkReviewTo.rname;
    } else {
      linkto = '/customer/profile';
      console.log('there');
      name = this.state.linkReviewTo.cname;
    }

    return (
      <div className="container-fluid style={{height: 100}}">
        <div className="row">
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-horizontal">
                <div className="card-body">
                  <Link to={{
                    pathname: linkto,
                    query,
                  }}
                  >
                    <p className="card-text font-weight-bold">{name}</p>
                  </Link>
                  <p className="card-text font-weight-bold font-italic">
                    <Icon icon={starIcon} color="red" width="30" height="30" />
                    {this.props.review.rerating}/5
                  </p>
                  <small className="text-muted">
                    Reviewed:
                    {this.props.review.rdate.split('T')[0]}
                  </small>
                </div>
              </div>
              <div className="card-footer">
                <p className="card-text font-italic">{this.props.review.retext}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    /*
      <Link to ={{
                  pathname: linkto , query: query
                }}>
        <div class="card-horizontal" >
          <div class="card-body">
            <h4 class="card-title">{name} </h4>
            <small class="text-muted">{this.props.review.rerating}</small>
            <p class="card-text">{this.props.review.retext}</p>
            <p class="card-text">Category: {this.props.review.rdate}</p>
          </div>
        </div>
      </Link>
      */
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // Get global state to get cid, rid and login details to fetch dishes for customer/restaurant
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
  };
};

export default connect(mapStateToProps)(Review);
