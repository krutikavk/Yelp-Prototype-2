import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Navbar from '../Navbar/navbar';
import pumpkin from './mediterranean.jpg';


class Event extends Component {

  constructor(props) {
    super(props);
    this.state = {
      registered: false,
      attendees: []
    }

    this.register = this.register.bind(this);
    this.showAttendees = this.showAttendees.bind(this)



  }

  register = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    console.log('this.props: ', this.props);
    const url = `${process.env.REACT_APP_BACKEND}/events/${this.props.location.query.eid}/register`;
    // let url = 'http://localhost:3001/events/' + this.props.location.query.eid + '/customers'
    const data = {
      cid: this.props.cid
    }

    axios.post(url, data)
    .then(response => {
        console.log("Status Code : ",response.status);
        if(response.status === 200){
          alert('Registered');
        }
      }).catch(err =>{
        alert("Incorrect credentials")
        this.setState({
            authFlag : false
        })
    });

  }

  showAttendees = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    console.log('this.props: ', this.props);
    const url = `${process.env.REACT_APP_BACKEND}/events/${this.props.location.query.eid}/customers`;

    //TODO 
    // let url = 'http://localhost:3001/events/' + this.props.location.query.eid + '/customers'
    axios.get(url)
    .then(response => {
        console.log("Status Code : ",response.status);
        if(response.status === 200) {
          const temp = JSON.parse(JSON.stringify(response.data));
          this.props.loadEvents(3, response.data);
          this.setState({
            events: [...temp],
          });
        }
      }).catch(err =>{
        alert("Incorrect credentials")
    });

}



  render () {

    let controlButton = null;
    let attendeesDisplay = null;


    if(this.props.whoIsLogged === false) {
      //Allow customers to register for event
      controlButton = <button id="btnLogin" className="btn btn-danger" onClick={this.register}>Register</button>

    } else if(this.props.whoIsLogged === true) {
      //View all registered customers for restaurants
      controlButton = <button id="btnLogin" className="btn btn-danger" onClick={this.showAttendees}>Show Attendees</button>
    }






    return (
      <div>
        <Navbar/>
        <div class="container-fluid style={{height: 100}}">
            Event description
            <div class="row">
              <div class="col-12 mt-3">
                <div class="card">
                  <div class="card-horizontal">
                      <div class="img-square-wrapper">
                        <img class="img-responsive img-thumbnail" src={pumpkin} alt="restro" width="400"/>
                      </div>
                    <div class="card-body">
                      <p class="card-text font-weight-bold">{this.props.location.query.ename}</p>
                      <p class="card-text font-italic">{this.props.location.query.edescription}</p>
                      <p class="card-text font-italic">Address: {this.props.location.query.eaddress}</p>
                      <p class="card-text font-italic">Schedule: {this.props.location.query.edate}</p>
                      <p class="card-text font-italic">Hosted by: {this.props.location.query.rname}</p>
                    </div>
                  </div>
                  <div class="card-footer">
                    <p class="card-text font-italic">Featured!</p>
                    {controlButton}
                    { this.state.attendees.map (entry => (
                      <Link to ={{
                          pathname: '/customer/profile' , query: entry
                        }}>
                          <div> Customer name: {entry.cname} </div>
                        </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



    )


  }
}

const mapStateToProps = (state) => {
    return {

      //Get global state to get cid, rid and login details to fetch dishes for customer/restaurant

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

      rid: state.restProfile.rid,
      remail: state.restProfile.remail,
      rpassword: state.restProfile.rpassword,
      rname: state.restProfile.rname,
      rphone: state.restProfile.rphone,
      rabout: state.restProfile.rabout,
      rphoto: state.restProfile.rphoto,
      rlocation: state.restProfile.rlocation,
      rlatitude: state.restProfile.rlatitude,
      rlongitude: state.restProfile.rlongitude,
      raddress: state.restProfile.raddress,
      rcuisine:  state.restProfile.rcuisine,
      rdelivery: state.restProfile.rdelivery,

      isLogged: state.isLogged.isLoggedIn,
      whoIsLogged: state.whoIsLogged.whoIsLoggedIn,

    }
}


export default connect(mapStateToProps)(Event);