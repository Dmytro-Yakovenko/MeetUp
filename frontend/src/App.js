import LoginFormPage from "./components/LoginFormPage";
import Header from "./components/header";
import { Switch,Route } from "react-router-dom";

function App() {
  return (
  <div>
    <h1>Hello from App</h1>
   <Header/>
   <Switch>
<Route path="/login">
<LoginFormPage/>
</Route>

   </Switch>

  </div>
  
   
  );
}

export default App;
