import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';

import * as actions from "../../../store/actions"


class TableManageUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            userRedux: [],
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
        
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.listUsers !== this.props.listUsers){
            this.setState({
                userRedux: this.props.listUsers,
            })
        }
    }   

    handleDeleteUser = (user) =>{
        this.props.deleteUserRedux(user.id);
    }

    handleEditUser = (user) =>{
        this.props.handleEditUserFormParent(user)
    }

    render() {
        let arrUsers = this.state.userRedux;
        return (
            <div className="users-container">
                <div className='title text-center'>Manage users with Onizuka</div>
                <div className='users-table mt-3 mx-1'>
                    <table>
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>firstName</th>
                                <th>LastName</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers && arrUsers.length > 0 && 
                                arrUsers.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.password}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>
                                                <button 
                                                    className='btn-edit'
                                                    onClick={() =>{this.handleEditUser(item)}}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button 
                                                    className='btn-delete'
                                                    onClick={() =>{this.handleDeleteUser(item)}}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
