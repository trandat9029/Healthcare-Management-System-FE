import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal,ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalUsers extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }
    }

    componentDidMount() {
    }

    toggle = () =>{
        this.props.toggleUserModal();
    }

    handleOnChangeInput = (event, id) =>{
        // bad code
        // this.state[id] = event.target.value;
        // this.setState({
        //     ...this.state
        // });

        //good code
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });   
    }

    checkValidateInput = () =>{
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for(let i = 0; i < arrInput.length; i++){
            console.log(this.state[arrInput[i]]);
            
            if(!this.state[arrInput[i]]){
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }

        return isValid;
    }

    handleAddNewUsers = () =>{
        let isValid = this.checkValidateInput();
        if(isValid === true){
            // call api
            this.props.createNewUser(this.state);
        }
    }

    render() {
        return (
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={() => {this.toggle()}} 
                className={'modal-user-container'}
                size='lg'
                centered={true}
            >
                <ModalHeader toggle={() => {this.toggle()}}>Create a new user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label htmlFor="">Email</label>
                            <input 
                                type="text" 
                                name="email"
                                value={this.state.email} 
                                onChange={(e) =>{this.handleOnChangeInput(e, 'email')}}
                            />
                        </div>
                        <div className='input-container'>
                            <label htmlFor="">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={this.state.password} 
                                onChange={(e) =>{this.handleOnChangeInput(e, 'password')}}
                            />
                        </div>
                        <div className='input-container'>
                            <label htmlFor="">FirstName</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={this.state.firstName}
                                onChange={(e) =>{this.handleOnChangeInput(e, 'firstName')}} 
                            />
                        </div>
                        <div className='input-container'>
                            <label htmlFor="">LastName</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={this.state.lastName}
                                onChange={(e) =>{this.handleOnChangeInput(e, 'lastName')}}
                            />
                        </div>
                        <div className='input-container max-width-input'>
                            <label htmlFor="">Address</label>
                            <input 
                                type="text" 
                                name="address" 
                                value={this.state.address}
                                onChange={(e) =>{this.handleOnChangeInput(e, 'address')}}
                            />
                        </div>
                    </div>    
                </ModalBody>
                <ModalFooter>
                    <Button 
                        color='primary' 
                        className='px-3' 
                        onClick={() =>{this.handleAddNewUsers()}}
                    >Add new</Button>
                    <Button color='secondary' className='px-3' onClick={() =>{this.toggle()}}>Close</Button>
                </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUsers);
