import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import _ from 'lodash';
import * as actions from '../../../store/actions'
import { CommonUtils, LANGUAGES } from '../.././../utils';
import { toast } from 'react-toastify';
import moment from 'moment';

class RemedyModal extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
        }
    }

    async componentDidMount(){
        if(this.props.dataModal){
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.dataModal !== this.props.dataModal){
             this.setState({
                email: this.props.dataModal.email,
             })   
        }
    }

    handleOnchangeEmail = (event) =>{
        this.setState({
            email: event.target.value
        })
    }
    
    handleOnChangeImage = async (event) =>{
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })     
        }
    }
    
    handleSendRemedy = () =>{
        this.props.sendRemedy(this.state)
    }
 
    render() {
        let { language, isOpenModal, closeRemedyModal, sendRemedy, dataModal } = this.props;
        

        return (
            <>
                <Modal 
                    isOpen={isOpenModal}  
                    className='booking-modal-container' 
                    size='md' 
                    centered
                    // backdrop={true}
                >
                    {/* <ModalHeader toggle={closeRemedyModal}></ModalHeader> */}
                    <div className='modal-header'>
                        <h5 className='modal-title'>Gửi hóa đơn khám bệnh thành công</h5>
                        <button className='close' type='button' aria-label='Close' onClick={closeRemedyModal}>
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6 form-group">              
                                <label htmlFor="">Email bệnh nhân</label>
                                <input 
                                    className="form-control" 
                                    type="email" 
                                    value={this.state.email} 
                                     onChange={(event) => this.handleOnchangeEmail(event)}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label htmlFor="">Chọn file hóa đơn</label>
                                <input 
                                    className="form-control" 
                                    type="file" 
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={() => this.handleSendRemedy()}>Send</Button>
                        <Button color='secondary' onClick={closeRemedyModal}>Cancel</Button>
                    </ModalFooter>           
                </Modal>
            </>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // fetchGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
