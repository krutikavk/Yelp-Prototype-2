import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { update } from '../../_actions';
import Review from '../Reviews/displayreview';
import Navbar from '../Navbar/navbar';

const validText = RegExp('[A-Za-z0-9]+');

class DisplayProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
    };
  }

  componentDidMount() {
    // let url = 'http://localhost:3001/customers/' + this.props.cid + '/reviews';
    const url = `${process.env.REACT_APP_BACKEND}/customers/${this.props.cid}/reviews`;
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again 
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          const temp = JSON.parse(JSON.stringify(response.data));
          this.setState({
            reviews: [...temp],
          });
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    let redirectVar = null;
    if (this.props.isLogged === false) {
      redirectVar = <Redirect to='/login' />
    }

    //  customer is logged in, get data from redux state
    let customerprofile = {};

    // If restaurant is logged in, get display data from props passed from another page
    if (this.props.whoIsLogged === true) {
      //customer login--display from redux state
      customerprofile = {
        cid: this.props.location.query.cid,
        cemail: this.props.location.query.cemail,
        cpassword: this.props.location.query.cpassword,
        cname: this.props.location.query.cname,
        cphone: this.props.location.query.cphone,
        cabout: this.props.location.query.cabout,
        cjoined: this.props.location.query.cjoined,
        cphoto: this.props.location.query.cphoto,
        cfavrest: this.props.location.query.cfavrest,
        cfavcuisine: this.props.location.query.cfavcuisine,
      };
    } else {
      customerprofile = {
        cid: this.props.cid,
        cemail: this.props.cemail,
        cpassword: this.props.cpassword,
        cname: this.props.cname,
        cphone: this.props.cphone,
        cabout: this.props.cabout,
        cjoined: this.props.cjoined,
        cphoto: this.props.cphoto,
        cfavrest: this.props.cfavrest,
        cfavcuisine: this.props.cfavcuisine,
      };
    }

    return (
      <div>
        <Navbar />
        <div>
          {redirectVar}
          <div className="container-fluid style={{height: 100}}">
            <div className="row">
              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-horizontal">
                    <img src={this.props.cphoto} className="img-thumbnail" alt="Cinque Terre" width = "300" />

                    <div className="card-body">
                      <p className="card-text font-weight-bold font-italic">
                        {customerprofile.cname}
                      </p>
                      <p className="card-text text-muted font-italic">
                        Here since: {customerprofile.cjoined.split("T")[0]}
                      </p>
                      <p className="card-text text-muted font-italic">
                        Reviews given: {this.state.reviews.length}
                      </p>
                      <p className="card-text text-muted font-italic">
                        Friends: 4728
                      </p>
                      <Link to='/customer/edit' class="btn btn-danger">Edit profile</Link> 
                    </div>
                  </div>
                  <div className="card-footer">
                    <p className="card-text font-weight-bold">About Me:</p>
                    <p className="card-text font-italic">{customerprofile.cabout}</p>
                    <p className="card-text font-weight-bold">Favourite Restaurant:</p>
                    <p className="card-text font-italic">{customerprofile.cfavrest}</p>
                    <p className="card-text font-weight-bold">Favourite Cusine:</p>
                    <p className="card-text font-italic">{customerprofile.cfavcuisine}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid ">
          <p className="card-text font-weight-bold">Reviews Given</p>
          {this.state.reviews.map ((entry) => (
            <Review review={entry} />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cid: state.custProfile.cid,
    cemail: state.custProfile.cemail,
    cpassword: state.custProfile.cpassword,
    cname: state.custProfile.cname,
    cphone: state.custProfile.cphone,
    cabout: state.custProfile.cabout,
    cjoined: state.custProfile.cjoined,
    cphoto: state.custProfile.cphoto,
    cfavrest: state.custProfile.cfavrest,
    cfavcuisine: state.custProfile.cfavcuisine,
    isLogged: state.isLogged.isLoggedIn,
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    update: (field, payload) => dispatch(update(field, payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayProfile);
