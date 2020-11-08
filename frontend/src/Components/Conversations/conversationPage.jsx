import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadConversations, updateConversation } from '../../_actions';
import '../../App.css';
import axios from 'axios';
import Navbar from '../Navbar/navbar';

// eslint-disable-next-line react/prefer-stateless-function
class conversationPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reply: false,
      replyField: '',
    };

    this.replyHandler = this.replyHandler.bind(this);
    this.replyFieldChangeHandler = this.replyFieldChangeHandler.bind(this);
    this.sendMessageHandler = this.sendMessageHandler.bind(this);
  }

  replyHandler = () => {
    this.setState({
      reply: true
    });
  }

  replyFieldChangeHandler = (event) => {
    this.setState({
      replyField: event.target.value
    })
  }

  sendMessageHandler = () => {
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    let endpoint = `${process.env.REACT_APP_BACKEND}/conversations/${this.props.location.query.convid}`;
    let data = {
      rid: this.props.location.query.rid,
      cid: this.props.location.query.cid,
      flow: this.props.whoIsLogged,
      text: this.state.replyField,
    }

    axios.post(endpoint, data)
      .then((response) => {
        console.log('Status Code : ', response.data);
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          console.log('message sent: ', response.data);
          alert('Message sent');

          let temp = JSON.parse(JSON.stringify(response.data));
          console.log('temp: ', temp);
          this.props.updateConversation(temp);

          // this.props.addMessage(this.props.location.query.convid, this.state.replyField)
          // this.props.addMessage(this.props.location.query.convid, this.state.replyField)
          this.setState({
            reply: false,
            replyField: '',
          })
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    console.log(this.props.location.query.convid);
    const selectedConv = this.props.conversations.filter((conv) => conv._id === this.props.location.query.convid);
    const { messages } = selectedConv[0];

    let replyField = null;

    if(this.state.reply === true) {
      replyField = (
        <div class = 'login-form'>
        <input onChange = {this.replyFieldChangeHandler} 
                                type="text"  
                                name="replytext" 
                                class="form-control"
                                placeholder="..."
                                required/>
        <button class="btn btn-danger btn-sm" onClick = {this.sendMessageHandler}>Send</button>
        </div>
      )
    }

    // eslint-disable-next-line no-confusing-arrow
    // messages = messages.sort((a, b) => a.date < b.date ? 1 : -1);
    const renderMessages = messages.map((message) => {
      return (
        <div>
          <span className="font-weight-bold">
            {`${message.flow === true ? selectedConv[0].rname : selectedConv[0].cname}`}
            :
          </span>
          <span className="font-italic">
            { message.text }
          </span>
        </div>
      );
    });

    return (
      <div>
        <Navbar />
        <div className="container-fluid style={{height: 100}}">
          <div className="row">
            <div className="col-12 mt-3">
              <div className="card">
                <div className="card-horizontal">
                  <div className="card-body">
                    <p className="card-text">
                      {renderMessages}
                    </p>
                  </div>
                  <div className="card-footer">
                    <button
                      onClick={this.replyHandler}
                      className="btn btn-danger btn-sm"
                      type="submit"
                    >
                      Reply
                    </button> <br/>
                    {replyField}
                    <small className="text-muted">Featured!</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // Get global state to get cid, rid and login details to fetch dishes for customer/restaurant
    cid: state.custProfile.cid,
    rid: state.restProfile.rid,
    isLogged: state.isLogged.isLoggedIn,
    whoIsLogged: state.whoIsLogged.whoIsLoggedIn,
    conversations: state.conversation.convArr,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    loadConversations: (payload) => dispatch(loadConversations(payload)),
    updateConversation: (payload) => dispatch(updateConversation(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(conversationPage);
