// src/containers/System/Specialty/TableManageSpecialty.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageSpecialty.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import ManageSpecialty from './ManageSpecialty';     // modal tạo mới
import UpdateSpecialty from './UpdateSpecialty';     // modal sửa
import { handleDeleteSpecialty } from '../../../services/specialtyService';

class TableManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
      page: 1,
      limit: 7,
      sortBy: 'name',
      sortOrder: 'ASC',

      keyword: '',

      showCreateModal: false,      // modal tạo
      showUpdateModal: false,      // modal sửa
      selectedSpecialty: null,     // chuyên khoa đang sửa
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    await this.props.fetchAllSpecialtyRedux(page, limit, sortBy, sortOrder, keyword);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listSpecialties !== this.props.listSpecialties) {
      this.setState({
        specialties: this.props.listSpecialties,
      });
    }
  }

   handleChangeSearch = (e) =>{
    const keyword = e.target.value;
    this.setState({
      keyword,
      page: 1,
    }, ()=>{
      const { page, limit, sortBy, sortOrder } = this.state;
      this.props.fetchAllSpecialtyRedux(page, limit, sortBy, sortOrder, keyword);
    })
  }

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    const { totalSpecialties } = this.props;

    const totalPages = Math.ceil((totalSpecialties || 0) / limit) || 1;
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
          this.props.fetchAllSpecialtyRedux(
            this.state.page,
            this.state.limit,
            this.state.sortBy,
            this.state.sortOrder,
            this.state.keyword,
          );
        }
      );
    }
  };

  handleSort = (field) => {
    const { sortBy, sortOrder, keyword } = this.state;
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
        this.props.fetchAllSpecialtyRedux(
          this.state.page,
          this.state.limit,
          this.state.sortBy,
          this.state.sortOrder,
          keyword,
        );
      }
    );
  };

  renderSortLabel = (field) => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy !== field) return null;
    return sortOrder === 'ASC' ? ' ↑' : ' ↓';
  };

  // mở modal tạo mới
  openCreateSpecialtyModal = () => {
    this.setState({
      showCreateModal: true,
      showUpdateModal: false,
      selectedSpecialty: null,
    });
  };

  // mở modal sửa
  openEditSpecialtyModal = (specialty) => {
    this.setState({
      showUpdateModal: true,
      showCreateModal: false,
      selectedSpecialty: specialty,
    });
  };

  // đóng modal tạo
  closeCreateModal = () => {
    this.setState({
      showCreateModal: false,
    });
  };

  // đóng modal sửa
  closeUpdateModal = () => {
    this.setState({
      showUpdateModal: false,
      selectedSpecialty: null,
    });
  };

  // sau khi save xong thì reload list và đóng mọi modal
  handleSpecialtySaved = async () => {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    await this.props.fetchAllSpecialtyRedux(page, limit, sortBy, sortOrder, keyword);
    this.setState({
      showCreateModal: false,
      showUpdateModal: false,
      selectedSpecialty: null,
    });
  };

  handleDeleteSpecialty = async (specialty) => {
    if (window.confirm('Bạn có chắc muốn xóa chuyên khoa này không?')) {
      await handleDeleteSpecialty(specialty.id);
    }
  };
  
  render() {
    const {
      specialties,
      page,
      limit,
      showCreateModal,
      showUpdateModal,
      selectedSpecialty,
      keyword,
    } = this.state;
    const { totalSpecialties } = this.props;

    const arrSpecialties = specialties || [];
    const totalPages = Math.ceil((totalSpecialties || 0) / limit) || 1;

    return (
      <>
        <div className="specialtys-container">
          <div className="title text-center">
            <FormattedMessage id="admin.manage-specialty.specialty-title" />
          </div>

          <div className="specialty-function">
            <button className="btn-search">
              <input
                className="input-search"
                type="text"
                placeholder="Tìm kiếm theo tên chuyên khoa"
                value={keyword}
                onChange={this.handleChangeSearch}
              />
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <div className="specialty-create">
              <button
                className="btn-create-specialty"
                onClick={this.openCreateSpecialtyModal}
              >
                <FormattedMessage id="admin.manage-specialty.specialty-btn-create" />
              </button>
            </div>
          </div>

          <div className="specialtys-table mt-3 mx-1">
            <table>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th onClick={() => this.handleSort('name')}>
                    <FormattedMessage id="admin.manage-specialty.specialty.name" />{this.renderSortLabel('name')}
                  </th>
                  <th><FormattedMessage id="admin.manage-specialty.specialty.createAt" /></th>
                  <th><FormattedMessage id="admin.manage-specialty.specialty.thumbnail" /></th>
                  <th><FormattedMessage id="admin.manage-specialty.specialty.action" /></th>
                </tr>

                {arrSpecialties && arrSpecialties.length > 0 ? (
                  arrSpecialties.map((item, index) => {
                    return (
                      <tr key={index}>
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
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : ''}
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
                            onClick={() => this.openEditSpecialtyModal(item)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => this.handleDeleteSpecialty(item)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      <FormattedMessage id="admin.manage-specialty.specialty-no-found" />
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
              <FormattedMessage id="admin.page" /> {page} <FormattedMessage id="admin.of" /> {totalPages}. <FormattedMessage id="admin.total" /> {totalSpecialties || 0}{' '}
              <FormattedMessage id="admin.manage-specialty.specialties" />
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

        {/* Modal tạo mới */}
        {showCreateModal && (
          <ManageSpecialty
            isOpen={showCreateModal}
            onClose={this.closeCreateModal}
            onSaved={this.handleSpecialtySaved}
          />
        )}

        {/* Modal sửa, dùng UpdateSpecialty và fill currentSpecialty */}
        {showUpdateModal && (
          <UpdateSpecialty
            isOpen={showUpdateModal}
            currentSpecialty={selectedSpecialty}
            onClose={this.closeUpdateModal}
            onSaved={this.handleSpecialtySaved}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listSpecialties: state.admin.specialties,
    totalSpecialties: state.admin.specialtyTotal,
    specialtyPageFromStore: state.admin.specialtyPage,
    specialtyLimitFromStore: state.admin.specialtyLimit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllSpecialtyRedux: (page, limit, sortBy, sortOrder, keyword) =>
      dispatch(actions.fetchAllSpecialty(page, limit, sortBy, sortOrder, keyword)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableManageSpecialty);
