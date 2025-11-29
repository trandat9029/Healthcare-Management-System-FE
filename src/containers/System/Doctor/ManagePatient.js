import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import {
  getAllPatientForDoctorService,
  postSendRemedy,
  getAllCodeService,
} from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import Select from 'react-select';

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf('day').valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,

      // filter UI
      listTime: [],
      selectedTime: null,
      listStatus: [],
      selectedStatus: null,
      keyword: '',
    };
  }

  async componentDidMount() {
    await this.fetchFilterOptions();
    this.getDataPatient();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      await this.fetchFilterOptions();
    }
  }

  // gọi Allcode để build option cho filter
  fetchFilterOptions = async () => {
    try {
      const [resTime, resStatus] = await Promise.all([
        getAllCodeService('TIME'),
        getAllCodeService('STATUS'),
      ]);

      const listTime =
        resTime && resTime.errCode === 0
          ? this.buildOptionsFromAllcode(resTime.data)
          : [];

      const listStatus =
        resStatus && resStatus.errCode === 0
          ? this.buildOptionsFromAllcode(resStatus.data)
          : [];

      this.setState({
        listTime,
        listStatus,
      });
    } catch (error) {
      console.log('fetchFilterOptions error:', error);
    }
  };

  buildOptionsFromAllcode = (data) => {
    const { language } = this.props;
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      value: item.keyMap,
      label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
    }));
  };

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();

    let res = await getAllPatientForDoctorService({
      doctorId: user.id,
      date: formatedDate,
      // tạm thời chưa filter theo time, status, keyword ở BE
    });

    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleChangeTime = (selectedTime) => {
    this.setState({ selectedTime });
    // sau này có thể gọi lại getDataPatient với filter timeType
  };

  handleChangeStatus = (selectedStatus) => {
    this.setState({ selectedStatus });
    // sau này có thể gọi lại getDataPatient với filter statusId
  };

  handleChangeKeyword = (e) => {
    this.setState({ keyword: e.target.value });
    // hiện tại chỉ lưu keyword ở UI
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  handleResetFilters = async () => {
  this.setState(
    {
      selectedTime: null,
      selectedStatus: null,
      keyword: '',
      currentDate: moment(new Date()).startOf('day').valueOf(),
    },
    async () => {
      await this.getDataPatient(); // load lại danh sách
    }
  );
}

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });

    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });

    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success('Gửi hóa đơn thành công');
      await this.getDataPatient();
      this.closeRemedyModal();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error('Gửi hóa đơn thất bại');
    }
  };

  render() {
    let { language } = this.props;
    let {
      dataPatient,
      isOpenRemedyModal,
      dataModal,
      listTime,
      selectedTime,
      listStatus,
      selectedStatus,
      keyword,
    } = this.state;

    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        >
          <div className="manage-patient-container">
            <div className="manage-patient-title">
              Quản lý bệnh nhân khám bệnh
            </div>

            <div className="manage-patient-body row">
              <div className="col-4 mb-3 form-group">
                <label>Chọn ngày khám</label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>

              {/* thanh filter mới */}
              <div className="col-12 filter-bar">
                <div className="filter-item">
                  <label className="filter-label">Thời gian khám</label>
                  <Select
                    value={selectedTime}
                    onChange={this.handleChangeTime}
                    options={listTime}
                    name="selectedTime"
                    placeholder="Chọn khoảng thời gian"
                    classNamePrefix="mp-select"
                  />
                </div>

                <div className="filter-item">
                  <label className="filter-label">Trạng thái</label>
                  <Select
                    value={selectedStatus}
                    onChange={this.handleChangeStatus}
                    options={listStatus}
                    name="selectedStatus"
                    placeholder="Chọn trạng thái"
                    classNamePrefix="mp-select"
                  />
                </div>

                <div className="filter-item filter-item-search">
                  <label className="filter-label">Tìm theo tên bệnh nhân</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên bệnh nhân"
                    value={keyword}
                    onChange={this.handleChangeKeyword}
                  />
                </div>
                <div className="filter-item">
                    <label className="filter-label">&nbsp;</label>
                    <button
                        type="button"
                        className="btn-reset-filters"
                        onClick={this.handleResetFilters}
                    >
                        Xóa bộ lọc
                    </button>
                </div>

              </div>

              <div className="col-12 table-manage-patient">
                <table>
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th>Họ và tên</th>
                      <th>Giới tính</th>
                      <th>Địa chỉ</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let gender =
                          language === LANGUAGES.VI
                            ? item.patientData.genderData.valueVi
                            : item.patientData.genderData.valueEn;

                        let time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient.valueEn;

                        let status =
                          language === LANGUAGES.VI
                            ? item.statusData.valueVi
                            : item.statusData.valueEn;

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{item.patientData.firstName}</td>
                            <td>{gender}</td>
                            <td>{item.patientData.address}</td>
                            <td>{status}</td>
                            <td>
                              <button
                                className="mp-btn-confirm"
                                onClick={() => {
                                  this.handleBtnConfirm(item);
                                }}
                              >
                                Xác nhận
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>
                          no data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
