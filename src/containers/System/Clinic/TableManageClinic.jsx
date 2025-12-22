// src/containers/System/Clinic/TableManageClinic.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageClinic.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import ManageClinic from './ManageClinic';
import UpdateClinic from './UpdateClinic';
import { handleDeleteClinic } from '../../../services/clinicService';

class TableManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinics: [],
      page: 1,
      limit: 7,
      sortBy: 'name',
      sortOrder: 'ASC',

      showClinicModal: false,
      showUpdateModal: false,
      selectedClinic: null,

      keyword: '',
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    await this.props.fetchAllClinicRedux(
      page,
      limit,
      sortBy,
      sortOrder,
      keyword
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listClinics !== this.props.listClinics) {
      const clinics = this.props.listClinics || [];
      this.setState({ clinics });
    }
  }

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    const { totalClinics } = this.props;

    const totalPages = Math.ceil((totalClinics || 0) / limit) || 1;
    let newPage = page;

    if (type === 'prev' && page > 1) newPage = page - 1;
    if (type === 'next' && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState({ page: newPage }, () => {
        this.props.fetchAllClinicRedux(
          this.state.page,
          this.state.limit,
          this.state.sortBy,
          this.state.sortOrder,
          this.state.keyword
        );
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
        this.props.fetchAllClinicRedux(
          this.state.page,
          this.state.limit,
          this.state.sortBy,
          this.state.sortOrder,
          this.state.keyword
        );
      }
    );
  };

  renderSortLabel = (field) => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy !== field) return null;
    return sortOrder === 'ASC' ? ' ↑' : ' ↓';
  };

  handleChangeKeyword = (event) => {
    const value = event.target.value;
    this.setState(
      {
        keyword: value,
        page: 1,
      },
      () => {
        this.props.fetchAllClinicRedux(
          this.state.page,
          this.state.limit,
          this.state.sortBy,
          this.state.sortOrder,
          this.state.keyword
        );
      }
    );
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

  openUpdateClinicModal = (clinic) => {
    this.setState({
      showUpdateModal: true,
      selectedClinic: clinic,
    });
  };

  closeUpdateClinicModal = () => {
    this.setState({
      showUpdateModal: false,
      selectedClinic: null,
    });
  };

  handleClinicSaved = async () => {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    await this.props.fetchAllClinicRedux(
      page,
      limit,
      sortBy,
      sortOrder,
      keyword
    );
    this.closeClinicModal();
  };

  handleClinicUpdated = async () => {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    await this.props.fetchAllClinicRedux(
      page,
      limit,
      sortBy,
      sortOrder,
      keyword
    );
    this.closeUpdateClinicModal();
  };

  handleDeleteClinic = async (clinic) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng khám không?')) {
      await handleDeleteClinic(clinic.id);
      const { page, limit, sortBy, sortOrder, keyword } = this.state;
      await this.props.fetchAllClinicRedux(
        page,
        limit,
        sortBy,
        sortOrder,
        keyword
      );
    }
  };

  render() {
    const {
      clinics,
      page,
      limit,
      showClinicModal,
      showUpdateModal,
      selectedClinic,
      keyword,
    } = this.state;
    const { totalClinics } = this.props;

    const totalPages = Math.ceil((totalClinics || 0) / limit) || 1;

    return (
      <>
        <div className="clinics-container">
          <div className="title text-center">
            <FormattedMessage id="admin.manage-clinic.clinic-title"/>
          </div>

          <div className="clinic-function">
            <button className="btn-search">
              <input
                className="input-search"
                type="text"
                placeholder="Tìm theo địa chỉ "
                value={keyword}
                onChange={this.handleChangeKeyword}
              />
              <i className="fa-solid fa-magnifying-glass" />
            </button>

            <div className="clinic-right-tools">
              <div className="clinic-create">
                <button
                  className="btn-create-clinic"
                  onClick={this.openClinicModal}
                >
                  <FormattedMessage id="admin.manage-clinic.clinic-btn-create"/>
                </button>
              </div>
            </div>
          </div>

          <div className="users-table mt-3 mx-1">
            <table>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th onClick={() => this.handleSort('name')}>
                    <FormattedMessage id="admin.manage-clinic.clinic.name"/>{this.renderSortLabel('name')}
                  </th>
                  <th><FormattedMessage id="admin.manage-clinic.clinic.address"/></th>
                  <th><FormattedMessage id="admin.manage-clinic.clinic.thumbnail"/></th>
                  <th><FormattedMessage id="admin.manage-clinic.clinic.action"/></th>
                </tr>

                {clinics && clinics.length > 0 ? (
                  clinics.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{item.name}</td>
                      <td
                        style={{
                          maxWidth: 300,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.address}
                      </td>
                      <td>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 80,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 4,
                            }}
                          />
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => this.openUpdateClinicModal(item)}
                        >
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => this.handleDeleteClinic(item)}
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      <FormattedMessage id="admin.manage-clinic.clinic-no-found"/>
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
              <FormattedMessage id="admin.prev"/>
            </button>
            <span>
              <FormattedMessage id="admin.page"/> {page} <FormattedMessage id="admin.of"/> {totalPages}. <FormattedMessage id="admin.total"/> {totalClinics || 0} <FormattedMessage id="admin.manage-clinic.clinics"/>
            </span>
            <button
              className="btn btn-light mx-2"
              onClick={() => this.handleChangePage('next')}
              disabled={page >= totalPages}
            >
              <FormattedMessage id="admin.next"/>
            </button>
          </div>
        </div>

        {showClinicModal && (
          <ManageClinic
            isOpen={showClinicModal}
            onClose={this.closeClinicModal}
            onSaved={this.handleClinicSaved}
          />
        )}

        {showUpdateModal && (
          <UpdateClinic
            isOpen={showUpdateModal}
            currentClinic={selectedClinic}
            onClose={this.closeUpdateClinicModal}
            onUpdated={this.handleClinicUpdated}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listClinics: state.admin.clinics,
    totalClinics: state.admin.clinicTotal,
    clinicPageFromStore: state.admin.clinicPage,
    clinicLimitFromStore: state.admin.clinicLimit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllClinicRedux: (page, limit, sortBy, sortOrder, keyword) =>
      dispatch(actions.fetchAllClinic(page, limit, sortBy, sortOrder, keyword)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableManageClinic);
