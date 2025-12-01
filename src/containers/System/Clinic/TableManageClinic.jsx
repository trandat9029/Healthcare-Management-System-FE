import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageClinic.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import ManageClinic from './ManageClinic';
import { getAllCodeService } from '../../../services/userService';

class TableManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinics: [],
      page: 1,
      limit: 8,
      sortBy: 'name',
      sortOrder: 'ASC',

      showClinicModal: false,

      // filter tỉnh thành
      addressFilter: 'ALL',
      addressOptions: [], // { value, label }
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder } = this.state;

    await this.props.fetchAllClinicRedux(page, limit, sortBy, sortOrder);
    await this.loadProvinceOptions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listClinics !== this.props.listClinics) {
      const clinics = this.props.listClinics || [];
      this.setState({ clinics });
    }
  }

  // lấy danh sách tỉnh thành từ allCode type PROVINCE
  loadProvinceOptions = async () => {
    try {
      const res = await getAllCodeService('PROVINCE'); // đúng type
      console.log('check adrresOp: ', res)
      // tùy vào config axios, nếu res.data mới là payload thì sửa lại
      const payload = res ? res : [];
      console.log('check payload: ', payload)
      if (payload && payload.errCode === 0 && Array.isArray(payload.data)) {
        const options = [
          { value: 'ALL', label: 'Tất cả địa chỉ' },
          ...payload.data.map((item) => ({
            value: item.keyMap,   // PRO1, PRO2
            label: item.valueVi,  // Hà Nội, Đà Nẵng
          })),
        ];

        this.setState({ addressOptions: options });
      }
    } catch (err) {
      console.log('loadProvinceOptions error', err);
    }
  };

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder } = this.state;
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
          this.state.sortOrder
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

  openClinicModal = () => {
    this.setState({ showClinicModal: true });
  };

  closeClinicModal = () => {
    this.setState({ showClinicModal: false });
  };

  handleClinicSaved = async () => {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchAllClinicRedux(page, limit, sortBy, sortOrder);
    this.closeClinicModal();
  };

  handleChangeAddressFilter = (event) => {
    this.setState({
      addressFilter: event.target.value,
    });
  };

  render() {
    const {
      clinics,
      page,
      limit,
      showClinicModal,
      addressFilter,
      addressOptions,
    } = this.state;
    const { totalClinics } = this.props;

    console.log('check adrres: ', addressOptions)

    const totalPages = Math.ceil((totalClinics || 0) / limit) || 1;

    // filter theo provinceId
    const filteredClinics = (clinics || []).filter((clinic) => {
      if (addressFilter === 'ALL') return true;
      return clinic.provinceId === addressFilter;
    });

    return (
      <>
        <div className="users-container">
          <div className="title text-center">
            <FormattedMessage
              id="admin.manage-clinic.title"
              defaultMessage="Manage clinics"
            />
          </div>

          <div className="user-function">
            <button className="btn-search">
              <input
                className="input-search"
                type="text"
                placeholder="Tìm kiếm"
              />
              <i className="fa-solid fa-magnifying-glass" />
            </button>

            <div className="clinic-right-tools">
              <div className="filter-group">
                <label className="filter-label">Lọc theo địa chỉ</label>
                <select
                  className="address-select"
                  value={addressFilter}
                  onChange={this.handleChangeAddressFilter}
                >
                  {addressOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-create">
                <button
                  className="btn-create-user"
                  onClick={this.openClinicModal}
                >
                  Thêm phòng khám
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
                    Tên phòng khám{this.renderSortLabel('name')}
                  </th>
                  <th>Địa chỉ</th>
                  <th>Hình ảnh</th>
                  <th>Actions</th>
                </tr>

                {filteredClinics && filteredClinics.length > 0 ? (
                  filteredClinics.map((item, index) => (
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
                        <button className="btn-edit">
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                        <button className="btn-delete">
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No clinics found
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
              Page {page} of {totalPages}. Total {totalClinics || 0} clinics
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

        {showClinicModal && (
          <ManageClinic
            isOpen={showClinicModal}
            onClose={this.closeClinicModal}
            onSaved={this.handleClinicSaved}
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
    fetchAllClinicRedux: (page, limit, sortBy, sortOrder) =>
      dispatch(actions.fetchAllClinic(page, limit, sortBy, sortOrder)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableManageClinic);
