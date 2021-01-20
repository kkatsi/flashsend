import { Switch, Route } from "react-router-dom";
import "../App.css";
import Login from "./Login";
import Signup from "./Signup.js";
import Home from "./Home";
import EditProfile from "./EditProfile";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <div className="App bg-dark">
      <Switch>
        <PrivateRoute exact path="/login" component={Login} />
        <PrivateRoute exact path="/signup" component={Signup} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute exact path="/reset-password" component={ForgotPassword} />
        <PrivateRoute path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
