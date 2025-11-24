import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';

import * as actions from "../../../store/actions"

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { saveDetailDoctor } from '../../../services/userService';
import { getDetailInfoDoctorService } from '../../../services/userService';

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {

    constructor(props){
        super(props);
        this.state = {
            //save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            //save to doctor_info table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',

        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.getRequiredDoctorInfoRedux();
        
    }

    buildDataInputSelect = (inputData, type) =>{
        let result = [];
        let { language } = this.props;
        if(inputData && inputData.length > 0){
            if(type === 'USERS'){
                inputData.map((item, index) =>{
                    let object = {}; 
                    let labelEn = `${item.lastName} ${item.firstName}`;
                    let labelVi = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if(type === 'PRICE'){
                inputData.map((item, index) =>{
                    let object = {}; 
                    let labelEn = `${item.valueEn} USD`;
                    let labelVi = `${item.valueVi} VND`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if(type === 'PAYMENT' || type === 'PROVINCE'){
                inputData.map((item, index) =>{
                    let object = {}; 
                    let labelEn = `${item.valueEn}`;
                    let labelVi = `${item.valueVi}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if(type === 'SPECIALTY'){
                inputData.map((item, index) =>{
                    let object = {}; 
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if(type === 'CLINIC'){
                inputData.map((item, index) =>{
                    let object = {}; 
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }
        }

        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors){
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect,
            })
        }

        if(prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo){
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            })
            
        }

        if(prevProps.language !== this.props.language){
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');

            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfo;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
    }   

    handleEditorChange = ({html, text}) =>{
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    }

    handleSaveContentMarkdown = () =>{
            
        let { hasOldData } = this.state;
    
        this.props.saveDetailDoctorRedux({
            //save to markdown table
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            //save to doctor_info table
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty.value  
        })
    }

    handleChangeSelect = async (selectedOption) =>{
        this.setState({
            selectedOption
        });
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

        let res = await getDetailInfoDoctorService(selectedOption.value);
        if(res && res.errCode === 0 && res.data && res.data.Markdown){
            let markdown = res.data.Markdown;

            let nameClinic = '', 
                addressClinic = '', 
                note = '', 
                priceId = '', 
                paymentId = '', 
                provinceId = '',
                specialtyId = '',
                clinicId = '',
                selectedPrice  = '',
                selectedPayment = '',
                selectedProvince = '',
                selectedSpecialty ='',
                selectedClinic = '';

            if(res.data.Doctor_info){
                priceId = res.data.Doctor_info.priceId;
                paymentId = res.data.Doctor_info.paymentId;
                provinceId = res.data.Doctor_info.provinceId;
                nameClinic = res.data.Doctor_info.nameClinic;
                addressClinic = res.data.Doctor_info.addressClinic;
                note = res.data.Doctor_info.note;
                specialtyId = res.data.Doctor_info.specialtyId;
                clinicId = res.data.Doctor_info.clinicId

                
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
                selectedSpecialty = listSpecialty.find(item =>{
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item =>{
                    return item && item.value === clinicId
                })
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                nameClinic: nameClinic,
                addressClinic: addressClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,

            })
        }else{
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                nameClinic: '',
                addressClinic: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
            })
        }
        
    }

    handleChangeSelectDoctorInfo = async (selectedOption, name) =>{
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;

        this.setState({
            ...stateCopy
        })
        
    }

    handleOnChangeText = (event, id) =>{
        let stateCopy =  { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    render() {
        let { hasOldData, listSpecialty } = this.state;
        
        
        return (
            <>
                <div className="manage-doctor-container">
                    <div className='manage-doctor-title'><FormattedMessage id="admin.manage-doctor.title" /></div>

                    <div className='more-info'>
                        <div className='content-left form-group'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.select-doctor" /></label> 
                            <Select  
                                value={this.state.selectedOption}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}

                            />
                        </div>
                        <div className='content-right'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.intro" /></label>
                            <textarea className='form-control' 
                                onChange={(event) => this.handleOnChangeText(event, 'description')}
                                value={this.state.description}
                            >

                            </textarea>
                        </div>
                    </div>

                    <div className='more-info-extra mb-3 row'>
                        <div className='col-4 form-group mb-3'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.price" /></label>
                            <Select  
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeSelectDoctorInfo}
                                options={this.state.listPrice}
                                placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                                name="selectedPrice"
                            />
                        </div>
                        <div className='col-4 form-group mb-3'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.payment" /></label>
                            <Select  
                                value={this.state.selectedPayment}
                                onChange={this.handleChangeSelectDoctorInfo}
                                options={this.state.listPayment}
                                placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                                name="selectedPayment"
                            />
                        </div>
                        <div className='col-4 form-group mb-3'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.province" /></label>
                            <Select  
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectDoctorInfo}
                                options={this.state.listProvince}
                                placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                                name="selectedProvince"
                            />
                        </div>

                        <div className='col-4 form-group mb-3'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.name-clinic" /></label>
                            <input 
                                className='form-control' 
                                type="text"
                                onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                                value={this.state.nameClinic} 
                            />
                        </div>
                        <div className='col-4 form-group mb-3'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.address-clinic" /></label>
                            <input 
                                className='form-control' 
                                type="text"
                                onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                                value={this.state.addressClinic} 
                            />
                        </div>
                        <div className='col-4 form-group mb-3'>
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.note" /></label>
                            <input 
                                className='form-control' 
                                type="text" 
                                onChange={(event) => this.handleOnChangeText(event, 'note')}
                                value={this.state.note}
                            />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <div className="col-4 form-group">
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                            <Select  
                                value={this.state.selectedSpecialty}
                                options={this.state.listSpecialty}
                                placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                                onChange={this.handleChangeSelectDoctorInfo}
                                name="selectedSpecialty"

                            />
                        </div>
                        <div className="col-4 form-group">
                            <label htmlFor=""><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                            <Select  
                                value={this.state.selectedClinic}
                                options={this.state.listClinic}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                                onChange={this.handleChangeSelectDoctorInfo}
                                name="selectedClinic"

                            />
                        </div>

                    </div>

                    <div className='manage-doctor-editor'>
                        <MdEditor 
                            style={{ height: '400px' }} 
                            renderHTML={text => mdParser.render(text)} 
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />
                    </div>

                    <button 
                        className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                        onClick={() => this.handleSaveContentMarkdown()}
                    >
                        {hasOldData === true ? 
                            <span><FormattedMessage id="admin.manage-doctor.save" /></span>
                            :
                            <span><FormattedMessage id="admin.manage-doctor.add" /></span>
                        }
                    </button>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveDetailDoctorRedux : (data) => dispatch(actions.saveDetailDoctor(data)),
        fetchAllDoctorsRedux : () => dispatch(actions.fetchAllDoctor()),
        getRequiredDoctorInfoRedux : () => dispatch(actions.getRequiredDoctorInfo())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
