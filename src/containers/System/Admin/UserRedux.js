import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils/constant';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './User-redux.scss'
import TableManageUser from './TableManageUser';

import * as actions from "../../../store/actions"
import CommonUtils from '../../../utils/CommonUtils';

class UserRedux extends Component {

    constructor(props){
        super(props);
        this.state = {
            genderArr : [],
            positionArr : [],
            roleArr : [],
            previewImgURL: '',
            isOpen: false,

            userEditId: '',

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();

        // try {
        //     let res = await getAllCodeService('gender');
        //     if(res && res.errCode === 0 ){
        //         this.setState({
        //             genderArr : res.data
        //         })
        //     }
        //     console.log("check res: ", res);
             
        // } catch (error) {
        //     console.log(error);
        // }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.genderRedux !== this.props.genderRedux){
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr : arrGenders,
                gender : arrGenders && arrGenders.length > 0 ? arrGenders[0].key : ''
            })
        }
        if(prevProps.positionRedux !== this.props.positionRedux){
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr : arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : ''

            })
        }
        if(prevProps.roleRedux !== this.props.roleRedux){
            let arrRoles = this.props.roleRedux; 
            this.setState({
                roleArr : arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : ''
            })
        }
        if(prevProps.listUsers !== this.props.listUsers){
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender : arrGenders && arrGenders.length > 0 ? arrGenders[0].key : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: '',
            })
        }
    }

    handleOnChangeImage = async (event) =>{
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })     
        }
    }

    openPreviewImage = () =>{
        if(!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    checkValidateInput = () =>{
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address']
        for(let i =0; i < arrCheck.length; i++){
            if(!this.state[arrCheck[i]]){
                isValid = false;
                alert('This input is required: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }

    OnChangeInput = (event, id) =>{
        let copyState = { ...this.state}
        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        })
    }

    handleSaveUser = () =>{
        let isValid = this.checkValidateInput();
        if(isValid === false) return;

        let {action} = this.state;

        if(action === CRUD_ACTIONS.CREATE){
            //fire redux action create
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                avatar: this.state.avatar,
                roleId: this.state.role,
                positionId: this.state.position,            
            })
        }
        if(action === CRUD_ACTIONS.EDIT){
            //fire redux action edit
            this.props.editUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                avatar: this.state.avatar,
                roleId: this.state.role,
                positionId: this.state.position, 

            })
        }
    }

    handleEditUserFormParent = (user) =>{
        let imageBase64 = '';
        if(user.image){
            // const imageBuffer = Buffer.from(JSON.stringify(user.image));
            imageBase64 = new Buffer(user.image, 'base64').toString('binary')
            
        }
        
        this.setState({
                email: user.email,
                password: 'HARDCODE',
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                gender : user.gender,
                position: user.positionId,
                role: user.roleId,
                avatar: '',
                previewImgURL: imageBase64,
                action: CRUD_ACTIONS.EDIT,
                userEditId: user.id
            },() => {
                console.log('check prevImgUrl', this.state);
                
            })
        
    }

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isLoading = this.props.isLoadingGender;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        let {email, password, firstName, lastName, phoneNumber, address, gender, position, role, avatar} = this.state

        return (
            <>
                <div className='user-redux-container'>
                    <div className="title" >User redux</div>
                    
                    <div className='user-redux-body'>
                        <div className='container'>
                            <div className="row">
                                <div className="col-12 my-3"><FormattedMessage id="manage-user.add" /></div>
                                <div className='col-12'>{isLoading === true ? "Loading" : ""}</div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.email" /></label>
                                    <input className='form-control' type="email" 
                                        value={email}
                                        onChange={(event) => {this.OnChangeInput(event, 'email')}}
                                        disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    />
                                </div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.password" /></label>
                                    <input className='form-control' type="password" 
                                        onChange={(event) => {this.OnChangeInput(event, 'password')}}
                                        value={password}
                                        disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    />
                                </div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.first-name" /></label>
                                    <input className='form-control' type="text" 
                                        onChange={(event) => {this.OnChangeInput(event, 'firstName')}}
                                        value={firstName}
                                    />
                                </div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.last-name" /></label>
                                    <input className='form-control' type="text" 
                                        onChange={(event) => {this.OnChangeInput(event, 'lastName')}}
                                        value={lastName}
                                    />
                                </div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.phone-number" /></label>
                                    <input className='form-control' type="text" 
                                        onChange={(event) => {this.OnChangeInput(event, 'phoneNumber')}}
                                        value={phoneNumber}
                                    />
                                </div>
                                <div className="col-9">
                                    <label htmlFor=""><FormattedMessage id="manage-user.address" /></label>
                                    <input className='form-control' type="text" 
                                        onChange={(event) => {this.OnChangeInput(event, 'address')}}
                                        value={address}
                                    />
                                </div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.gender" /></label>
                                    <select className='form-control'
                                        value={gender}
                                        onChange={(event) => {this.OnChangeInput(event, 'gender')}}
                                    >
                                        {genders && genders.length > 0 && 
                                        genders.map((item, index) =>{
                                            return (
                                                <option key={index} value={item.key}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.position" /></label>
                                    <select className='form-control'
                                        value={position}
                                        onChange={(event) => {this.OnChangeInput(event, 'position')}}
                                    >
                                        {positions && positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label htmlFor=""><FormattedMessage id="manage-user.role" /></label>
                                    <select className='form-control'
                                        value={role}
                                        onChange={(event) => {this.OnChangeInput(event, 'role')}}
                                    >
                                        {roles && roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label htmlFor="">Image</label>
                                    <div className='preview-img-container'>
                                        <input id='previewImg' className='form-control' type="file" hidden 
                                            onChange={(event => this.handleOnChangeImage(event))}
                                        />
                                        <label className='label-upload' htmlFor="previewImg">Tải ảnh<i className='fas fa-upload'></i></label>
                                        <div className="preview-image"
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                            onClick={() => this.openPreviewImage()}
                                        ></div>
                                    </div>
                                </div>
                                <div className="col-12 my-3">
                                    <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : 'btn btn-primary'}
                                        onClick={() => this.handleSaveUser()}
                                    >
                                        {this.state.action === CRUD_ACTIONS.EDIT ? 
                                            <FormattedMessage id="manage-user.edit" />
                                        :
                                            <FormattedMessage id="manage-user.save" />    
                                        }
                                        
                                    </button>
                                </div> 
                                
                                <div className='col-12 mb-5'>
                                    <TableManageUser
                                        handleEditUserFormParent={this.handleEditUserFormParent}
                                        action = {this.state.action}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {this.state.isOpen === true && 
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    }
                </div>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) =>dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data))
        
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) =>dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
