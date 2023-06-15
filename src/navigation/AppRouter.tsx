import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import App from "../App";

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