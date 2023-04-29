// import LoginFormPage from "./components/LoginFormPage";
// import Header from "./components/header";
// import { Switch,Route } from "react-router-dom";
// import * as sessionActions from "./store/session";
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";

// function App() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);
//   useEffect(() => {
//     dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
//   }, [dispatch]);
//   return (
//   <div>
//     <h1>Hello from App</h1>
//    <Header isLoaded={isLoaded}/>
//    {isLoaded&&
//     (
// <Switch>
//      <Route path="/login">
//      <LoginFormPage/>
//      </Route>
     
//         </Switch>
//     ) 
//    }
 

//   </div>
  
   
//   );
// }

// export default App;

// frontend/src/App.js
// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
   <>
   {
isLoaded && (
  <Switch>
    <Route path="/login">
      <LoginFormPage />
    </Route>
    <Route path="/signup">
      <SignupFormPage />
    </Route>
  </Switch>
)
   }
   
   
   </> 
  );
}

export default App;
