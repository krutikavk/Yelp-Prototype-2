import React, { Component, useState } from 'react';
import DatePicker from "react-datepicker";
import '../../App.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {update, login, logout, customerLogin, loadEvents, addEvent} from '../../_actions';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import Navbar from '../Navbar/navbar';



class AddEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ename: '',
      edescription: '',
      eaddress: '',
      elatitude: '',
      elongitude: '',
      edate: new Date(),
      eaddress: '',
      updated: 'false',
      added: false,
      // s3 photo upload
      url: '',
      success: false,
    }

    //const [edate, setDate] = useState(new Date());

    this.enameChangeHandler = this.enameChangeHandler.bind(this);
    this.edescriptionChangeHandler = this.edescriptionChangeHandler.bind(this);
    this.edateChangeHandler = this.edateChangeHandler.bind(this);
    this.addEvent = this.addEvent.bind(this);

    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSelectAddress = this.handleSelectAddress.bind(this);

    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  enameChangeHandler = (event) => {
    this.setState({
      ename: event.target.value
    })
  }

  edescriptionChangeHandler = (event) => {
    this.setState({
      edescription: event.target.value
    })
  }

  edateChangeHandler = (date) => {
    console.log('selected: ', date)
    this.setState({
      edate: date,
    })
  }

  handleAddressChange = (address) => {
    this.setState({
      eaddress: address
    })
  }

  handleSelectAddress = address => {
    this.setState({eaddress : address});
    console.log(address);

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Location found: ', latLng)
        this.setState({
          elatitude: latLng.lat,
          elongitude: latLng.lng
        })

      })
      .catch(error => console.error('Error', error));
  }

  handleFileChange = (event) => {
    this.setState({
      success: false, url : ''
    });
  }

  handleFileUpload = (event) => {
    this.setState({
      success: false, 
      url : ''
    });

    let file = this.uploadInput.files[0];
    // Split the filename to get the name and type
    let fileParts = this.uploadInput.files[0].name.split('.');
    let fileName = 'event_' + fileParts[0];
    console.log(fileName);
    let fileType = fileParts[1];
    console.log("Preparing the upload");

    axios.defaults.withCredentials = false;
    let url = `${process.env.REACT_APP_BACKEND}/sign_s3`

    axios.post(url, { fileName : fileName, fileType : fileType })
      .then(response => {
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;

        this.setState({url: url})
        this.setState({success: true})
        console.log("Recieved a signed request " + signedRequest);
        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            'ContentType': fileType
          }
        };
        delete axios.defaults.headers.common["authorization"];
        axios.put(signedRequest,file, options)
          .then(result => {
            console.log("Response from s3")
            this.setState({
              success: true
            });
          })
          .catch(error => {
            alert("ERROR " + JSON.stringify(error));
          })
    })
    .catch(error => {
      alert(JSON.stringify(error));
    })
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
  }

  addEvent = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    const url = `${process.env.REACT_APP_BACKEND}/events`;
    const data = {
      ename: this.state.ename,
      edescription: this.state.edescription,
      eaddress: this.state.eaddress,
      elatitude: this.state.elatitude,
      ephoto: this.state.url,
      elongitude: this.state.elongitude,
      edate: this.state.edate,
      rid: this.props.rid,
      rname: this.props.rname
    }
    console.log("data sent to add event", data)

    axios.post(url, data)
      .then(response => {
        console.log('Status Code : ', response.status);
        if(response.status === 200){
          console.log('Event added');
          alert('Event added');
          // this.props.loadEvents(3, response.data);
          this.props.addEvent(3, response.data);
          this.setState({
            added: true,
          })
           
        }
      }).catch(err =>{
          console.log('Add event failed');
      });
  }



  render() {
    let redirectVar = null;

    if(!(this.props.isLogged === true && this.props.whoIsLogged === true)) {
      redirectVar = <Redirect to='/login'/>
    } else if(this.props.eventArr.length > 0 && this.state.added === true) {
      redirectVar = <Redirect to='/events'/>
    }
    console.log('redirectVar: ', redirectVar)

    const Success_message = () => (
      <div class='form-group'>
      <img src={this.state.url} alt="" class="img-responsive" width="150" height="150"/>
      <br/>
      </div>
    )

    return (
      <div>
        {redirectVar}
        <Navbar/>
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center" >

        <br/>
          <form>
            <div className="col d-flex justify-content-center rounded-0">
              <div className="card-header">
                <h4>Host an event</h4>
              </div>
            </div>

            <div className = "form-group text-left">
              <br/>
              <label htmlFor="exampleInputEmail1">Event Name</label>
              <input onChange = {this.enameChangeHandler} 
                                  type="text"  
                                  name="ename" 
                                  className="form-control form-control-sm"
                                  placeholder="Event Name"
                                  aria-describedby="emailHelp" 
                                  required/>
            </div>
            <div className = "form-group text-left">
              <br/>
              <label htmlFor="exampleInputEmail1">Description</label>
              <input onChange = {this.edescriptionChangeHandler} 
                                  type="text"  
                                  name="edescription" 
                                  className="form-control form-control-sm"
                                  placeholder="About the event"
                                  aria-describedby="emailHelp"
                                  rows="5"
                                  required/>
            </div>

            <div className = "form-group text-left">
              <br/>
              <label htmlFor="exampleInputEmail1">Address</label>
              <PlacesAutocomplete
                value={this.state.eaddress}
                onChange={this.handleAddressChange}
                onSelect={this.handleSelectAddress}
                >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div>
                    <input
                      {...getInputProps({
                        placeholder: 'Search Places ...',
                        className: 'location-search-input',
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? 'suggestion-item--active'
                          : 'suggestion-item';
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                          : { backgroundColor: '#ffffff', cursor: 'pointer' };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>

            <div class="form-group">
              {this.state.success ? <Success_message /> : null}
              <input onChange={this.handleFileUpload} ref = {(ref) => {this.uploadInput = ref;}} type = "file"/>
            </div>

            <DatePicker selected={this.state.edate} onChange={this.edateChangeHandler} />
            <div className="col-md-12 text-center">
            <button id="btnLogin" className="btn btn-danger" onClick={this.addEvent}>Add</button>
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
      eventArr: [...state.eventDisplay.eventArr],
      filteredEventArr: [...state.eventDisplay.filteredEventArr],
      displayEventArr: [...state.eventDisplay.displayEventArr],
      rid: state.restProfile.rid,
      rname: state.restProfile.rname,
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
    customerLogin: () => dispatch(customerLogin()),
    loadEvents: (countPerPage, payload) => dispatch(loadEvents(countPerPage, payload)),
    addEvent: (countPerPage, payload) => dispatch(addEvent(countPerPage, payload)),
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent);