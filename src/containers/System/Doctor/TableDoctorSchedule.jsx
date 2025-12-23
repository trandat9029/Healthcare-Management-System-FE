// src/containers/System/Admin/TableDoctorSchedule.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableDoctorSchedule.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant';
import { handleGetScheduleByDoctor } from '../../../services/doctorService';

import Select from 'react-select';
import { getAllCodeService } from '../../../services/userService';
import DatePicker from '../../../components/Input/DatePicker';
import ManageSchedule from './ManageSchedule';

class TableDoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
      totalSchedules: 0,
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      loading: false,

      listTime: [],
      selectedTime: null,
      selectedDate: null,

      showClinicModal: false,
    };
  }

  async componentDidMount() {
    await this.fetchTimeOptions();
    this.fetchSchedules();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      await this.fetchTimeOptions();
    }

    if (prevProps.user?.id !== this.props.user?.id && this.props.user?.id) {
      this.fetchSchedules();
    }
  }

  fetchTimeOptions = async () => {
    try {
      const res = await getAllCodeService('TIME');
      if (res && res.errCode === 0) {
        const listTime = this.buildTimeOptions(res.data || []);
        this.setState({ listTime });
      }
    } catch (error) {
      console.log('fetchTimeOptions error:', error);
    }
  };

  buildTimeOptions = (data) => {
    const { language } = this.props;
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      value: item.keyMap,
      label: language === LANGUAGES.EN ? item.valueEn : item.valueVi,
    }));
  };

  openClinicModal = () => {
    this.setState({
      showClinicModal: true,
    });
  };

  closeClinicModal = () => {
    this.setState({
      showClinicModal: false,
    });
  };

  // refresh list sau khi lưu lịch xong
  handleScheduleSaved = async () => {
    await this.fetchSchedules();
    this.closeClinicModal();
  };

  fetchSchedules = async () => {
    const { page, limit, sortBy, sortOrder, selectedTime, selectedDate } = this.state;
    const { user } = this.props;

    if (!user || !user.id) {
      console.log('Không tìm thấy doctorId từ user');
      return;
    }

    try {
      this.setState({ loading: true });

      // params base, luôn có doctorId
      const params = {
        doctorId: user.id,
        page,
        limit,
        sortBy,
        sortOrder,
      };

      // chỉ filter khi user thật sự chọn
      if (selectedTime && selectedTime.value) {
        params.timeType = selectedTime.value;
      }

      // LƯU Ý. Để "vừa vào trang load full" thì selectedDate nên là null ở state mặc định
      // khi user chọn ngày thì selectedDate mới có giá trị Date
      if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
        params.date = selectedDate.getTime();
      }

      const res = await handleGetScheduleByDoctor(params);

      const data = res && res.data ? res.data : res;
      if (data && data.errCode === 0) {
        const { schedules, total, page: resPage, limit: resLimit } = data;

        this.setState({
          schedules: schedules || [],
          totalSchedules: total || 0,
          page: resPage || page,
          limit: resLimit || limit,
        });
      } else {
        console.log('Fetch schedule failed:', data);
        this.setState({
          schedules: [],
          totalSchedules: 0,
        });
      }
    } catch (error) {
      console.log('Fetch schedule error:', error);
    } finally {
      this.setState({ loading: false });
    }
  };


  formatDate = (value, language) => {
    if (!value) return '';
    const timestamp = Number(value);
    const d = new Date(timestamp);

    if (Number.isNaN(timestamp) || isNaN(d.getTime())) {
      const d2 = new Date(value);
      if (isNaN(d2.getTime())) return '';
      return language === LANGUAGES.EN
        ? d2.toLocaleDateString('en-US')
        : d2.toLocaleDateString('vi-VN');
    }

    return language === LANGUAGES.EN
      ? d.toLocaleDateString('en-US')
      : d.toLocaleDateString('vi-VN');
  };

  handleChangePage = (type) => {
    const { page, limit, totalSchedules } = this.state;

    const totalPages = Math.ceil((totalSchedules || 0) / limit) || 1;
    let newPage = page;

    if (type === 'prev' && page > 1) {
      newPage = page - 1;
    }

    if (type === 'next' && page < totalPages) {
      newPage = page + 1;
    }

    if (newPage !== page) {
      this.setState(
        {
          page: newPage,
        },
        () => {
          this.fetchSchedules();
        }
      );
    }
  };

  handleSort = (field) => {
    const { sortBy, sortOrder } = this.state;
    let newSortOrder = 'ASC';

    if (sortBy === field && sortOrder === 'ASC') {
      newSortOrder = 'DESC';
    }

    this.setState(
      {
        sortBy: field,
        sortOrder: newSortOrder,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      }
    );
  };

  renderSortLabel = (field) => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy !== field) return null;
    return sortOrder === 'ASC' ? ' ↑' : ' ↓';
  };

  handleChangeTime = (selectedTime) => {
    this.setState(
      {
        selectedTime,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      }
    );
  };

  handleOnchangeDatePicker = (dateArr) => {
    const date = dateArr && dateArr[0] ? dateArr[0] : null;

    this.setState(
      {
        selectedDate: date,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      }
    );
  };

  handleClearFilter = () => {
    this.setState(
      { 
        selectedTime: null,
        selectedDate: null,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      }
    );
  };


  render() {
    const {
      schedules,
      page,
      limit,
      totalSchedules,
      loading,
      listTime,
      selectedTime,
      selectedDate,
      showClinicModal,
    } = this.state;
    const { language, user } = this.props;

    const arrSchedules = schedules || [];
    const totalPages = Math.ceil((totalSchedules || 0) / limit) || 1;

    return (
      <>
        <div className="d-schedules-container">
          <div className="title text-center">
            <FormattedMessage id="admin.doctor.manage-schedule.schedule-title" />
          </div>

          <div className="d-schedule-function">
            <div className="filter-schedule">
              <div className="filter-item">
                <label className="filter-label"><FormattedMessage id="admin.doctor.manage-schedule.filter-time-type" /></label>
                <Select
                  value={selectedTime}
                  onChange={this.handleChangeTime}
                  options={listTime}
                  name="selectedTime"
                  placeholder="Chọn khoảng thời gian"
                  classNamePrefix="schedule-select"
                />
              </div>
              <div className="filter-item">
                <label className="filter-label"><FormattedMessage id="admin.doctor.manage-schedule.filter-date" /></label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={selectedDate}
                />
              </div>
              <div className="d-schedule-create">
                <button
                  className="btn-clear-filter"
                  onClick={this.handleClearFilter}
                  // disabled={!selectedTime && !selectedDate}
                >
                  <FormattedMessage id="admin.filter-cancel" />
                </button>
              </div>
          </div>
          <div className="d-schedule-create">
                <button
                  className="btn-create-user"
                  onClick={this.openClinicModal}
                >
                  <FormattedMessage id="admin.doctor.manage-schedule.schedule-btn-create" />
                </button>
              </div>
            </div>

          <div className="d-schedules-table mt-3 mx-1">
            {loading && <div className="loading-overlay"><FormattedMessage id="admin.loading" /></div>}
            <table>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th onClick={() => this.handleSort('doctorId')}>
                    <FormattedMessage id="admin.doctor.manage-schedule.schedule.doctor" />{this.renderSortLabel('doctorId')}
                  </th>
                  <th onClick={() => this.handleSort('timeType')}>
                    <FormattedMessage id="admin.doctor.manage-schedule.schedule.time-type" />{this.renderSortLabel('timeType')}
                  </th>
                  <th onClick={() => this.handleSort('date')}>
                    <FormattedMessage id="admin.doctor.manage-schedule.schedule.date" />{this.renderSortLabel('date')}
                  </th>
                  <th onClick={() => this.handleSort('createdAt')}>
                    <FormattedMessage id="admin.doctor.manage-schedule.schedule.createdAt" />{this.renderSortLabel('createdAt')}
                  </th>
                </tr>

                {arrSchedules && arrSchedules.length > 0 ? (
                  arrSchedules.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>
                        {item.doctorData?.firstName}{' '}
                        {item.doctorData?.lastName}
                      </td>
                      <td>
                        {language === LANGUAGES.EN
                          ? item.timeTypeData?.valueEn
                          : item.timeTypeData?.valueVi}
                      </td>
                      <td>{this.formatDate(item.date, language)}</td>
                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : ''}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      <FormattedMessage id="admin.doctor.manage-schedule.schedule-no-found" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination mt-3 d-flex justify-content-center align-items-center">
            <button
              className="btn btn-light mx-2"
              onClick={() => this.handleChangePage('prev')}
              disabled={page <= 1}
            >
              <FormattedMessage id="admin.prev" />
            </button>
            <span>
              <FormattedMessage id="admin.page" /> {page} <FormattedMessage id="admin.of" /> {totalPages}. <FormattedMessage id="admin.total" /> {totalSchedules || 0} <FormattedMessage id="admin.doctor.manage-schedule.schedules" />
            </span>
            <button
              className="btn btn-light mx-2"
              onClick={() => this.handleChangePage('next')}
              disabled={page >= totalPages}
            >
              <FormattedMessage id="admin.next" />
            </button>
          </div>
        </div>

        {showClinicModal && (
          <ManageSchedule
            isOpen={showClinicModal}
            onClose={this.closeClinicModal}
            onSaved={this.handleScheduleSaved}
            doctorInfo={user}
          />
        )}
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

export default connect(mapStateToProps)(TableDoctorSchedule);
