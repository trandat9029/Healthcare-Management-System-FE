import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import { Modal } from 'reactstrap';

class BookingModal extends Component {
    
    constructor(props){
        super(props);
        this.state = {

        }
    }

    async componentDidMount(){
     
    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){
            
        }
    }


    showHideDetailInfo = (status) =>{

    }

    render() {
        let { language, isOpenModal, closeBookingModal, dataTime } = this.props;
        // toggle
        return (
            <>
                <Modal 
                    isOpen={isOpenModal}  
                    className='booking-modal-container' 
                    size='lg' 
                    centered 
                    // backdrop={true}
                >
                    <div className="booking-modal-content">
                        <div className='booking-modal-header'>
                            <span className='left'>Thông tin đặt lịch khám bệnh</span>
                            <span className='right'
                                onClick={closeBookingModal}
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            {/* {JSON.stringify(dataTime)} */}
                            <div className="doctor-info">

                            </div>
                            <div className='price'>
                                Giá khám 500.000VND
                            </div>
                            <div className='row'>
                                <div className="col-6 form-group my-2">
                                    <label htmlFor="">Ho ten</label>
                                    <input type="text" className='form-control' />
                                </div>
                                <div className="col-6 form-group my-2">
                                    <label htmlFor="">So dien thoai</label>
                                    <input type="text" className='form-control' />
                                </div>
                                <div className="col-6 form-group my-2">
                                    <label htmlFor="">Dia chi email</label>
                                    <input type="text" className='form-control' />
                                </div>
                                <div className="col-6 form-group my-2">
                                    <label htmlFor="">Dia chi lien he</label>
                                    <input type="text" className='form-control' />
                                </div>
                                <div className="col-12 form-group my-2">
                                    <label htmlFor="">Ly do kham</label>
                                    <input type="text" className='form-control' />
                                </div>
                                <div className="col-6 form-group my-2">
                                    <label htmlFor="">dat cho ai</label>
                                    <input type="text" className='form-control' />
                                </div>
                                <div className="col-6 form-group my-2">
                                    <label htmlFor="">gioi tinh</label>
                                    <input type="text" className='form-control' />
                                </div>
                            </div>
                            
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn btn-booking-confirm'
                                onClick={closeBookingModal}
                            >
                                Xác nhận
                            </button>
                            <button className='btn btn-booking-cancel'
                                onClick={closeBookingModal}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>                    
                </Modal>
            </>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
