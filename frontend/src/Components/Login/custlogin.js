import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import jwt_decode from 'jwt-decode';

//use react-router-dom ONLY
//see Marko Perendio comment about using react-router-dom
//Refer: https://stackoverflow.com/questions/55552147/invariant-failed-you-should-not-use-route-outside-a-router
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {update, login, logout, customerLogin} from '../../_actions'
import Navbar from '../Navbar/navbar';

//const jwt_decode = require('jwt-decode');


const validEmail = RegExp('\\S+\@\\S+\.\\S+')
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class custLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {

      email: '',
      password: '',
      loginOption: '',
      authFlag: false,
      token: '',
      errors: {
        email: '',
        password: '',
      }
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
    let err = this.state.errors;
    err.email = validEmail.test(event.target.value) ? "" : "Invalid email ID"
    this.setState({
            errors: err
        }, ()=> {
            console.log(err.email)
    }) 
    this.setState({
        email : event.target.value
    })
  }

  passwordChangeHandler = (event) => {
    let err = this.state.errors;
    err.password = event.target.value.length >= 5 ? "" : "Password should have 8 or more characters"
    this.setState({
      errors: err
      }, ()=> {
      console.log(err.password)
    }) 
    this.setState({
      password : event.target.value
        
    })
  }

  submitLogin = (event) => {
    event.preventDefault();

    if(validateForm(this.state.errors)) {
      console.info("Valid form")
        
    } else {
      console.error("Invalid form")
    }

    const data = {
      cemail : this.state.email,
      cpassword : this.state.password,
    }
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    let url = process.env.REACT_APP_BACKEND + '/customers/login';
    axios.post(url, data)
      .then(response => {
        console.log("Status Code : ",response.status);
        if(response.status === 200){
          console.log('Login authorized');
          console.log('Token: ', response.data);
          
          var decoded = jwt_decode(response.data.split(' ')[1]);
          console.log('decoded: ', decoded);
          this.props.update('CID', decoded.cid)
          this.props.update('CEMAIL', decoded.cemail)
          this.props.update('CPASSWORD', decoded.cpassword)
          this.props.update('CNAME', decoded.cname)
          this.props.update('CPHONE', decoded.cphone)
          this.props.update('CABOUT', decoded.cabout)
          this.props.update('CJOINED', decoded.cjoined)
          this.props.update('CPHOTO', decoded.cphoto)
          this.props.update('CFAVREST', decoded.cfavrest)
          this.props.update('CFAVCUISINE', decoded.cfavcuisine)
          this.props.update('CFOLLOWERS', decoded.cfollowers)
          this.props.update('CFOLLOWING', decoded.cfollowing)
          this.props.update('CLATITUDE', decoded.clatitude)
          this.props.update('CLONGITUDE', decoded.clongitude)
          this.props.update('CADDRESS', decoded.caddress)
          this.props.login()   //this will update isLogged = true
          this.props.customerLogin()

          this.setState({
              token: response.data,
              authFlag : true
          })
        }
      }).catch(err =>{
        alert("Incorrect credentials")
        this.setState({
            authFlag : false
        })
    });
  }

  render(){
    //redirect based on successful login

    let redirectVar = null;
    if(this.props.isLogged === true) {
      //This will be changed to Search page
      redirectVar = <Redirect to= "/customer/profile"/>
    }
    

    if (this.state.token.length > 0) {
      localStorage.clear();
      localStorage.setItem("token", this.state.token);

      var decoded = jwt_decode(this.state.token.split(' ')[1]);
      redirectVar = <Redirect to="/customer/profile" />
    }

    const errors = this.state.errors;

    return(
      <div>
        <Navbar/>
        <div>
          {redirectVar}
          <div className="card col-12 col-lg-4 login-card mt-2 hv-center" >
          <br/>
            <form>
              <div className="col d-flex justify-content-center rounded-0">
                <div className="card-header">
                  <h4>Customer</h4>
                </div>
              </div>

              <div className = "form-group text-left">
                <br/>
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input onChange = {this.emailChangeHandler} 
                                    type="email"  
                                    name="email" 
                                    className="form-control form-control-sm"
                                    placeholder="Email ID"
                                    aria-describedby="emailHelp" 
                                    required/>
                                    {errors.email.length > 0 && 
                                    <span><small id="emailHelp" className="form-text text-muted">{errors.email}</small></span>}
              </div>
              <div className="form-group text-left">
                <br/>
                <label htmlFor="exampleInputPassword1">Password</label>
                <input onChange = {this.passwordChangeHandler} 
                                    type="password" 
                                    name="password" 
                                    className="form-control form-control-sm"
                                    placeholder="Password"
                                    required/>
                                    {errors.password.length > 0 && 
                                    <span><small id="emailHelp" className="form-text text-muted">{errors.password}</small></span>}
              </div>

              <div className="col-md-12 text-center">
              <button disabled={! validateForm(this.state.errors)} id="btnLogin" className="btn btn-danger" onClick={this.submitLogin}>Login</button>
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
      //Customer props
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
      cfollowers: [...state.custProfile.cfollowers],
      cfollowing: [...state.custProfile.cfollowing],
      clatitude: state.custProfile.clatitude,
      clongitude: state.custProfile.clongitude,
      caddress: state.custProfile.caddress,
      isLogged: state.isLogged.isLoggedIn,
      whoIsLogged: state.whoIsLogged.whoIsLoggedIn
    }
}

//const mapDispatchToProps = (dispatch) => { since this does not call a function directly it cannot be a function

function mapDispatchToProps(dispatch) {  
  return {
    update : (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    customerLogin: () => dispatch(customerLogin()),
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(custLogin);
//export Login Component
//export default Login;
