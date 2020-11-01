import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
//use react-router-dom ONLY
//see Marko Perendio comment about using react-router-dom
//Refer: https://stackoverflow.com/questions/55552147/invariant-failed-you-should-not-use-route-outside-a-router
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {update, login, logout, restaurantLogin} from '../../_actions'
import Navbar from '../Navbar/navbar';


class restLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loginOption: '',
      token: '',
      authFlag: false,
    };

    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  loginOptionHandler = (event) => {
    this.setState({
      loginOption: event.target.value
    })
  }

  // Comment
  emailChangeHandler = (event) => {
    this.setState({
        email : event.target.value
    })
  }

  passwordChangeHandler = (event) => {
    this.setState({
      password : event.target.value
        
    })
  }

  submitLogin = (event) => {
    event.preventDefault();

    const data = {
      remail : this.state.email,
      rpassword : this.state.password,
    }
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    let url = process.env.REACT_APP_BACKEND + '/restaurants/login';
    axios.post(url, data)
      .then(response => {
        console.log("Status Code : ",response.status);
        console.log("login here")
        if(response.status === 200){
          console.log('Login authorized');

          //1. Update props
          //2. then update state so that when page redirects using token,
          // it will have rid available from redux state
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

          //weird--dosnt work here
          this.props.restaurantLogin()
          this.setState({
              token: response.data,
              authFlag : true
          })
          //weird--restaurant login works here
          //this.props.restaurantLogin()          
        }
      }).catch(err =>{
        this.setState({
            authFlag : false
        })
    });
  }

  render(){
    //redirect based on successful login

    let redirectVar = null;
    /*
    console.log("whoislogged: ", this.props.whoIsLogged)
    if(this.state.authFlag === true) {
      redirectVar = <Redirect to= "/restaurant"/>
      //redirectVar = <Redirect to= "/events/add"/>
    }
    */
    if (this.state.token.length > 0) {
      localStorage.clear();
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
      
      redirectVar = <Redirect to="/restaurant" />
    }

    return(

      <div>
        <Navbar/>
        <div>
          {redirectVar} 
          <div className="card col-12 col-lg-4 login-card mt-2 hv-center" >
            <form>
              <div className="col d-flex justify-content-center rounded-0">
                <div className="card-header">
                  <h4>Restaurant</h4>
                </div>
              </div>

              
              <div className = "form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input onChange = {this.emailChangeHandler} 
                                    type="email"  
                                    name="email" 
                                    className="form-control form-control-sm"
                                    placeholder="Email ID"
                                    aria-describedby="emailHelp" 
                                    required/>
                                    
              </div>

              <div className="form-group text-left">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input onChange = {this.passwordChangeHandler} 
                                    type="password" 
                                    name="password" 
                                    className="form-control form-control-sm"
                                    placeholder="Password"
                                    required/>
                                    
              </div>

              <div className="col-md-12 text-center">
              <button id="btn btnLogin" className="btn btn-danger" onClick={this.submitLogin}>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}


//importedname: state.reducer.statename
const mapStateToProps = (state) => {
    return {
      //Restaurant props
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
      rcuisine: state.restProfile.rcuisine,
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
      rphoto: [...state.restProfile.rphoto],
      rlatitude: state.restProfile.rlatitude,
      rlongitude: state.restProfile.rlongitude,
      raddress: state.restProfile.raddress,
      rcuisine: state.restProfile.rcuisine,
      rdelivery: state.restProfile.rdelivery,
      rdish: JSON.parse(JSON.stringify(state.restProfile.rdish)),
      rhours: {...state.restProfile.hours},
      rrating: state.restProfile.rrating,
      revents: [...state.restProfile.revents],
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

export default connect(mapStateToProps, mapDispatchToProps)(restLogin);
//export Login Component
//export default Login;
