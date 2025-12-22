// src/containers/System/Handbook/TableManageHandbook.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageHandbook.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import { handlePostHandbook } from '../../../services/handbookService';
import { getAllCodeService } from '../../../services/userService';
import HandbookModal from './HandbookModal';
import DatePicker from '../../../components/Input/DatePicker';

class TableManageHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handbooks: [],
      page: 1,
      limit: 7,
      sortBy: 'datePublish',
      sortOrder: 'DESC',

      search: '',
      statusFilter: 'ALL',
      statusOptions: [],

      dateFilter: null,

      showModal: false,
      selectedHandbook: null,
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllHandbookRedux(page, limit, sortBy, sortOrder);
    await this.loadStatusOptions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listHandbooks !== this.props.listHandbooks) {
      this.setState({
        handbooks: this.props.listHandbooks || [],
      });
    }
  }

  loadStatusOptions = async () => {
    try {
      const res = await getAllCodeService('STATUS');
      if (res && res.data && res.data.errCode === 0) {
        const codes = res.data.data || [];
        const statusOptions = [
          { value: 'ALL', label: 'Tất cả trạng thái' },
          ...codes.map((item) => ({
            value: item.keyMap,
            label: item.valueVi,
          })),
        ];
        this.setState({ statusOptions });
      } else {
        this.setState({
          statusOptions: [
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'PUBLISHED', label: 'Đăng' },
            { value: 'HIDDEN', label: 'Ẩn' },
          ],
        });
      }
    } catch {
      this.setState({
        statusOptions: [
          { value: 'ALL', label: 'Tất cả trạng thái' },
          { value: 'PUBLISHED', label: 'Đăng' },
          { value: 'HIDDEN', label: 'Ẩn' },
        ],
      });
    }
  };

  openCreateModal = () => {
    this.setState({
      showModal: true,
      selectedHandbook: null,
    });
  };

  openEditModal = (handbook) => {
    this.setState({
      showModal: true,
      selectedHandbook: handbook,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      selectedHandbook: null,
    });
  };

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

    const totalPages = Math.ceil((totalHandbooks || 0) / limit);
    let newPage = page;

    if (type === 'prev' && page > 1) newPage = page - 1;
    if (type === 'next' && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState({ page: newPage }, () => {
        this.props.fetchAllHandbookRedux(newPage, limit, sortBy, sortOrder);
      });
    }
  };

  handleSort = (field) => {
    const { sortBy, sortOrder } = this.state;
    let newSort = 'ASC';

    if (sortBy === field && sortOrder === 'ASC') {
      newSort = 'DESC';
    }

    this.setState(
      { sortBy: field, sortOrder: newSort, page: 1 },
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
    this.setState({ search: e.target.value });
  };

  handleChangeStatusFilter = (e) => {
    this.setState({ statusFilter: e.target.value });
  };

  handleChangeDateFilter = (dateArr) => {
    if (!dateArr || !dateArr[0]) {
      this.setState({ dateFilter: null });
      return;
    }
    this.setState({ dateFilter: dateArr[0] });
  };

  /** ⭐ NÚT BỎ LỌC */
  handleClearFilters = () => {
    this.setState({
      search: '',
      statusFilter: 'ALL',
      dateFilter: null,
    });
  };

  handleToggleStatus = async (handbook) => {
    try {
      const newStatus = !handbook.status;
      const payload = { id: handbook.id, status: newStatus };

      const res = await handlePostHandbook(payload);
      if (res && res.errCode === 0) {
        this.setState((prev) => ({
          handbooks: prev.handbooks.map((item) =>
            item.id === handbook.id ? { ...item, status: newStatus } : item
          ),
        }));
      }
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  render() {
    const {
      handbooks,
      page,
      limit,
      search,
      statusFilter,
      statusOptions,
      dateFilter,
      showModal,
      selectedHandbook
    } = this.state;

    const { totalHandbooks } = this.props;

    const totalPages = Math.ceil((totalHandbooks || 0) / limit);
    const lowerSearch = search.toLowerCase();

    const filteredHandbooks = handbooks.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(lowerSearch) ||
        item.author?.toLowerCase().includes(lowerSearch);

      let matchesDate = true;
      if (dateFilter && item.datePublish) {
        const p = new Date(item.datePublish);
        const f = new Date(dateFilter);
        matchesDate =
          p.getFullYear() === f.getFullYear() &&
          p.getMonth() === f.getMonth() &&
          p.getDate() === f.getDate();
      }

      if (!matchesSearch || !matchesDate) return false;

      if (statusFilter === 'PUBLISHED') return item.status === true;
      if (statusFilter === 'HIDDEN') return item.status === false;

      return true;
    });

    return (
      <>
        <div className="handbooks-container">

          <div className="title text-center">
            <FormattedMessage id="admin.manage-handbook.handbook-title"/>
          </div>

          <div className="handbook-function">
            <button className="btn-search">
              <input
                className="input-search"
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc tác giả"
                value={search}
                onChange={this.handleChangeSearch}
              />
              <i className="fa-solid fa-magnifying-glass" />
            </button>

            <div className="handbook-right-tools">

              <div className="filter-group">
                <label className="filter-label"><FormattedMessage id="admin.manage-handbook.handbook-filter-status"/></label>
                <select
                  className="status-select"
                  value={statusFilter}
                  onChange={this.handleChangeStatusFilter}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label"><FormattedMessage id="admin.manage-handbook.handbook-filter-date"/></label>
                <DatePicker
                  className="date-filter-input"
                  value={dateFilter}
                  placeholder="Lọc theo ngày đăng"
                  onChange={this.handleChangeDateFilter}
                />
              </div>

              {/* ⭐ NÚT BỎ LỌC */}
              <button
                className="btn-clear-filter"
                onClick={this.handleClearFilters}
              >
                <FormattedMessage id="admin.filter-cancel"/>
              </button>

            </div>
          </div>

          {/* TABLE */}
          <div className="handbooks-table mt-3 mx-1">
            <table>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th onClick={() => this.handleSort('name')}>
                    <FormattedMessage id="admin.manage-handbook.handbook.title"/> {this.renderSortLabel('name')}
                  </th>
                  <th><FormattedMessage id="admin.manage-handbook.handbook.image"/></th>
                  <th><FormattedMessage id="admin.manage-handbook.handbook.author"/></th>
                  <th onClick={() => this.handleSort('datePublish')}>
                    <FormattedMessage id="admin.manage-handbook.handbook.date-publish"/> {this.renderSortLabel('datePublish')}
                  </th>
                  <th><FormattedMessage id="admin.manage-handbook.handbook.status"/></th>
                  <th><FormattedMessage id="admin.manage-handbook.handbook.action"/></th>
                </tr>

                {filteredHandbooks.length > 0 ? (
                  filteredHandbooks.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>

                      <td>
                        {item.image ? (
                          <div className="handbook-thumb">
                            <img src={item.image} alt={item.name} />
                          </div>
                        ) : (
                          <span><FormattedMessage id="admin.manage-handbook.handbook.no-image"/></span>
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
                          className={`toggle-switch ${item.status ? 'on' : ''}`}
                          onClick={() => this.handleToggleStatus(item)}
                        >
                          <div className="toggle-circle" />
                        </div>
                      </td>

                      <td>
                        <button className="btn-edit" onClick={() => this.openEditModal(item)}>
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                        <button className="btn-delete" onClick={() => this.handleDeleteHandbook(item)}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}><FormattedMessage id="admin.manage-handbook.handbook-no-found"/></td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="pagination mt-3 d-flex justify-content-center align-items-center">
            <button className="btn btn-light mx-2" onClick={() => this.handleChangePage('prev')} disabled={page <= 1}>
              <FormattedMessage id="admin.prev"/>
            </button>

            <span>
              <FormattedMessage id="admin.page"/> {page} <FormattedMessage id="admin.of"/> {totalPages}. <FormattedMessage id="admin.total"/> {totalHandbooks || 0} <FormattedMessage id="admin.manage-handbook.handbooks"/>
            </span>

            <button className="btn btn-light mx-2" onClick={() => this.handleChangePage('next')} disabled={page >= totalPages}>
              <FormattedMessage id="admin.next"/>
            </button>
          </div>
        </div>

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

const mapStateToProps = (state) => ({
  listHandbooks: state.admin.handbooks,
  totalHandbooks: state.admin.handbookTotal,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllHandbookRedux: (p, l, s, o) =>
    dispatch(actions.fetchAllHandbook(p, l, s, o)),
  deleteHandbookRedux: (id) => dispatch(actions.deleteHandbook(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableManageHandbook);
