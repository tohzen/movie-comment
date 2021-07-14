import React, { Component } from "react";
import { ToastContainer } from "react-toastify"; // requires toast
import jwtDecode from "jwt-decode"; // requires jwt token

import MainRouter from "./MainRouter";
import setAxiosAuthToken from "./components/utils/setAxiosAuthToken";

import "./App.css";

export class App extends Component {
  state = {
    user: null,
  };

  componentDidMount() {
    let getJwtToken = window.localStorage.getItem("jwtToken"); // looks through local storage for token

    if (getJwtToken) {
      const currentTime = Date.now() / 1000; // current time

      let decodedJWTToken = jwtDecode(getJwtToken); // decodes token for login or logout

      if (decodedJWTToken.exp < currentTime) { // tracks if the decoded token expiration time is less than the current time
        //logout
        this.handleUserLogout();
      } else {
        //login
        this.handleUserLogin(decodedJWTToken);
      }

      // console.log("currentTime", currentTime);
      // June XXXX xxpm- 1624985322
      // ONE DAY FROM June XXXX xxpm - 1625071722
      // Current Time - 163500000
      // console.log("decodedJWTToken", decodedJWTToken);
    }
  }

  handleUserLogin = (user) => { // user login function
    this.setState({
      user: {
        email: user.email,
      },
    });
  };

  handleUserLogout = () => { // logout function
    window.localStorage.removeItem("jwtToken"); // removes token
    setAxiosAuthToken(null);
    this.setState({
      user: null,
    });
  };

  render() {
    return (
      <>
        <ToastContainer position="top-center" />

        <MainRouter
          user={this.state.user}
          handleUserLogin={this.handleUserLogin}
          handleUserLogout={this.handleUserLogout}
        />
      </>
    );
  }
}

export default App;
