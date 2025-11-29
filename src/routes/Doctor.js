import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '../containers/Header/Header';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import ManageProfile from '../containers/System/Profile/ManageProfile';
import Sidebar from '../containers/Sidebar/Sidebar';
import TableDoctorSchedule from '../containers/System/Doctor/TableDoctorSchedule';


class Doctor extends Component {
    render() {
        
        const { isLoggedIn } = this.props;
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
                            <Route path="/doctor/manage-schedule" component={TableDoctorSchedule} />
                            <Route path="/doctor/manage-patient" component={ManagePatient} />
                            <Route path="/doctor/manage-profile" component={ManageProfile} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
