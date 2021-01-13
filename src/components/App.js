import { Switch, Route } from "react-router-dom";
import "../App.css";
import Login from "./Login";
import Signup from "./Signup.js";
import Home from "./Home";
import EditProfile from "./EditProfile";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <div className="App bg-dark">
      <Switch>
        <PrivateRoute exact path="/login" component={Login} />
        {/* <Route path="/app" component={HomeContent} /> */}
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
