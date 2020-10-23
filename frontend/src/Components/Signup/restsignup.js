import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import jwt_decode from 'jwt-decode';
import {update, login, logout, restaurantLogin} from '../../_actions';
import Navbar from '../Navbar/navbar';

const validText = RegExp('[A-Za-z0-9]+')
// eslint-disable-next-line no-useless-escape
const validEmail = RegExp('\\S+\@\\S+\.\\S+')
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class Restsignup extends Component {
  constructor(props) {
	  super(props);

    this.state = {
      rname: '',
      remail: '',
      rpassword: '',
      token: '',
      isAdded: false,
      errors: {
        rname: '',
        remail: '',
        rpassword: '',
      }
    }

    this.rnameChangeHandler = this.rnameChangeHandler.bind(this);
    this.remailChangeHandler = this.remailChangeHandler.bind(this);
    this.rpasswordChangeHandler = this.rpasswordChangeHandler.bind(this);
    this.registerRestaurant = this.registerRestaurant.bind(this);
  }

  rnameChangeHandler = (event) => {
    let err = this.state.errors;
    err.rname = validText.test(event.target.value) ? '' : 'Username-Only alphanumeric word';
    this.setState({
      errors: err
        }, ()=> {
        console.log(err.rname)
    }) 
    this.setState({
      rname: event.target.value
    })
  }


  remailChangeHandler = (event) => {
    let err = this.state.errors;
    err.remail = validEmail.test(event.target.value) ? '' : 'Invalid email ID';
    this.setState({
      errors: err
        }, ()=> {
        console.log(err.remail)
    }) 

    this.setState({
      remail: event.target.value
    })
  }

  rpasswordChangeHandler = (event) => {
    let err = this.state.errors;
    err.rpassword = event.target.value.length >= 5 ? "" : "Password should have 5 or more characters"
    this.setState({
      errors: err
      }, ()=> {
      console.log(err.rpassword)
    }) 
    
    this.setState({
      rpassword : event.target.value
    })
  }

  registerRestaurant = (event) => {
    event.preventDefault();
    if(validateForm(this.state.errors)) {
      console.info("Valid form")
    } else {
      console.error("Invalid form")
    }

    const data = {
      rname : this.state.rname,
      remail : this.state.remail,
      rpassword: this.state.rpassword,
    }

    axios.defaults.withCredentials = true;
    //make a post request with the user data
    let url = process.env.REACT_APP_BACKEND + '/restaurants';
    axios.post(url, data)
      .then(response => {

        console.log("Status Code : ",response.status);
        if(response.status === 200){
          console.log('Restaurant added')
          var decoded = jwt_decode(response.data.split(' ')[1]);
          //call props action
          console.log('Decoded token: ', decoded);
          console.log('Token: ', response.data);
          this.props.update('RID', decoded.rid)
          this.props.update('REMAIL', decoded.remail)
          this.props.update('RPASSWORD', decoded.rpassword)
          this.props.update('RNAME', decoded.rname)
          this.props.update('RPHONE', decoded.rphone)
          this.props.update('RABOUT', decoded.rabout)
          this.props.update('RPHOTO', decoded.rphoto)
          this.props.update('RLATITUDE', decoded.rlatitude)
          this.props.update('RLONGITUDE', decoded.rlongitude)
          this.props.update('RADDRESS', decoded.raddress)
          this.props.update('RCUISINE', decoded.rcuisine)
          this.props.update('RDELIVERY', decoded.rdelivery)
          this.props.update('RDISH', decoded.rdish)
          this.props.update('RHOURS', decoded.rhours)
          this.props.update('RRATING', decoded.rrating)
          this.props.update('REVENTS', decoded.revents)
          this.props.login()
          this.props.restaurantLogin()

          this.setState({
              token: response.data,
              isAdded : true
          })      
        }
      }).catch(err =>{
          this.setState({
              isAdded : false
          })
          this.props.logout();
      });
  }

	render (){
    let redirectVar = null;
    /*
    if(cookie.load('cookie')){
      console.log(cookie)
      redirectVar = <Redirect to= "/userdash"/>
    } */

    if (this.state.token.length > 0) {
      localStorage.setItem("token", this.state.token);
      var decoded = jwt_decode(this.state.token.split(' ')[1]);

      localStorage.setItem('rid', decoded.rid)
      localStorage.setItem('remail', decoded.remail)
      localStorage.setItem('rpassword', decoded.rpassword)
      localStorage.setItem('rname', decoded.rname)
      localStorage.setItem('rphone', decoded.rphone)
      localStorage.setItem('rabout', decoded.rabout)
      localStorage.setItem('rphoto', decoded.rphoto)
      localStorage.setItem('rlatitude', decoded.rlatitude)
      localStorage.setItem('rlongitude', decoded.rlongitude)
      localStorage.setItem('raddress', decoded.raddress)
      localStorage.setItem('rcuisine', decoded.rcuisine)
      localStorage.setItem('rdelivery', decoded.rdelivery)
      localStorage.setItem('rdish', decoded.rdish)
      localStorage.setItem('rhours', decoded.rhours)
      localStorage.setItem('rrating', decoded.rrating)
      localStorage.setItem('revents', decoded.revents)
      redirectVar = <Redirect to= "/restaurant/updateinfo"/>
    }


    const errors = this.state.errors;

    return (

      <div>
        {redirectVar} 
        <Navbar/>
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center" >

        <br/>
          <form>
            <div className="col d-flex justify-content-center rounded-0">
              <div className="card-header">
                <h4>Restaurant</h4>
              </div>
            </div>

            <div className = "form-group text-left">
              <br/>
              <label htmlFor="exampleInputEmail1">Restaurant Name</label>
              <input onChange = {this.rnameChangeHandler} 
                                  type="text"  
                                  name="rname" 
                                  className="form-control form-control-sm"
                                  placeholder="Restaurant Name"
                                  aria-describedby="emailHelp" 
                                  required/>
                                  {errors.rname.length > 0 && 
                                  <span><small id="emailHelp" className="form-text text-muted">{errors.rname}</small></span>}
            </div>

            <div className = "form-group text-left">
              <br/>
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input onChange = {this.remailChangeHandler} 
                                  type="email"  
                                  name="email" 
                                  className="form-control form-control-sm"
                                  placeholder="Email ID"
                                  aria-describedby="emailHelp" 
                                  required/>
                                  {errors.remail.length > 0 && 
                                  <span><small id="emailHelp" className="form-text text-muted">{errors.remail}</small></span>}
            </div>
            <div className="form-group text-left">
              <br/>
              <label htmlFor="exampleInputPassword1">Password</label>
              <input onChange = {this.rpasswordChangeHandler} 
                                  type="password" 
                                  name="password" 
                                  className="form-control form-control-sm"
                                  placeholder="Password"
                                  required/>
                                  {errors.rpassword.length > 0 && 
                                  <span><small id="emailHelp" className="form-text text-muted">{errors.rpassword}</small></span>}
            </div>

            <div className="col-md-12 text-center">
            <button disabled={! validateForm(this.state.errors)} id="btnLogin" className="btn btn-danger" onClick={this.registerRestaurant}>Sign up</button>
            </div>
          </form>
        </div>
      </div>

    )
  }

}



//importedname: state.reducer.statenames
const mapStateToProps = (state) => {
    return {

      /*
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
      */

      rid: state.restProfile.rid,
      remail: state.restProfile.remail,
      rpassword: state.restProfile.rpassword,
      rname: state.restProfile.rname,
      rphone: state.restProfile.rphone,
      rabout: state.restProfile.rabout,
      rphoto: state.restProfile.rphoto,
      rlatitude: state.restProfile.rlatitude,
      rlongitude: state.restProfile.rlongitude,
      raddress: state.restProfile.raddress,
      rcuisine: state.restProfile.rcuisine,
      rdelivery: state.restProfile.rdelivery,
      rdish: state.restProfile.rdish,
      rhours: {...state.restProfile.hours},
      rrating: state.restProfile.rrating,
      revents: state.restProfile.revents,
      isLogged: state.isLogged.isLoggedIn,
      whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
    }
}

//const mapDispatchToProps = (dispatch) => { since this does not call a function directly it cannot be a function

function mapDispatchToProps(dispatch) {  
  return {
    update : (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    restaurantLogin: () => dispatch(restaurantLogin()),
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Restsignup);


