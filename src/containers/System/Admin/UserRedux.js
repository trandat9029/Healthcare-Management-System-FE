import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils/constant';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './User-redux.scss';
import * as actions from '../../../store/actions';
import CommonUtils from '../../../utils/CommonUtils';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
        genderArr: [],
        positionArr: [],
        roleArr: [],
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

        action: props.actionMode || CRUD_ACTIONS.CREATE,
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();

        if (this.props.actionMode === CRUD_ACTIONS.EDIT && this.props.currentUser) {
            const user = this.props.currentUser;
            let imageBase64 = '';
            if (user.image) {
                imageBase64 = new Buffer(user.image, 'base64').toString('binary');
            }

            this.setState({
                email: user.email,
                password: 'HARDCODE',
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                gender: user.gender,
                position: user.positionId,
                role: user.roleId,
                avatar: '',
                previewImgURL: imageBase64,
                action: CRUD_ACTIONS.EDIT,
                userEditId: user.id,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            const arrGenders = this.props.genderRedux;
            this.setState((prev) => ({
                genderArr: arrGenders,
                gender:
                prev.gender ||
                (arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''),
            }));
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            const arrPositions = this.props.positionRedux;
            this.setState((prev) => ({
                positionArr: arrPositions,
                position:
                prev.position ||
                (arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''),
            }));
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            const arrRoles = this.props.roleRedux;
            this.setState((prev) => ({
                roleArr: arrRoles,
                role:
                prev.role ||
                (arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''),
            }));
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            const arrGenders = this.props.genderRedux;
            const arrPositions = this.props.positionRedux;
            const arrRoles = this.props.roleRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender:
                arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position:
                arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                previewImgURL: '',
                action: CRUD_ACTIONS.CREATE,
                userEditId: '',
            });

            if (this.props.onClose) {
                this.props.onClose();
            }
        }
    }

    handleOnChangeImage = async (event) => {
        const data = event.target.files;
        const file = data[0];
        if (file) {
            const base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64,
            });
        }
    };

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            
        });
    };

    checkValidateInput = () => {
        let isValid = true;
        const arrCheck = [
            'email',
            'password',
            'firstName',
            'lastName',
            'phoneNumber',
            'address',
        ];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    };

    OnChangeInput = (event, id) => {
        const copyState = { ...this.state };
        copyState[id] = event.target.value;

        this.setState({
            ...copyState,
        });
    };

    handleSaveUser = () => {
        const isValid = this.checkValidateInput();
        if (isValid === false) return;

        const { action } = this.state;

        if (action === CRUD_ACTIONS.CREATE) {
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
            });
        }

        if (action === CRUD_ACTIONS.EDIT) {
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
            });
        }
    };

    render() {
        if (!this.props.isOpen) return null;

        const {
            genderArr,
            positionArr,
            roleArr,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            position,
            role,
        } = this.state;

    const language = this.props.language;

    return (
        <>
            <div className="user-modal-overlay" >
                <div className="user-modal" >
                    <div className="user-modal-header">
                    <div className="title">
                        {this.state.action === CRUD_ACTIONS.EDIT
                        ? <FormattedMessage id="admin.manage-user.user-create.title-edit" />
                        : <FormattedMessage id="admin.manage-user.user-create.title-create" />}
                    </div>
                    <button className="user-modal-close" onClick={this.props.onClose}>
                        ×
                    </button>
                    </div>

                    <div className="user-redux-body">
                        <div className="container-fluid">
                            <form autoComplete="off" className='user-form'>
                                <div className="row">
                                    
                                    <div className="col-3">
                                        <label>Email</label>
                                        <input
                                            name="bh_email"
                                            autoComplete="off"
                                            className="form-control"
                                            type="email"
                                            value={email}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'email')
                                            }
                                            disabled={
                                            this.state.action === CRUD_ACTIONS.EDIT ? true : false
                                            }
                                        />
                                    </div>

                                    <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.password" /></label>
                                        <input
                                            name="bh_password"
                                            autoComplete="new-password"
                                            className="form-control"
                                            type="password"
                                            value={password}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'password')
                                            }
                                            disabled={
                                            this.state.action === CRUD_ACTIONS.EDIT ? true : false
                                            }
                                        />
                                    </div>

                                    <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.firstName" /></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={firstName}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'firstName')
                                            }
                                        />
                                    </div>

                                    <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.lastName" /></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={lastName}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'lastName')
                                            }
                                        />
                                    </div>

                                    <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.phone" /></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'phoneNumber')
                                            }
                                        />
                                    </div>

                                    <div className="col-9">
                                        <label><FormattedMessage id="admin.manage-user.user-create.address" /></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={address}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'address')
                                            }
                                        />
                                    </div>

                                    <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.gender" /></label>
                                        <select
                                            className="form-control"
                                            value={gender}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'gender')
                                            }
                                        >
                                            {genderArr &&
                                            genderArr.length > 0 &&
                                            genderArr.map((item, index) => (
                                                <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI
                                                    ? item.valueVi
                                                    : item.valueEn}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.position" /></label>
                                        <select
                                            className="form-control"
                                            value={position}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'position')
                                            }
                                        >
                                            {positionArr &&
                                            positionArr.length > 0 &&
                                            positionArr.map((item, index) => (
                                                <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI
                                                    ? item.valueVi
                                                    : item.valueEn}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-3">
                                    <label><FormattedMessage id="admin.manage-user.user-create.role" /></label>
                                        <select
                                            className="form-control"
                                            value={role}
                                            onChange={(event) =>
                                            this.OnChangeInput(event, 'role')
                                            }
                                        >
                                            {roleArr &&
                                            roleArr.length > 0 &&
                                            roleArr.map((item, index) => (
                                                <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI
                                                    ? item.valueVi
                                                    : item.valueEn}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.avatar" /></label>
                                        <div className="preview-img-container">
                                            <input
                                                id="previewImg"
                                                className="form-control"
                                                type="file"
                                                hidden
                                                onChange={(event) =>
                                                    this.handleOnChangeImage(event)
                                                }
                                            />
                                            <label
                                                className="label-upload"
                                                htmlFor="previewImg"
                                            >
                                                <FormattedMessage id="admin.manage-user.user-create.import-file" /> <i className="fas fa-upload"></i>
                                            </label>
                                            <div
                                                className="preview-image"
                                                style={{
                                                    backgroundImage: `url(${this.state.previewImgURL})`, width: '120px', height: '120px'
                                                }}
                                                onClick={() => this.openPreviewImage()}
                                            ></div>
                                        </div>
                                    </div> */}

                                    <div className="col-12 my-3">
                                        <button
                                            className={
                                            this.state.action === CRUD_ACTIONS.EDIT
                                                ? 'btn btn-warning'
                                                : 'btn btn-primary'
                                            }
                                            onClick={this.handleSaveUser}
                                        >
                                            {this.state.action === CRUD_ACTIONS.EDIT
                                            ? <FormattedMessage id="admin.manage-user.user-create.update" />
                                            : <FormattedMessage id="admin.manage-user.user-create.save" />}
                                        </button>
                                    </div>
                                </div>
                                                                    <div className="col-3">
                                        <label><FormattedMessage id="admin.manage-user.user-create.avatar" /></label>
                                        <div className="preview-img-container">
                                            <input
                                                id="previewImg"
                                                className="form-control"
                                                type="file"
                                                hidden
                                                onChange={(event) =>
                                                    this.handleOnChangeImage(event)
                                                }
                                            />
                                            <label
                                                className="label-upload"
                                                htmlFor="previewImg"
                                            >
                                                <FormattedMessage id="admin.manage-user.user-create.import-file" /> <i className="fas fa-upload"></i>
                                            </label>
                                            <div
                                                className="preview-image"
                                                style={{
                                                    backgroundImage: `url(${this.state.previewImgURL})`, width: '120px', height: '120px'
                                                }}
                                                onClick={() => this.openPreviewImage()}
                                            ></div>
                                        </div>
                                    </div>
                            </form>
                        </div>
                    </div>

                    {this.state.isOpen === true && (
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() =>
                            this.setState({ isOpen: false })
                            }
                        />
                    )}
                </div>
            </div>
        </>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    isLoadingGender: state.admin.isLoadingGender,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    editUserRedux: (data) => dispatch(actions.editUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
