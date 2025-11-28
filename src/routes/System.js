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
import TableManageUser from '../containers/System/Admin/TableManageUser';
import TableManageDoctor from '../containers/System/Admin/TableManageDoctor';
import TableManageSpecialty from '../containers/System/Specialty/TableManageSpecialty';
import TableManageClinic from '../containers/System/Clinic/TableManageClinic';
import TableManageHandbook from '../containers/System/Handbook/TableManageHandbook';

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
                                <Route path="/system/manage-user" component={TableManageUser} />
                                <Route path="/system/manage-doctor" component={TableManageDoctor} />
                                <Route path="/system/save-doctor" component={ManageDoctor} />
                                <Route path="/system/manage-specialty" component={TableManageSpecialty} />
                                <Route path="/system/create-specialty" component={ManageSpecialty} />
                                <Route path="/system/manage-clinic" component={TableManageClinic} />
                                <Route path="/system/create-clinic" component={ManageClinic} />
                                <Route path="/system/manage-handbook" component={TableManageHandbook} />
                                <Route path="/system/create-handbook" component={ManageHandbook} />
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
