// src/containers/System/Admin/TableManageDoctor.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageDoctor.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import ManageDoctor from './ManageDoctor';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils/constant';

class TableManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC',

      showDoctorModal: false,
      selectedDoctor: null,
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllDoctorRedux(page, limit, sortBy, sortOrder);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listDoctors !== this.props.listDoctors) {
      this.setState({
        doctors: this.props.listDoctors,
      });
    }
  }

  handleDeleteUser = (user) => {
    this.props.deleteUserRedux(user.id);
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

  render() {
    const {
      doctors,
      page,
      limit,
      showDoctorModal,
      selectedDoctor,
    } = this.state;
    const { totalDoctors, language } = this.props;

    const arrDoctors = doctors || [];
    const totalPages = Math.ceil((totalDoctors || 0) / limit) || 1;

    return (
      <>
        <div className="users-container">
          <div className="title text-center">
            <FormattedMessage id="admin.manage-doctor.title" />
          </div>

          <div className="user-function">
            <button className="btn-search">
              <input
                className="input-search"
                type="text"
                placeholder="Tìm kiếm"
              />
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            {/* bỏ nút thêm bác sĩ tại đây */}
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
                  <th>Vai trò</th>
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
                          {item.roleData
                            ? language === LANGUAGES.VI
                              ? item.roleData.valueVi
                              : item.roleData.valueEn
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
                          {/* <button
                            className="btn-delete"
                            onClick={() => this.handleDeleteUser(item)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button> */}
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
    doctorPageFromStore: state.admin.doctorPage,
    doctorLimitFromStore: state.admin.doctorLimit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctorRedux: (page, limit, sortBy, sortOrder) =>
      dispatch(actions.fetchAllDoctor(page, limit, sortBy, sortOrder)),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageDoctor);
