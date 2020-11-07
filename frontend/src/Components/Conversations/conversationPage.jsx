import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addMessage } from '../../_actions';
import '../../App.css';
import axios from 'axios';
import Navbar from '../Navbar/navbar';

// eslint-disable-next-line react/prefer-stateless-function
class conversationPage extends Component {

  render() {
    console.log(this.props.location.query.convid);
    const selectedConv = this.props.conversations.filter((conv) => conv._id === this.props.location.query.convid);
    const { messages } = selectedConv[0];

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
    addMessage: (convid, message) => dispatch(addMessage(convid, message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(conversationPage);
