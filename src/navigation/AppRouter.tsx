import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={App}></Route>
        <Route path="/signup" Component={Signup}></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/home" Component={Home}></Route>
      </Routes>
    </Router>
  );
}
