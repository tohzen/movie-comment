import React, { Component } from "react";
import { isEmpty, isEmail } from "validator";
import jwtDecode from "jwt-decode";

import { toast } from "react-toastify";
import Axios from "../utils/Axios";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";

import "./Login.css";

export class Login extends Component {
  state = { // handles our login page state
    email: "",
    emailError: "",
    emailOnFocus: false,
    password: "",
    passwordError: "",
    passwordOnFocus: false,
    canSubmit: true, // if true, button is disabled
  };

  componentDidMount() {
    let isAuth = checkIfUserIsAuth(); // uses our func from utils, checks if we are logged in.

    if (isAuth) { //if we are, go to movie page.
      this.props.history.push("/movie");
    } // reverse the logic to where we are rendered the movie page if we login.  If we are logged in, we cannot go back to the login page.
  }

  handleOnChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value, // the "name" variable is found in the input box. If the name = email, then the value of that email input will become the value of that variable.
      },
      () => {
        if (event.target.name === "email") {
          if (isEmpty(this.state.email)) {
            this.setState({
              emailError: "Email cannot be empty",
              canSubmit: true,
            });
          } else {
            this.setState({
              emailError: "",
            });
          }
        }

        if (event.target.name === "password") { // the "name" variable is found in the input box. If the name = password, then the value of that password input will become the value of that variable.
          if (isEmpty(this.state.password)) {
            this.setState({
              passwordError: "Password cannot be empty",
              canSubmit: true,
            });
          } else {
            this.setState({
              passwordError: "",
            });
          }
        }
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.canSubmit === true) { // if disabled button is set to true, 
      if (this.state.emailOnFocus && this.state.passwordOnFocus) {// if onfocus is set to true,
        if ( // and the err length is set to 0
          this.state.emailError.length === 0 &&
          this.state.passwordError.length === 0
        ) {
          this.setState({ // make us able to hit submit
            canSubmit: false,
          });
        } else {
          this.setState({ // else, we cant submit 
            canSubmit: true,
          });
        }
      }
    }
  }

  handleInputOnFocus = (event) => {  
    if (!this.state[`${event.target.name}OnFocus`]) {// if focus is set to false, 
      this.setState({
        [`${event.target.name}OnFocus`]: true, // set focus to true,
      });
    }
  };

  handleOnSubmit = async (event) => {
    event.preventDefault(); // always needed for a form

    try {
      let result = await Axios.post("/api/user/login", { // login from back end path
        email: this.state.email,
        password: this.state.password,
      });

      let jwtToken = result.data.payload; // sets the jwt token to be the result.data.payload

      console.log(jwtToken);
      let decodedToken = jwtDecode(jwtToken); // passing in our jwtToken to get our information passed from our backend. (we passed in the email in usercontroller)
      console.log(decodedToken);

      this.props.handleUserLogin(decodedToken); // handles the toggle when we log in, sign-up and login should change to profile and logout

      window.localStorage.setItem("jwtToken", jwtToken);
      toast.success("Login success!");  // toastify success formatting

      this.props.history.push("/movie"); // renders the movie page.
    } catch (e) {
      if (e.response.status === 429) { // send the error message for too many api requests.
        toast.error(e.response.data);
      } else {
        toast.error(e.response.data.payload); // send the error message if the attempt was wrong in logging in.
      }
    }
  };

  render() {
    const { email, emailError, password, passwordError, canSubmit } =
      this.state; // pulling the variables to use from the state
 
    //console.log(this.props);

    return (
      <div className="container">
        <div className="form-text">Login</div> {/* our title */}

        <div className="form-div">
          <form className="form" onSubmit={this.handleOnSubmit}> {/* handles our on submit function */}
            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="email">Email</label> {/* email input box */}
                <input
                  type="email"  //  the type for our form to recognize if it requires other validations.
                  id="email" // for css
                  placeholder="Email"
                  name="email" // in our handleOnChange function, if it is email, change the value to match our input text
                  value={email} // the value is changes based on the handleOnChange function
                  onChange={this.handleOnChange} // allows use to use the handleonchange function
                  onFocus={this.handleInputOnFocus} // if false, set to true
                  autoFocus  // focuses cursor on the first name inputbox.
                />
                <div className="errorMessage">{emailError && emailError}</div> {/* error catch  */}
              </div>
            </div>

            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  id="password" //will be password instead of text.
                  placeholder="Password"
                  name="password"
                  value={password}
                  onFocus={this.handleInputOnFocus}
                  onChange={this.handleOnChange}
                />
                <div className="errorMessage">
                  {passwordError && passwordError}
                </div>
              </div>
            </div>

            <div className="button-container">
              <button type="submit" disabled={canSubmit}>   {/* submit button */}
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
