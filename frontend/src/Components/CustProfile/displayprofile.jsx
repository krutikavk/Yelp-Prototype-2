import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { update, loadConversations, addFollower } from '../../_actions';
import Review from '../Reviews/displayreview';
import Navbar from '../Navbar/navbar';

class DisplayProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      continueConv: false,
      createNewConv: false,
      convid: '',
      newMessage: false,
      newMessageField: '',
    };

    this.followHandler = this.followHandler.bind(this);
    this.initiateConv = this.initiateConv.bind(this);

    // These will help initiate a new conversation with a user
    this.newMessageHandler = this.newMessageHandler.bind(this);
    this.newMessageFieldHandler = this.newMessageFieldHandler.bind(this);
    this.sendMessageHandler = this.sendMessageHandler.bind(this);
  }

  followHandler = (event) => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    let endpoint = `${process.env.REACT_APP_BACKEND}/customers/${this.props.cid}/follow`;
    let data = {
      cid: this.props.location.query.cid,
    }
    axios.post(endpoint, data)
      .then((response) => {
        console.log('Status Code : ', response.data);
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          console.log('message sent: ', response.data);
          //this.props.addMessage(this.props.conv._id, this.state.replyField)
          let temp = JSON.parse(JSON.stringify(response.data));
          console.log('temp: ', temp);
          alert('Now following');
          this.props.addFollower(this.props.cid, this.props.location.query.cid);
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  newMessageHandler = () => {
    this.setState({
      reply: true
    });
  }

  newMessageFieldHandler = (event) => {
    this.setState({
      newMessageField: event.target.value
    })
  }

  sendMessageHandler = () => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    let endpoint = `${process.env.REACT_APP_BACKEND}/conversations`;
    let data = {
      rid: this.props.rid,
      rname: this.props.rname,
      cid: this.props.location.query.cid,
      cname: this.props.location.query.cname,
      flow: this.props.whoIsLogged,   //always true
      text: this.state.newMessageField,
    }
    axios.post(endpoint, data)
      .then((response) => {
        console.log('Status Code : ', response.data);
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          console.log('message sent: ', response.data);
          alert('Message sent');
          //this.props.addMessage(this.props.conv._id, this.state.replyField)
          let temp = JSON.parse(JSON.stringify(response.data));
          console.log('temp: ', temp);
          this.props.loadConversations(temp);

          this.setState({
            createNewConv: true,
            newMessage: false,
            convid: response.data[0]._id,
          })
        }
      }).catch((err) => {
        console.log('No response');
      });
  }


  initiateConv = (event) => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    const url = `${process.env.REACT_APP_BACKEND}/conversations/check`;
    console.log('this.props.location.query.cid', this.props.location.query.cid)
    console.log('this.props.rid', this.props.rid);
    const data = {
      cid: this.props.location.query.cid,
      rid: this.props.rid,
    }
    console.log('data sent: ', data)
    axios.post(url, data)
      .then((response) => {
        console.log('response: ', response.status)
        if (response.status === 200) {
          // Conversation exists
          console.log('Conversation found: ', response.data)
          // Load conversations first before trying to go to conversations page
          // Why? Conversations page iterates thorough conversations to select correct conv
          this.props.loadConversations(response.data);
          this.setState({
            continueConv: true, 
            convid: response.data[0]._id,
          })
        } else {
          // have to create a new conversation
          
        }
      }).catch(() => {
        //No conversation--400 returned
        console.log('No Conversation found')
          this.setState({
            newMessage: true,
          })
      });
  }

  componentDidMount() {
    // let url = 'http://localhost:3001/customers/' + this.props.cid + '/reviews';
    const custId = (this.props.whoIsLogged === true) ? this.props.location.query.cid : this.props.cid;
    const url = `${process.env.REACT_APP_BACKEND}/customers/${custId}/reviews`;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
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
      }).catch(() => {
        console.log('No response');
      });
  }

  render() {
    let redirectVar = null;
    if (this.props.location.query === undefined && this.props.isLogged === false) {
      redirectVar = <Redirect to='/login' />;
    }
    //  customer is logged in, get data from redux state
    let customerprofile = {};
    let isMyPage = false;
    // If restaurant is logged in, get display data from props passed from another page
    if (this.props.location.query !== undefined) {
      // coming from search/review page
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
        cfollowers: [...this.props.location.query.cfollowers],
        cfollowing: [...this.props.location.query.cfollowing],
        clatitude: this.props.location.query.clatitude,
        clongitude: this.props.location.query.clongitude,
        caddress: this.props.location.query.caddress,
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
        cfollowers: [...this.props.cfollowers],
        cfollowing: [...this.props.cfollowing],
        clatitude: this.props.clatitude,
        clongitude: this.props.clongitude,
        caddress: this.props.caddress,
      };
      isMyPage = true;
    }

    console.log('customerProfile: ', customerprofile);

    let editProfile = null;
    if (this.props.isLogged === true && this.props.whoIsLogged === false && isMyPage === true) {
      editProfile = <Link to='/customer/edit' class="btn btn-danger">Edit profile</Link>
    }

    let messageButton = null;
    // Restaurant is logged in 
    if (this.props.isLogged === true && this.props.whoIsLogged === true) {
      messageButton = <button class="btn btn-danger btn-sm" onClick = {this.initiateConv}>Message</button>;
    }

    //One customer can follow another
    // Show follow page only if another customer visits the profile page
    let followButton = null;
    if (this.props.isLogged === true && this.props.whoIsLogged === false && isMyPage === false) {
      followButton = <button class="btn btn-danger btn-sm" onClick = {this.followHandler}>Follow</button>;
    }

    let continueConversation = null;
    if(this.state.continueConv === true) {
      console.log('conversation id: ', this.state.convid)
      messageButton = <Link to={{
                    pathname: '/conversationPage',
                    query: {
                      convid: `${this.state.convid}`,
                      rid: `${this.props.rid}`,
                      cid: `${this.props.location.query.cid}`,
                    },
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    Go to Conversation
                  </Link>
    }

    let newConversationStarted = null;
    if(this.state.createNewConv === true) {
      messageButton = <Link to={{
                    pathname: '/conversationPage',
                    query: {
                      convid: `${this.state.convid}`,
                      rid: `${this.props.rid}`,
                      cid: `${this.props.location.query.cid}`,
                    },
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    Go to Conversation
                  </Link>
    }

    let newMessageField = null;
    if(this.state.newMessage === true) {
      newMessageField = (
        <div class = 'login-form'>
        <input onChange = {this.newMessageFieldHandler} 
                                type="text"  
                                name="replytext" 
                                class="form-control"
                                placeholder="..."
                                required/>
        <button class="btn btn-danger btn-sm" onClick = {this.sendMessageHandler}>Send</button>
        </div>
      );
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
                    <img src={customerprofile.cphoto} className="img-thumbnail" alt="Cinque Terre" width="300" />

                    <div className="card-body">
                      <p className="card-text font-weight-bold font-italic">
                        {customerprofile.cname}
                      </p>
                      <p className="card-text text-muted font-italic">
                        Here since:
                        {customerprofile.cjoined.split('T')[0]}
                      </p>
                      <p className="card-text text-muted font-italic">
                        Reviews given:
                        {this.state.reviews.length}
                      </p>
                      <p className="card-text text-muted font-italic">
                        Followers: {customerprofile.cfollowers.length} <br />
                        Following: {customerprofile.cfollowing.length}
                      </p>
                      {editProfile}
                      {messageButton}
                      {followButton}
                      {newMessageField}
                      {newConversationStarted}
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
          {this.state.reviews.map((entry) => (
            <Review review={entry} />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rid: state.restProfile.rid,
    rname: state.restProfile.rname,
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
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    update: (field, payload) => dispatch(update(field, payload)),
    loadConversations: (payload) => dispatch(loadConversations(payload)),
    addFollower: (followercid, followingcid) => dispatch(addFollower(followercid, followingcid)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayProfile);
