// src/containers/System/Handbook/TableManageHandbook.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageHandbook.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import { handlePostHandbook } from '../../../services/handbookService';
import HandbookModal from './HandbookModal';

class TableManageHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handbooks: [],
      page: 1,
      limit: 8,
      sortBy: 'datePublish',
      sortOrder: 'DESC',
      search: '',
      showModal: false,
      selectedHandbook: null,
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllHandbookRedux(page, limit, sortBy, sortOrder);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listHandbooks !== this.props.listHandbooks) {
      this.setState({
        handbooks: this.props.listHandbooks || [],
      });
    }
  }

  // mở modal tạo mới
  openCreateModal = () => {
    this.setState({
      showModal: true,
      selectedHandbook: null,
    });
  };

  // mở modal edit
  openEditModal = (handbook) => {
    this.setState({
      showModal: true,
      selectedHandbook: handbook,
    });
  };

  // đóng modal
  closeModal = () => {
    this.setState({
      showModal: false,
      selectedHandbook: null,
    });
  };

  // gọi lại list sau khi tạo hoặc sửa xong
  refreshHandbookList = async () => {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllHandbookRedux(page, limit, sortBy, sortOrder);
  };

  handleDeleteHandbook = (handbook) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này không?')) {
      this.props.deleteHandbookRedux(handbook.id);
    }
  };

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder } = this.state;
    const { totalHandbooks } = this.props;

    const totalPages = Math.ceil((totalHandbooks || 0) / limit) || 1;
    let newPage = page;

    if (type === 'prev' && page > 1) newPage = page - 1;
    if (type === 'next' && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState(
        { page: newPage },
        () => {
          this.props.fetchAllHandbookRedux(
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
        this.props.fetchAllHandbookRedux(
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

  handleChangeSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  // toggle status
  handleToggleStatus = async (handbook) => {
    try {
      const newStatus = !handbook.status;

      const payload = {
        id: handbook.id,
        status: newStatus,
      };

      const res = await handlePostHandbook(payload);

      if (res && res.errCode === 0) {
        this.setState((prevState) => ({
          handbooks: prevState.handbooks.map((item) =>
            item.id === handbook.id ? { ...item, status: newStatus } : item
          ),
        }));
      } else {
        alert(res?.errMessage || 'Cập nhật trạng thái bài viết thất bại');
      }
    } catch (error) {
      console.log('handleToggleStatus error: ', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái bài viết');
    }
  };

  render() {
    const {
      handbooks,
      page,
      limit,
      search,
      showModal,
      selectedHandbook,
    } = this.state;
    const { totalHandbooks } = this.props;

    const totalPages = Math.ceil((totalHandbooks || 0) / limit) || 1;

    const filteredHandbooks = (handbooks || []).filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <>
        <div className="users-container">
          <div className="title text-center">
            <FormattedMessage
              id="admin.manage-handbook.title"
              defaultMessage="Manage Handbooks"
            />
          </div>

          <div className="user-function">
            <button className="btn-search">
              <input
                className="input-search"
                type="text"
                placeholder="Tìm kiếm theo tiêu đề"
                value={search}
                onChange={this.handleChangeSearch}
              />
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>

          <div className="users-table mt-3 mx-1">
            <table>
              <tbody>
                <tr>
                  <th onClick={() => this.handleSort('name')}>
                    Title{this.renderSortLabel('name')}
                  </th>
                  <th>Image</th>
                  <th>Author</th>
                  <th onClick={() => this.handleSort('datePublish')}>
                    Date public{this.renderSortLabel('datePublish')}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

                {filteredHandbooks && filteredHandbooks.length > 0 ? (
                  filteredHandbooks.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>

                      <td>
                        {item.image ? (
                          <div className="handbook-thumb">
                            <img src={item.image} alt={item.name} />
                          </div>
                        ) : (
                          <span className="thumb-placeholder">No image</span>
                        )}
                      </td>

                      <td>{item.author}</td>
                      <td>
                        {item.datePublish
                          ? new Date(item.datePublish).toLocaleString()
                          : ''}
                      </td>
                      <td>
                        <div
                          className={`toggle-switch ${
                            item.status ? 'on' : ''
                          }`}
                          onClick={() => this.handleToggleStatus(item)}
                        >
                          <div className="toggle-circle" />
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => this.openEditModal(item)}
                        >
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => this.handleDeleteHandbook(item)}
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No handbooks found
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
              Page {page} of {totalPages}. Total {totalHandbooks || 0} handbooks
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

        {/* Modal create/edit handbook */}
        {showModal && (
          <HandbookModal
            isOpen={showModal}
            initialData={selectedHandbook}
            onClose={this.closeModal}
            onSaveSuccess={this.refreshHandbookList}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listHandbooks: state.admin.handbooks,
    totalHandbooks: state.admin.handbookTotal,
    handbookPageFromStore: state.admin.handbookPage,
    handbookLimitFromStore: state.admin.handbookLimit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllHandbookRedux: (page, limit, sortBy, sortOrder) =>
      dispatch(actions.fetchAllHandbook(page, limit, sortBy, sortOrder)),
    deleteHandbookRedux: (id) => dispatch(actions.deleteHandbook(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableManageHandbook);
