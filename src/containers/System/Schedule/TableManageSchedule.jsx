// src/containers/System/Admin/TableManageSchedule.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant';
import { getAllCodeService } from '../../../services/userService';
import {
  getAllDoctorsService,
  handleGetAllSchedule,
  handleGetScheduleByDoctor,
} from '../../../services/doctorService';
import DatePicker from '../../../components/Input/DatePicker';
import Select from 'react-select';

class TableManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
      totalSchedules: 0,

      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC',

      listDoctor: [],
      selectedDoctor: null,

      listTime: [],
      selectedTime: null,

      selectedDate: null,

      loading: false,
    };
  }

  async componentDidMount() {
    await this.fetchDoctorOptions();
    await this.fetchTimeOptions();
    this.fetchSchedules();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      await this.fetchDoctorOptions();
      await this.fetchTimeOptions();
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
      console.log('fetchTimeOptions error', error);
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

  fetchDoctorOptions = async () => {
    try {
      const { language } = this.props;
      const res = await getAllDoctorsService({
        page: 1,
        limit: 1000,
        sortBy: 'firstName',
        sortOrder: 'ASC',
      });

      const data = res && res.data ? res.data : res;

      if (data && data.errCode === 0) {
        const doctors = data.doctors || [];
        const listDoctor = doctors.map((doc) => ({
          value: doc.id,
          label:
            language === LANGUAGES.EN
              ? `${doc.firstName} ${doc.lastName}`
              : `${doc.firstName} ${doc.lastName}`,
        }));
        this.setState({ listDoctor });
      } else {
        this.setState({ listDoctor: [] });
      }
    } catch (error) {
      console.log('fetchDoctorOptions error', error);
      this.setState({ listDoctor: [] });
    }
  };

  normalizeDateToTimestamp = (value) => {
    if (!value) return '';
    if (typeof value === 'number') return value;

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';

    const normalized = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      0,
      0,
      0,
      0,
    );
    return normalized.getTime();
  };

  fetchSchedules = async () => {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      selectedDoctor,
      selectedTime,
      selectedDate,
    } = this.state;

    try {
      this.setState({ loading: true });

      const dateParam = this.normalizeDateToTimestamp(selectedDate);

      const baseParams = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (selectedTime && selectedTime.value) {
        baseParams.timeType = selectedTime.value;
      }

      if (dateParam) {
        baseParams.date = dateParam;
      }

      let res;

      if (selectedDoctor && selectedDoctor.value) {
        res = await handleGetScheduleByDoctor({
          ...baseParams,
          doctorId: selectedDoctor.value,
        });
      } else {
        res = await handleGetAllSchedule(baseParams);
      }

      const data = res && res.data ? res.data : res;

      if (data && data.errCode === 0) {
        this.setState({
          schedules: data.schedules || [],
          totalSchedules: data.total || 0,
          page: data.page || page,
          limit: data.limit || limit,
        });
      } else {
        this.setState({
          schedules: [],
          totalSchedules: 0,
        });
      }
    } catch (error) {
      console.log('fetchSchedules error', error);
      this.setState({
        schedules: [],
        totalSchedules: 0,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  formatDate = (value, language) => {
    if (!value) return '';
    const num = Number(value);
    let d = new Date(num);
    if (Number.isNaN(num) || isNaN(d.getTime())) {
      d = new Date(value);
    }
    if (isNaN(d.getTime())) return '';
    return language === LANGUAGES.EN
      ? d.toLocaleDateString('en-US')
      : d.toLocaleDateString('vi-VN');
  };

  handleChangePage = (type) => {
    const { page, limit, totalSchedules } = this.state;
    const totalPages = Math.ceil((totalSchedules || 0) / limit) || 1;
    let newPage = page;

    if (type === 'prev' && page > 1) newPage = page - 1;
    if (type === 'next' && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState({ page: newPage }, () => {
        this.fetchSchedules();
      });
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
      },
    );
  };

  renderSortLabel = (field) => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy !== field) return null;
    return sortOrder === 'ASC' ? ' ↑' : ' ↓';
  };

  handleChangeDoctor = (selectedDoctor) => {
    this.setState(
      {
        selectedDoctor,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      },
    );
  };

  handleChangeTime = (selectedTime) => {
    this.setState(
      {
        selectedTime,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      },
    );
  };

  handleOnchangeDatePicker = (dateArr) => {
    let date = null;
    if (dateArr && Array.isArray(dateArr) && dateArr[0]) {
      date = dateArr[0];
    }
    this.setState(
      {
        selectedDate: date,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      },
    );
  };

  handleClearFilter = () => {
    this.setState(
      {
        selectedDoctor: null,
        selectedTime: null,
        selectedDate: null,
        page: 1,
      },
      () => {
        this.fetchSchedules();
      },
    );
  };

  render() {
    const {
      schedules,
      totalSchedules,
      page,
      limit,
      listDoctor,
      selectedDoctor,
      listTime,
      selectedTime,
      selectedDate,
      loading,
    } = this.state;
    const { language } = this.props;

    const totalPages = Math.ceil((totalSchedules || 0) / limit) || 1;

    return (
      <div className="schedules-container">
        <div className="title text-center"><FormattedMessage id="admin.manage-schedule.schedule-title" /></div>

        <div className="schedule-function">

          <div className="filter-item">
              <label className="filter-label"><FormattedMessage id="admin.manage-schedule.schedule-filter.doctor" /></label>
              <Select
                value={selectedDoctor}
                onChange={this.handleChangeDoctor}
                options={listDoctor}
                name="selectedDoctor"
                placeholder="Tất cả bác sĩ"
                classNamePrefix="doctor-select"
                isClearable
              />
            </div>
          <div className="filter-schedule">
            

            <div className="filter-item">
              <label className="filter-label"><FormattedMessage id="admin.manage-schedule.schedule-filter.time" /></label>
              <Select
                value={selectedTime}
                onChange={this.handleChangeTime}
                options={listTime}
                name="selectedTime"
                placeholder="Tất cả thời gian"
                classNamePrefix="time-select"
                isClearable
              />
            </div>

            <div className="filter-item">
              <label className="filter-label"><FormattedMessage id="admin.manage-schedule.schedule-filter.date" /></label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnchangeDatePicker}
                value={selectedDate}
              />
            </div>

            <button
              type="button"
              className="btn-clear-filter"
              onClick={this.handleClearFilter}
            >
              <FormattedMessage id="admin.filter-cancel" />
            </button>
          </div>
        </div>

        <div className="schedules-table mt-3 mx-1">
          {loading && <div className="loading-overlay"><FormattedMessage id="admin.loading" /></div>}

          <table>
            <tbody>
              <tr>
                <th>STT</th>
                <th onClick={() => this.handleSort('doctorId')}>
                  <FormattedMessage id="admin.manage-schedule.schedule-fullName" />{this.renderSortLabel('doctorId')}
                </th>
                <th onClick={() => this.handleSort('timeType')}>
                  <FormattedMessage id="admin.manage-schedule.schedule-time-type" />{this.renderSortLabel('timeType')}
                </th>
                <th onClick={() => this.handleSort('date')}>
                  <FormattedMessage id="admin.manage-schedule.schedule-date" />{this.renderSortLabel('date')}
                </th>
                <th onClick={() => this.handleSort('createdAt')}>
                  <FormattedMessage id="admin.manage-schedule.schedule-createAt" />{this.renderSortLabel('createdAt')}
                </th>
              </tr>

              {schedules && schedules.length > 0 ? (
                schedules.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>
                      {item.doctorData?.firstName} {item.doctorData?.lastName}
                    </td>
                    <td>
                      {language === LANGUAGES.EN
                        ? item.timeTypeData?.valueEn
                        : item.timeTypeData?.valueVi}
                    </td>
                    <td>{this.formatDate(item.date, language)}</td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString(
                            language === LANGUAGES.EN ? 'en-US' : 'vi-VN',
                          )
                        : ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    <FormattedMessage id="admin.manage-schedule.schedule-no-found" />
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
            <FormattedMessage id="admin.page" /> {page} <FormattedMessage id="admin.of" />  {totalPages}. <FormattedMessage id="admin.total" /> {totalSchedules || 0} <FormattedMessage id="admin.manage-schedule.schedule" />
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(TableManageSchedule);
