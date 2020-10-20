import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {update, login, logout, customerLogin} from '../../_actions';
import Navbar from '../Navbar/navbar';
import jwt_decode from 'jwt-decode';

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

class Custsignup extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  cname: '',
	  cemail: '',
	  cpassword: '',
	  isAdded: false,
    token: '',
	  errors: {
  		cname: '',
  		cemail: '',
  		cpassword: '',
	  }
	}

	this.cnameChangeHandler = this.cnameChangeHandler.bind(this);
	this.cemailChangeHandler = this.cemailChangeHandler.bind(this);
	this.cpasswordChangeHandler = this.cpasswordChangeHandler.bind(this);
	this.registerCustomer = this.registerCustomer.bind(this);

  }

  cnameChangeHandler = (event) => {
    let err = this.state.errors;
    err.cname = validText.test(event.target.value) ? '' : 'Username-Only alphanumeric word';
    this.setState({
      errors: err
        }, ()=> {
          console.log(err.cname)
    }) 
    //this.props.update('CNAME', event.target.value)
    this.setState({
      cname: event.target.value
    })
  }

  cemailChangeHandler = (event) => {
    let err = this.state.errors;
    err.cemail = validEmail.test(event.target.value) ? '' : 'Invalid email ID';
    this.setState({
      errors: err
        }, ()=> {
            console.log(err.cemail)
    }) 
    //this.props.update('CEMAIL', event.target.value)
    this.setState({
      cemail: event.target.value
    })
  }

  cpasswordChangeHandler = (event) => {
    let err = this.state.errors;
    err.cpassword = event.target.value.length >= 5 ? "" : "Password should have 5 or more characters"
    this.setState({
      errors: err
      }, ()=> {
	    console.log(err.cpassword)
  	}) 
    //this.props.update('CPASSWORD', event.target.value)
  	this.setState({
  	  cpassword : event.target.value
  	})
  }

  registerCustomer = (event) => {
  	event.preventDefault();
  	if(validateForm(this.state.errors)) {
      console.info("Valid form")
    } else {
      console.error("Invalid form")
    }

    const data = {
      cname : this.state.cname,
      cemail : this.state.cemail,
      cpassword: this.state.cpassword,
    }

    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post('http://localhost:3001/customers', data)
      .then(response => {

        console.log("Status Code : ",response.status);
        if(response.status === 200){
          console.log('Customer added');
          console.log('Token: ', response.data);

          //Set state first and then decode the token or else the page breaks!
          this.setState({
            token: response.data,
            isAdded : true
          })
          var decoded = jwt_decode(this.state.token.split(' ')[1]);
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
          console.log("Before: ", this.props.isLogged)
          console.log("After: ", this.props.isLogged)

          this.props.login()   //this will update isLogged = true
          this.props.customerLogin()
          
          //This is no longer needed, state error only needed
          
        }
      }).catch(err =>{
        this.setState({
            isAdded : false
        })
        this.props.logout();
        alert('Email ID is already registered')
    });
  }




  render() {
  	let redirectVar = null;
    console.log("islogged props: ", this.props.isLogged)
    /*
    if(this.props.isLogged === true && this.props.whoIsLogged === false) {
      redirectVar = <Redirect to= "/customer/profile"/>
    }
    */
    if (this.state.token.length > 0) {
      localStorage.setItem("token", this.state.token);

      var decoded = jwt_decode(this.state.token.split(' ')[1]);
      localStorage.setItem("cid", decoded.cid);
      localStorage.setItem("cemail", decoded.cemail);
      localStorage.setItem("cpassword", decoded.cpassword);
      localStorage.setItem("cname", decoded.cname);
      localStorage.setItem("cphone", decoded.cphone);
      localStorage.setItem("cabout", decoded.cabout);
      localStorage.setItem("cjoined", decoded.cjoined);
      localStorage.setItem("cphoto", decoded.cphoto);
      localStorage.setItem("cfavrest", decoded.cfavrest);
      localStorage.setItem("cfavcuisine", decoded.cfavcuisine);
      
      redirectVar = <Redirect to="/customer/profile" />
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
                <h4>Customer</h4>
              </div>
            </div>

            <div className = "form-group text-left">
              <br/>
              <label htmlFor="exampleInputEmail1">Name</label>
              <input onChange = {this.cnameChangeHandler} 
                                  type="text"  
                                  name="rname" 
                                  className="form-control form-control-sm"
                                  placeholder="Name"
                                  aria-describedby="emailHelp" 
                                  required/>
                                  {errors.cname.length > 0 && 
                                  <span><small id="emailHelp" className="form-text text-muted">{errors.cname}</small></span>}
            </div>

            <div className = "form-group text-left">
              <br/>
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input onChange = {this.cemailChangeHandler} 
                                  type="email"  
                                  name="cemail" 
                                  className="form-control form-control-sm"
                                  placeholder="Email ID"
                                  aria-describedby="emailHelp" 
                                  required/>
                                  {errors.cemail.length > 0 && 
                                  <span><small id="emailHelp" className="form-text text-muted">{errors.cemail}</small></span>}
            </div>
            <div className="form-group text-left">
              <br/>
              <label htmlFor="exampleInputPassword1">Password</label>
              <input onChange = {this.cpasswordChangeHandler} 
                                  type="password" 
                                  name="cpassword" 
                                  className="form-control form-control-sm"
                                  placeholder="Password"
                                  required/>
                                  {errors.cpassword.length > 0 && 
                                  <span><small id="emailHelp" className="form-text text-muted">{errors.cpassword}</small></span>}
            </div>

            <div className="col-md-12 text-center">
            <button disabled={! validateForm(this.state.errors)} id="btnLogin" className="btn btn-danger" onClick={this.registerCustomer}>Sign up</button>
            </div>
          </form>
        </div>
      </div>






      /*

	    <div>

        {redirectVar}

        <div class="container">
            <form onSubmit={this.registerCustomer} >
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <p>Customer Signup</p>  
                        </div>
                        <div class="form-group">
                            <input onChange = {this.cnameChangeHandler} 
                            type="text"  
                            name="cname" 
                            class="form-control"
                            placeholder="Name"
                            required/>
                            {errors.cname.length > 0 && 
                            <span>{errors.cname}</span>}
                        </div>
                        
                        <div class="form-group">
                            <input onChange = {this.cemailChangeHandler} 
                            type="text"  
                            name="cemail" 
                            class="form-control"
                            placeholder="Email ID"
                            required/>
                            {errors.cemail.length > 0 && 
                            <span>{errors.cemail}</span>}
                        </div>
                        <div class="form-group">
                            <input onChange = {this.cpasswordChangeHandler} 
                            type="password" 
                            name="cpassword" 
                            class="form-control"
                            placeholder="Password"
                            required/>
                            {errors.cpassword.length > 0 && 
                            <span>{errors.cpassword}</span>}
                        </div>
                        
                        <button disabled={! validateForm(this.state.errors)} class="btn btn-danger">Sign Up</button>
                    </div>
                </div>
            </form>
        </div>
      </div>
      */
    )	
  }

}

//importedname: state.reducer.statenames
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

    }
}

//const mapDispatchToProps = (dispatch) => { since this does not call a function directly it cannot be a function

function mapDispatchToProps(dispatch) {  
  return {
    update : (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    customerLogin: () => dispatch(customerLogin())
  }
  
}

//export Login Component
//export default Login;
//export default connect(mapStateToProps, mapDispatchToProps())(Custsignup);
export default connect(mapStateToProps, mapDispatchToProps)(Custsignup);

//export default Custsignup;



