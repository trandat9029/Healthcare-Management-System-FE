// src/containers/System/Admin/TableManageDoctor.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageDoctor.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import ManageDoctor from './ManageDoctor';
import { LANGUAGES } from '../../../utils/constant';
import Select from 'react-select';

class TableManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      page: 1,
      limit: 9,
      sortBy: 'createdAt',
      sortOrder: 'DESC',

      showDoctorModal: false,
      selectedDoctor: null,

      // filter bằng Select
      listPosition: [],
      selectedPosition: null,

      addressFilter: 'ALL',
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllDoctorRedux(page, limit, sortBy, sortOrder);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listDoctors !== this.props.listDoctors) {
      this.setState(
        {
          doctors: this.props.listDoctors,
        },
        () => {
          this.buildPositionOptions();
        }
      );
    }

    if (prevProps.language !== this.props.language) {
      this.buildPositionOptions();
    }
  }

  // build options cho Select chức danh
  buildPositionOptions = () => {
    const { doctors } = this.state;
    const { language } = this.props;
    if (!doctors || doctors.length === 0) {
      this.setState({ listPosition: [] });
      return;
    }

    const map = new Map();
    doctors.forEach((d) => {
      if (d.positionId && d.positionData && !map.has(d.positionId)) {
        map.set(d.positionId, d.positionData);
      }
    });

    const listPosition = [
      { value: 'ALL', label: 'Tất cả chức danh' },
      ...Array.from(map.entries()).map(([id, data]) => ({
        value: id,
        label: language === LANGUAGES.VI ? data.valueVi : data.valueEn,
      })),
    ];

    this.setState({ listPosition });
  };

  openDoctorModal = (doctor) => {
    this.setState({
      showDoctorModal: true,
      selectedDoctor: doctor,
    });
  };

  closeDoctorModal = () => {
    this.setState({
      showDoctorModal: false,
      selectedDoctor: null,
    });
  };

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder } = this.state;
    const { totalDoctors } = this.props;

    const totalPages = Math.ceil((totalDoctors || 0) / limit) || 1;
    let newPage = page;

    if (type === 'prev' && page > 1) newPage = page - 1;
    if (type === 'next' && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState(
        {
          page: newPage,
        },
        () => {
          this.props.fetchAllDoctorRedux(
            this.state.page,
            this.state.limit,
            this.state.sortBy,
            this.state.sortOrder
          );
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
        this.props.fetchAllDoctorRedux(
          this.state.page,
          this.state.limit,
          this.state.sortBy,
          this.state.sortOrder
        );
      }
    );
  };

  renderSortLabel = (field) => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy !== field) return null;
    return sortOrder === 'ASC' ? ' ↑' : ' ↓';
  };

  handleChangePosition = (selectedPosition) => {
    this.setState({ selectedPosition });
  };

  handleAddressFilter = (e) => {
    this.setState({
      addressFilter: e.target.value,
      page: 1,
    });
  };

  render() {
    const {
      doctors,
      page,
      limit,
      showDoctorModal,
      selectedDoctor,
      listPosition,
      selectedPosition,
      addressFilter,
    } = this.state;
    const { totalDoctors, language } = this.props;

    const allDoctors = doctors || [];

    // danh sách địa chỉ duy nhất
    const addressSet = new Set();
    allDoctors.forEach((d) => {
      if (d.address) addressSet.add(d.address);
    });
    const addressOptions = Array.from(addressSet.values());

    // filter theo chức danh và địa chỉ
    const positionFilterValue =
      selectedPosition && selectedPosition.value
        ? selectedPosition.value
        : 'ALL';

    let arrDoctors = allDoctors;

    if (positionFilterValue !== 'ALL') {
      arrDoctors = arrDoctors.filter(
        (d) => d.positionId === positionFilterValue
      );
    }

    if (addressFilter !== 'ALL') {
      arrDoctors = arrDoctors.filter((d) => d.address === addressFilter);
    }

    const totalPages = Math.ceil((totalDoctors || 0) / limit) || 1;

    return (
      <>
        <div className="doctor-page">
          <div className="users-container">
            <div className="title text-center">
              <FormattedMessage id="admin.manage-doctor.title" />
            </div>

            <div className="user-function">
              <button className="btn-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  className="input-search"
                  type="text"
                  placeholder="Tìm kiếm theo email hoặc tên"
                />
              </button>

              <div className="doctor-filters-row">
              <div className="filter-group">
                <label className="filter-label">Lọc theo chức danh</label>
                <Select
                  value={selectedPosition}
                  onChange={this.handleChangePosition}
                  options={listPosition}
                  name="selectedPosition"
                  placeholder="Tất cả chức danh"
                  classNamePrefix="doctor-select"
                  isClearable
                />
              </div>
            </div>

            </div>

            <div className="users-table mt-3 mx-1">
              <table>
                <tbody>
                  <tr>
                    <th onClick={() => this.handleSort('email')}>
                      Email{this.renderSortLabel('email')}
                    </th>
                    <th onClick={() => this.handleSort('firstName')}>
                      First name{this.renderSortLabel('firstName')}
                    </th>
                    <th onClick={() => this.handleSort('lastName')}>
                      Last name{this.renderSortLabel('lastName')}
                    </th>
                    <th>Address</th>
                    <th>Chức danh</th>
                    <th onClick={() => this.handleSort('createdAt')}>
                      Created at{this.renderSortLabel('createdAt')}
                    </th>
                    <th>Actions</th>
                  </tr>

                  {arrDoctors && arrDoctors.length > 0 ? (
                    arrDoctors.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.email}</td>
                          <td>{item.firstName}</td>
                          <td>{item.lastName}</td>
                          <td>{item.address}</td>
                          <td>
                            {item.positionData
                              ? language === LANGUAGES.VI
                                ? item.positionData.valueVi
                                : item.positionData.valueEn
                              : ''}
                          </td>
                          <td>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : ''}
                          </td>
                          <td>
                            <button
                              className="btn-edit"
                              onClick={() => this.openDoctorModal(item)}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>
                        No doctors found
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
                Page {page} of {totalPages}. Total {totalDoctors || 0} doctors
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
        </div>

        {showDoctorModal && (
          <ManageDoctor
            isOpen={showDoctorModal}
            currentDoctor={selectedDoctor}
            onClose={this.closeDoctorModal}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    listDoctors: state.admin.allDoctors,
    totalDoctors: state.admin.doctorTotal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctorRedux: (page, limit, sortBy, sortOrder) =>
      dispatch(actions.fetchAllDoctor(page, limit, sortBy, sortOrder)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageDoctor);
