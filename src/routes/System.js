import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageHandbook from '../containers/System/Handbook/ManageHandbook';
import './System.scss';
import Sidebar from '../containers/Sidebar/Sidebar';
import Dashboard from '../containers/System/Dashboard/Dashboard';
import Schedule from '../containers/System/Schedule/Schedule';
import ManageProfile from '../containers/System/Profile/ManageProfile';
import ManageBooking from '../containers/System/Booking/ManageBooking';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <div className="system-layout">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>

                <div className="system-wrapper">
                    <div className="system-header">
                        {isLoggedIn && <Header />}
                    </div>

                    <div className="system-content">
                        <div className="system-content-inner">
                            <Switch>
                                <Route path="/system/dashboard" component={Dashboard} />
                                <Route path="/system/user-manage" component={UserManage} />
                                <Route path="/system/user-redux" component={UserRedux} />
                                <Route path="/system/manage-doctor" component={ManageDoctor} />
                                <Route path="/system/manage-specialty" component={ManageSpecialty} />
                                <Route path="/system/manage-clinic" component={ManageClinic} />
                                <Route path="/system/manage-handbook" component={ManageHandbook} />
                                <Route path="/system/manage-schedule" component={Schedule} />
                                <Route path="/system/manage-booking" component={ManageBooking} />
                                <Route path="/system/manage-profile" component={ManageProfile} />
                                <Route component={() => <Redirect to={systemMenuPath} />} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
