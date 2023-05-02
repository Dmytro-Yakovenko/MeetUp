// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <LandingPage/>
      <Switch>
       

        <Route exact path="/" component={LandingPage}/> 
        <Route exact path="/groups" component={LandingPage}/> 
        <Route exact path="/events" component={LandingPage}/> 
        <Route exact path="/groups/new" component={LandingPage}/> 
        <Route exact path="/groups/:id" component={LandingPage}/> 
        <Route exact path="/groups/:id/events" component={LandingPage}/> 
        <Route exact path="/events/:id" component={LandingPage}/> 
        <Route exact path="/groups/:id/update" component={LandingPage}/> 
      </Switch>
    </>
  );
}

export default App;
