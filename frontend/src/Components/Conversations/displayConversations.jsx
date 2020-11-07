import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { update, login, logout, loadConversations } from '../../_actions';
import Navbar from '../Navbar/navbar';

class displayConversations extends Component {

  constructor(props) {
    super(props);

    this.state = {
      conversations: [],
    };
  }

  componentDidMount() {
    let endpoint = '';
    if (this.props.whoIsLogged === true) {
      endpoint = `${process.env.REACT_APP_BACKEND}/conversations/restaurants/${this.props.rid}`;
    } else {
      endpoint = `${process.env.REACT_APP_BACKEND}/conversations/customers/${this.props.cid}`;
    }
    console.log('url: ', endpoint);
    axios.get(endpoint)
      .then((response) => {
        console.log('Status Code : ', response.data);
        if (response.status === 200) {
          // When results return multiple rows, rowdatapacket object needs to be converted to JSON object again
          // use JSON.parse(JSON.stringify()) to convert back to JSON object
          console.log('response: ', response.data);
          let temp = JSON.parse(JSON.stringify(response.data));
          console.log('temp: ', temp);
          this.props.loadConversations(response.data);
          /*
          this.setState({
            conversations: [...temp],
          });

          let temp = JSON.parse(JSON.stringify(response.data));
          console.log('temp: ', temp)
          this.setState({
            restaurants: [...temp],
          });
          */
        }
      }).catch((err) => {
        console.log('No response');
      });
  }

  render() {
    console.log('State: ', this.state.conversations);
    return (
      <div>
        <Navbar />
        worked
      </div>

    /*
      <div>
        <Navbar />
        {this.state.conversations.map((conversation) => (
          <div className="container-fluid style={{height: 100}}">
            <div className="row">
              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-horizontal">
                    <div className="card-body">
                        <p className="card-text">Name: {conversation.rname}</p>
                        <p className="card-text">Message: {conversation.messages[0]}</p>
                    </div>
                  </div>
                  <div className="card-footer">
                      <small className="text-muted">Featured!</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      */

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
  };
};

function mapDispatchToProps(dispatch) {
  return {
    update: (field, payload) => dispatch(update(field, payload)),
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    loadConversations: (payload) => dispatch(loadConversations(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(displayConversations);
