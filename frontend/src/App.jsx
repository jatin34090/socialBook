import { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./compoments/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import Home from "./compoments/screens/Home";
import Login from "./compoments/screens/Login";
import Signup from "./compoments/screens/Signup";
import Profile from "./compoments/screens/Profile";
import CreatePost from "./compoments/screens/CreatePost";
import { reducer, initialState } from "../reducers/userReducer";
import UserProfile from "./compoments/screens/UserProfile";
import SubscribesUserPosts from "./compoments/screens/SubscribesUserPosts";
import Reset from "./compoments/screens/Reset";
import NewPassword from "./compoments/screens/NewPassword";
export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // If user close application without logout to state will be null that why we have to use dispatch to update state
      dispatch({ type: "USER", payload: user });
    } else {
      if (!navigate || !location.pathname.startsWith("/resetpassword")) {
        // navigate("/login");
      }    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/createpost" element={<CreatePost />}></Route>
      <Route path="/profile/:userid" element={<UserProfile />}></Route>
      <Route path="/myfollowingpost" element={<SubscribesUserPosts />}></Route>
      <Route path="/resetpassword" element={<Reset />}></Route>
      <Route path="/resetpassword/:token" element={<NewPassword />}></Route>
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
