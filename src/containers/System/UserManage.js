import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './userManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUsers from './ModalUsers';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props){
        super(props);
        this.state = {
            arrUsers : [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {

            },
        }
    }

    async componentDidMount() {
        await this.getAllUsersFormReact(); 
    }

    getAllUsersFormReact = async () =>{
        let response = await getAllUsers('ALL');
        if(response && response.errCode === 0){
            this.setState({
                arrUsers: response.users,
                
            }); 
        }
    }

    handleAddNewUser = () =>{
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () =>{
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleUserEditModal = () =>{
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    createNewUser = async (data) =>{
        try {
            let response = await createNewUserService(data);
            if(response && response.errCode !== 0){
                alert(response.errMessage);
            }else{
                await this.getAllUsersFormReact();
                this.setState({
                    isOpenModalUser: false,
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }     
        } catch (error) {
            console.log(error);
            
        }
    }

    handleDeleteUser = async (user) =>{
        try {
            let res = await deleteUserService(user.id);
            if(res && res.errCode === 0){
                await this.getAllUsersFormReact();
            }else{
                alert(res.errMessage);
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    handleEditUser = (user) =>{
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })
        
    }

    doEditUser = async (user) =>{
        try {
            let res =  await editUserService(user);
            if(res && res.errCode === 0){
                this.setState({
                    isOpenModalEditUser: false,
                })
                await this.getAllUsersFormReact();
            }else{
                alert(res.errMessage);
            }
        } catch (error) {
            console.log(error);
            
        }        
    }

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <div className='title text-center'>Manage users with Onizuka</div>
                <ModalUsers 
                    isOpen={this.state.isOpenModalUser}
                    toggleUserModal={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser && 
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleUserModal={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                
                <div className='mx-1'>
                    <button 
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fa-solid fa-plus"></i> Add new user
                    </button>
                </div>
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
                        
                           {arrUsers.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
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
                            })} 
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
