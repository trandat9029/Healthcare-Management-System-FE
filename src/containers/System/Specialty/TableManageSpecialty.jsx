// src/containers/System/Specialty/TableManageSpecialty.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageSpecialty.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import ManageSpecialty from './ManageSpecialty';     // modal tạo mới
import UpdateSpecialty from './UpdateSpecialty';     // modal sửa

class TableManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
      page: 1,
      limit: 7,
      sortBy: 'name',
      sortOrder: 'ASC',

      showCreateModal: false,      // modal tạo
      showUpdateModal: false,      // modal sửa
      selectedSpecialty: null,     // chuyên khoa đang sửa
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllSpecialtyRedux(page, limit, sortBy, sortOrder);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listSpecialties !== this.props.listSpecialties) {
      this.setState({
        specialties: this.props.listSpecialties,
      });
    }
  }

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder } = this.state;
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
        this.props.fetchAllSpecialtyRedux(
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
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllSpecialtyRedux(page, limit, sortBy, sortOrder);
    this.setState({
      showCreateModal: false,
      showUpdateModal: false,
      selectedSpecialty: null,
    });
  };

  render() {
    const {
      specialties,
      page,
      limit,
      showCreateModal,
      showUpdateModal,
      selectedSpecialty,
    } = this.state;
    const { totalSpecialties } = this.props;

    const arrSpecialties = specialties || [];
    const totalPages = Math.ceil((totalSpecialties || 0) / limit) || 1;

    return (
      <>
        <div className="users-container">
          <div className="title text-center">
            <FormattedMessage
              id="admin.manage-specialty.title"
              defaultMessage="Manage specialties"
            />
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

            <div className="user-create">
              <button
                className="btn-create-user"
                onClick={this.openCreateSpecialtyModal}
              >
                Thêm chuyên khoa
              </button>
            </div>
          </div>

          <div className="users-table mt-3 mx-1">
            <table>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th onClick={() => this.handleSort('name')}>
                    Tên chuyên khoa{this.renderSortLabel('name')}
                  </th>
                  <th>Ngày tạo</th>
                  <th>Hình ảnh</th>
                  <th>Actions</th>
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
                          <button className="btn-delete">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No specialties found
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
              Page {page} of {totalPages}. Total {totalSpecialties || 0}{' '}
              specialties
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
    fetchAllSpecialtyRedux: (page, limit, sortBy, sortOrder) =>
      dispatch(actions.fetchAllSpecialty(page, limit, sortBy, sortOrder)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableManageSpecialty);
