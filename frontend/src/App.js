// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Groups from "./components/Groups";
import CreateGroupForm from "./components/CreateGroupForm";
import GroupDetails from "./components/GroupDetails";
import Events from "./components/Events";
import EventDetail from "./components/EventDetails";
import CreateEventForm from "./components/CreateEventForm";
import UpdateGroup from "./components/UpdateGroup";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
    {isLoaded &&  <Switch>
       

       <Route exact path="/" component={LandingPage}/> 
       <Route exact path="/groups" component={Groups}/> 
       <Route exact path="/events" component={Events}/> 
       <Route exact path="/groups/new" component={CreateGroupForm}/> 
       <Route exact path="/groups/:id" component={GroupDetails}/> 
       <Route exact path="/groups/:id/events/new" component={CreateEventForm}/> 
       <Route exact path="/events/:id" component={EventDetail}/> 
       <Route exact path="/groups/:id/edit" component={UpdateGroup}/> 
     </Switch> }
    
    </>
  );
}

export default App;
