import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//components for admin
import Dashboard from "./components/admin/Dashboard";
import AddStudent from "./components/admin/Pages/AddStudent";
import ApproveCapstone from "./components/admin/Pages/ApproveCapstone";
// import ViewStudent2 from "./components/admin/Pages/ViewStudent2";
import ViewStudent from "./components/admin/Pages/ViewStudent";
import ViewCapstone from "./components/admin/Pages/ViewCapstone";
import AdminRegister from "./components/admin/Register/AdminRegister";
import AdminLogin from "./components/admin/Login/AdminLogin";
import ResearchInchargeID from "./components/admin/Pages/ResearchInchargeID";
import PendingResearch from "./components/admin/Pages/PendingResearch";

//components for users
import Portal from "./components/users/Portal";
import UserLogin from "./components/users/Login/UserLogin";
import UserRegister from "./components/users/Register/UserRegister";
import ResearchDetails from "./components/users/Pages/ResearchDetails";

//components for research incharge
import Login_ri from "./components/research-incharge/Login_ri";
import Register_ri from "./components/research-incharge/Register_ri";
import Dashboard_ri from "./components/research-incharge/Dashboard_ri";

function App() {
  //auth for admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [researchInchargeInfo, setResearchInchargeInfo] = useState([]);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [isAuthenticatedri, setIsAuthenticatedri] = useState(false);
  // const [pendingResearch, setPendingResearch] = useState([]);
  // const [pendingResearchRefresh, setPendingResearchRefresh] = useState(false);
  async function isAuth() {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/auth/is-verify",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();
      data === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.meassage);
    }
  }

  async function isAuthUser() {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/auth/is-verify",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();
      data === true
        ? setIsAuthenticatedUser(true)
        : setIsAuthenticatedUser(false);
      if (localStorage.token && response.status === 403) {
        localStorage.clear();
      }
    } catch (err) {
      console.error(err.meassage);
    }
  }

  //  setauth for research inchaarge

  async function isAuthri() {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/auth/is-verify",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();
      data === true ? setIsAuthenticatedri(true) : setIsAuthenticatedri(false);

      if (localStorage.token && response.status === 403) {
        localStorage.clear();
      }
    } catch (err) {
      console.error(err.meassage);
    }
  }

  async function getName() {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/user/ri",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setResearchInchargeInfo(data);
        console.log(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  //auth for Admin
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  //auth for Users
  const setAuthUser = (boolean) => {
    setIsAuthenticatedUser(boolean);
  };

  //auth for Research Incharge
  const setAuthri = (boolean) => {
    setIsAuthenticatedri(boolean);
  };

  useEffect(() => {
    isAuth();
    isAuthUser();
    isAuthri();
    // getPendingResearch();
    getName();
  }, []);

  return (
    <>
      <div>
        <Router>
          <>
            <Switch>
              {/* Admin Side*/}
              <Route exact path="/Admin-Login">
                {!isAuthenticated ? (
                  <AdminLogin setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Dashboard" />
                )}
              </Route>

              <Route exact path="/Admin-Register">
                {!isAuthenticated ? (
                  <AdminRegister setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              <Route exact path="/Admin-Dashboard">
                {isAuthenticated ? (
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              <Route exact path="/AddStudent">
                {isAuthenticated ? (
                  <AddStudent setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              <Route exact path="/ViewStudents">
                {isAuthenticated ? (
                  <ViewStudent setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              <Route exact path="/AddCapstone">
                {isAuthenticated ? (
                  <ApproveCapstone setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              <Route exact path="/ViewCapstone">
                {isAuthenticated ? (
                  <ViewCapstone setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              <Route exact path="/ResearchIncharge">
                {isAuthenticated ? (
                  <ResearchInchargeID setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              <Route exact path="/PendingResearch">
                {isAuthenticated ? (
                  <PendingResearch setAuth={setAuth} />
                ) : (
                  <Redirect to="/Admin-Login" />
                )}
              </Route>

              {/* User Side*/}

              <Route exact path="/User-Login">
                {!isAuthenticatedUser ? (
                  <UserLogin setAuthUser={setAuthUser} />
                ) : (
                  <Redirect to="/Portal" />
                )}
              </Route>

              <Route exact path="/User-Register">
                <UserRegister />
              </Route>

              <Route exact path="/Portal">
                {isAuthenticatedUser ? (
                  <Portal setAuthUser={setAuthUser} />
                ) : (
                  <Redirect to="/User-Login" />
                )}
              </Route>

              <Route path="/student/research/:id">
                <ResearchDetails setAuthUser={setAuthUser} />
              </Route>

              {/* Research Incharge Side*/}

              <Route exact path="/ri/login">
                {!isAuthenticatedri ? (
                  <Login_ri setIsAuthenticatedri={setAuthri} />
                ) : (
                  <Redirect to="/ri/dashboard" />
                )}
              </Route>

              <Route exact path="/ri/register">
                {!isAuthenticatedri ? (
                  <Register_ri setIsAuthenticatedri={setAuthri} />
                ) : (
                  <Redirect to="/ri/login" />
                )}
              </Route>

              <Route exact path="/ri/dashboard">
                {isAuthenticatedri ? (
                  <Dashboard_ri setIsAuthenticatedri={setAuthri} />
                ) : (
                  <Redirect to="/ri/login" />
                )}
              </Route>
            </Switch>
          </>
        </Router>

        <ToastContainer theme="light" autoClose={2500} />
      </div>
    </>
  );
}

export default App;
