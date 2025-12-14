import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";

import {
  userIsNotAuthenticated,
  userIsAdmin,
  userIsDoctor,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/Home";
import Login from "./Auth/Login";
import System from "../routes/System";

import HomePage from "./HomePage/HomePage";
import CustomScrollbars from "../components/CustomScrollbars";

import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import Doctor from "../routes/Doctor";
import VerifyEmail from "./Patient/VerifyEmail";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
import Specialties from "./Patient/Specialty/Specialties";
import Clinics from "./Patient/Clinic/Clinics";
import Doctors from "./Patient/Doctor/Doctors";
import Handbooks from "./Patient/Handbook/Handbooks";

import ClientLayout from "./Patient/ClientLayout";
import Histories from "./Patient/History/Histories";
import HandbookDetail from "./Patient/Handbook/HandbookDetail";
import VerifyEmailCancel from "./Patient/VerifyEmailCancel";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <div className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  {/* trang hệ thống, không dùng header bệnh nhân */}
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route path={path.SYSTEM} component={userIsAdmin(System)} />
                  <Route path={path.DOCTOR} component={userIsDoctor(Doctor)} />

                  {/* các trang public cho bệnh nhân, dùng ClientLayout */}
                  <Route
                    path={path.HOMEPAGE}
                    exact
                    render={(props) => (
                      <ClientLayout showBanner={true}>
                        <HomePage {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path="/specialties"
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <Specialties {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path="/clinics"
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <Clinics {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path="/doctors"
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <Doctors {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path="/handbooks"
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <Handbooks {...props} />
                      </ClientLayout>
                    )}
                  />
                  <Route
                    path="/histories"
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <Histories {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path={path.DETAIL_DOCTOR}
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <DetailDoctor {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path={path.DETAIL_SPECIALTY}
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <DetailSpecialty {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path={path.DETAIL_CLINIC}
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <DetailClinic {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path={path.DETAIL_HANDBOOK}
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <HandbookDetail {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <VerifyEmail {...props} />
                      </ClientLayout>
                    )}
                  />

                  <Route
                    path={path.VERIFY_EMAIL_CANCEL_BOOKING}
                    render={(props) => (
                      <ClientLayout showBanner={false}>
                        <VerifyEmailCancel {...props} />
                      </ClientLayout>
                    )}
                  />
                </Switch>
              </CustomScrollbars>
            </div>

            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

export default connect(mapStateToProps)(App);
