import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateConversation } from '../../_actions';
import '../../App.css';
import axios from 'axios';

class conversationCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
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
    let endpoint = `${process.env.REACT_APP_BACKEND}/conversations/${this.props.conv._id}`;
    let data = {
      rid: this.props.conv.rid,
      cid: this.props.conv.cid,
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
          //this.props.addMessage(this.props.conv._id, this.state.replyField)
          let temp = JSON.parse(JSON.stringify(response.data));
          console.log('temp: ', temp);
          this.props.updateConversation(temp);

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
    console.log('=> this.props', this.props);
    if(this.state.expand === true) {
      //Add pagination here
    }

    let nameDisplay = '';
    let replyField = null;

    if(this.props.conv.messages[0].flow === true) {
      nameDisplay = this.props.conv.rname;
    } else {
      nameDisplay = this.props.conv.cname;
    }

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

    return (
      <div className="container-fluid style={{height: 100}}">
        <div className="row">
          <div className="col-12 mt-3">
            <div className="card">
              <div className="card-horizontal">
                <div className="card-body">
                  <p className="card-text">
                    <span className="font-weight-bold">
                      { nameDisplay }: 
                    </span>
                    <span className="font-italic">
                      { this.props.conv.messages[this.props.conv.messages.length - 1].text}
                    </span>
                  </p>
                  
                  {replyField}
                </div>
                </div>
                <div className="card-footer">
                <div class="wrapper">
                  <button
                    onClick={this.replyHandler}
                    className="btn btn-danger btn-sm"
                    type="submit"
                  >
                    Reply
                  </button> <br/>
                  <Link to={{
                    pathname: '/conversationPage',
                    query: {
                      convid: `${this.props.conv._id}`,
                      rid: `${this.props.conv.rid}`,
                      cid: `${this.props.conv.cid}`,
                    },
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    View All
                  </Link>
                  
                </div>
                <small className="text-muted">Featured!</small>
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
    updateConversation: (payload) => dispatch(updateConversation(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(conversationCard);