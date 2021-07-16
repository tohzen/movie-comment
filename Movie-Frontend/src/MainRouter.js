import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Signup from "./components/Signup/Signup"; // brings import in from components
import Login from "./components/Login/Login"; // brings import in from components
import Home from "./components/Home/Home"; // brings import in from components
import Nav from "./components/Nav/Nav"; // brings import in from components
import Movie from "./components/Movie/Movie"; // brings import in from components
import MovieDetail from "./components/Movie/MovieDetail"; // brings import in from components
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"; // brings import in from components

const MainRouter = (props) => { // functional component
  return (
    <Router>
      <Nav user={props.user} handleUserLogout={props.handleUserLogout} /> {/*Nav is being linked with the function and the user variable so we can use it inside of nav. Verify's if you are logged in.*/}
      <>
        {/* <Route exact path="/movie" component={Movie} /> */}
        <PrivateRoute exact path="/movie" component={Movie} /> {/* lets us use privateRoute instead of normal route if needed. */}
        <Route exact path="/sign-up" component={Signup} />
        {/* <Route exact path="/login" component={Login}>
          <Login handleUserLogin={props.handleUserLogin} />
        </Route> */}


      {/* normal route */}
        <Route
          exact /*needs to  match */
          path="/login" /*this is the route */
          render={(routerProps) => (  // this is our spread operator
            <Login {...routerProps} handleUserLogin={props.handleUserLogin} />
          )}
        />
        {/* /api/user/user-detail/get-user-by-id/:id */}
        {/* <Route exact path="/movie-detail/:movieTitle" component={MovieDetail} /> */}
        <PrivateRoute
          exact
          path="/movie-detail/:movieTitle"
          component={MovieDetail}
        />
        <Route exact path="/" component={Home} />
      </>
    </Router>
  );
};

export default MainRouter;


// each router should get their own components.
// we want nav to exist in every component.
// route - paths need to match url. it goes between pages.
// order matters. if home is first then it will look at home first. but if  home is first, then it will match all the rest of the paths below it to render on one page. to prevent this simply use exact.  otherwise it will render both paths. 

// snippet = routerProps and then you spread it ...routerProps = history,match,location, staticContext like above.

// from private route -- once we check if user is auth, we will come here to delete the user from PrivateRoute.