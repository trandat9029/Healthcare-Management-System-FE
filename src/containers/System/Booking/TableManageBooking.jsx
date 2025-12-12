// src/containers/System/Admin/TableManageBooking.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageBooking.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant';
import { handleGetAllBooking } from '../../../services/doctorService';

import Select from 'react-select';
import { getAllCodeService } from '../../../services/userService';
import DatePicker from '../../../components/Input/DatePicker';

class TableManageBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      totalBookings: 0,
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      loading: false,

      // filters
      keywordDoctor: '',
      keywordPatient: '',
      listTime: [],
      selectedTime: null,
      selectedDate: null,

      listStatus: [],
      selectedStatus: null,
    };

    this.searchTimer = null;
  }

  async componentDidMount() {
    await Promise.all([this.fetchTimeOptions(), this.fetchStatusOptions()]);
    this.fetchBookings();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      await Promise.all([this.fetchTimeOptions(), this.fetchStatusOptions()]);
    }
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  fetchStatusOptions = async () => {
    try {
      const res = await getAllCodeService('STATUS');
      if (res && res.errCode === 0) {
        const listStatus = this.buildOptions(res.data || []);
        this.setState({ listStatus });
      }
      console.log('check res status: ', res)
    } catch (error) {
      console.log('fetchStatusOptions error:', error);
    }
  };

  fetchTimeOptions = async () => {
    try {
      const res = await getAllCodeService('TIME');
      if (res && res.errCode === 0) {
        const listTime = this.buildOptions(res.data || []);
        this.setState({ listTime });
      }
    } catch (error) {
      console.log('fetchTimeOptions error:', error);
    }
  };

  buildOptions = (data) => {
    const { language } = this.props;
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      value: item.keyMap,
      label: language === LANGUAGES.EN ? item.valueEn : item.valueVi,
    }));
  };

  buildDateTimestamp = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    if (isNaN(d.getTime())) return undefined;
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  fetchBookings = async () => {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      keywordDoctor,
      keywordPatient,
      selectedTime,
      selectedDate,
      selectedStatus,
    } = this.state;

    try {
      this.setState({ loading: true });

      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
        keywordDoctor: keywordDoctor ? keywordDoctor.trim() : undefined,
        keywordPatient: keywordPatient ? keywordPatient.trim() : undefined,
        timeType: selectedTime ? selectedTime.value : undefined,
        statusId: selectedStatus ? selectedStatus.value : undefined,
        date: this.buildDateTimestamp(selectedDate),
      };

      const res = await handleGetAllBooking(params);
      const data = res && res.data ? res.data : res;

      if (data && data.errCode === 0) {
        const { bookings, total, page: resPage, limit: resLimit } = data;

        this.setState({
          bookings: bookings || [],
          totalBookings: total || 0,
          page: resPage || page,
          limit: resLimit || limit,
        });
      } else {
        console.log('Fetch booking failed:', data);
      }
    } catch (error) {
      console.log('Fetch booking error:', error);
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
    const { page, limit, totalBookings } = this.state;

    const totalPages = Math.ceil((totalBookings || 0) / limit) || 1;
    let newPage = page;

    if (type === 'prev' && page > 1) newPage = page - 1;
    if (type === 'next' && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState({ page: newPage }, () => this.fetchBookings());
    }
  };

  handleSort = (field) => {
    const { sortBy, sortOrder } = this.state;
    let newSortOrder = 'ASC';
    if (sortBy === field && sortOrder === 'ASC') newSortOrder = 'DESC';

    this.setState(
      {
        sortBy: field,
        sortOrder: newSortOrder,
        page: 1,
      },
      () => this.fetchBookings()
    );
  };

  renderSortLabel = (field) => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy !== field) return null;
    return sortOrder === 'ASC' ? ' ↑' : ' ↓';
  };

  handleChangeTime = (selectedTime) => {
    this.setState({ selectedTime, page: 1 }, () => this.fetchBookings());
  };

  handleChangeStatus = (selectedStatus) => {
    this.setState({ selectedStatus, page: 1 }, () => this.fetchBookings());
  };

  handleOnchangeDatePicker = (dateArr) => {
    const date = dateArr && dateArr[0] ? dateArr[0] : null;
    this.setState({ selectedDate: date, page: 1 }, () => this.fetchBookings());
  };

  debounceFetch = () => {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.fetchBookings();
    }, 400);
  };

  handleChangeKeywordDoctor = (e) => {
    this.setState(
      { keywordDoctor: e.target.value, page: 1 },
      this.debounceFetch
    );
  };

  handleChangeKeywordPatient = (e) => {
    this.setState(
      { keywordPatient: e.target.value, page: 1 },
      this.debounceFetch
    );
  };

  clearFilters = () => {
    this.setState(
      {
        keywordDoctor: '',
        keywordPatient: '',
        selectedTime: null,
        selectedDate: null,
        selectedStatus: null,
        page: 1,
      },
      () => this.fetchBookings()
    );
  };

  render() {
    const {
      bookings,
      page,
      limit,
      totalBookings,
      loading,
      listTime,
      selectedTime,
      selectedDate,
      listStatus,
      selectedStatus,
      keywordDoctor,
      keywordPatient,
    } = this.state;

    const { language } = this.props;

    const arrBookings = bookings || [];
    const totalPages = Math.ceil((totalBookings || 0) / limit) || 1;

    return (
      <>
        <div className="bookings-container">
          <div className="title text-center">
            <FormattedMessage id="admin.manage-booking.title" />
          </div>

          <div className="booking-function">
            <div className="search-group">
              <div className="btn-search">
                <i className="fa-solid fa-user-doctor"></i>
                <input
                  className="input-search"
                  type="text"
                  value={keywordDoctor}
                  onChange={this.handleChangeKeywordDoctor}
                  placeholder="Tìm theo tên bác sĩ"
                />
              </div>

              <div className="btn-search">
                <i className="fa-solid fa-user"></i>
                <input
                  className="input-search"
                  type="text"
                  value={keywordPatient}
                  onChange={this.handleChangeKeywordPatient}
                  placeholder="Tìm theo tên bệnh nhân"
                />
              </div>
            </div>

            <div className="filter-schedule">
              <div className="filter-item">
                <label className="filter-label">Trạng thái</label>
                <Select
                  value={selectedStatus}
                  onChange={this.handleChangeStatus}
                  options={listStatus}
                  name="selectedStatus"
                  placeholder="Chọn trạng thái"
                  classNamePrefix="schedule-select"
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">Thời gian khám</label>
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
                <label className="filter-label">Ngày</label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={selectedDate}
                />
              </div>

              <button className="btn-clear" onClick={this.clearFilters}>
                Bỏ lọc
              </button>
            </div>
          </div>

          <div className="bookings-table mt-3 mx-1">
            {loading && <div className="loading-overlay">Loading...</div>}

            <table>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th onClick={() => this.handleSort('doctorId')}>
                    Doctor{this.renderSortLabel('doctorId')}
                  </th>
                  <th onClick={() => this.handleSort('patientId')}>
                    Patient{this.renderSortLabel('patientId')}
                  </th>
                  <th onClick={() => this.handleSort('statusId')}>
                    Status{this.renderSortLabel('statusId')}
                  </th>
                  <th onClick={() => this.handleSort('timeType')}>
                    Time type{this.renderSortLabel('timeType')}
                  </th>
                  <th onClick={() => this.handleSort('date')}>
                    Date{this.renderSortLabel('date')}
                  </th>
                  <th onClick={() => this.handleSort('createdAt')}>
                    Created at{this.renderSortLabel('createdAt')}
                  </th>
                </tr>

                {arrBookings && arrBookings.length > 0 ? (
                  arrBookings.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{(page - 1) * limit + index + 1}</td>

                      <td>
                        {item.doctorBookings?.firstName}{' '}
                        {item.doctorBookings?.lastName}
                      </td>

                      <td>
                        {item.patientData?.firstName}{' '}
                        {item.patientData?.lastName}
                      </td>

                      <td>
                        {language === LANGUAGES.EN
                          ? item.statusData?.valueEn
                          : item.statusData?.valueVi}
                      </td>

                      <td>
                        {language === LANGUAGES.EN
                          ? item.timeTypeDataPatient?.valueEn
                          : item.timeTypeDataPatient?.valueVi}
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
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No bookings found
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
              Prev
            </button>
            <span>
              Page {page} of {totalPages}. Total {totalBookings || 0} bookings
            </span>
            <button
              className="btn btn-light mx-2"
              onClick={() => this.handleChangePage('next')}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(TableManageBooking);
