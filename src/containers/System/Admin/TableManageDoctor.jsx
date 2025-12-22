import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageDoctor.scss";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils/constant";
import Select from "react-select";
import ManageDoctor from "./ManageDoctor";

class TableManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],

      page: 1,
      limit: 5,
      sortBy: "createdAt",
      sortOrder: "DESC",

      keyword: "",
      searchTimer: null,

      listPosition: [],
      selectedPosition: null,

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
      this.setState(
        { doctors: this.props.listDoctors },
        this.buildPositionOptions
      );
    }

    if (prevProps.language !== this.props.language) {
      this.buildPositionOptions();
    }
  }

  componentWillUnmount() {
    if (this.state.searchTimer) {
      clearTimeout(this.state.searchTimer);
    }
  }

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
      { value: "ALL", label: "Tất cả chức danh" },
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

  handleSearchDoctor = (e) => {
    const value = e.target.value;
    const { limit, sortBy, sortOrder } = this.state;

    this.setState({ keyword: value, page: 1 }, () => {
      if (this.state.searchTimer) {
        clearTimeout(this.state.searchTimer);
      }

      const timer = setTimeout(() => {
        this.props.fetchAllDoctorRedux(
          1,
          limit,
          sortBy,
          sortOrder,
          this.state.keyword
        );
      }, 400);

      this.setState({ searchTimer: timer });
    });
  };

  handleChangePosition = (selectedPosition) => {
    this.setState({ selectedPosition });
  };

  handleClearFilter = () => {
    const { limit, sortBy, sortOrder } = this.state;

    this.setState(
      {
        keyword: "",
        selectedPosition: null,
        page: 1,
      },
      () => {
        this.props.fetchAllDoctorRedux(1, limit, sortBy, sortOrder, "");
      }
    );
  };

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder, keyword } = this.state;
    const { totalDoctors } = this.props;

    const totalPages = Math.ceil((totalDoctors || 0) / limit) || 1;
    let newPage = page;

    if (type === "prev" && page > 1) newPage = page - 1;
    if (type === "next" && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState({ page: newPage }, () => {
        this.props.fetchAllDoctorRedux(
          this.state.page,
          limit,
          sortBy,
          sortOrder,
          keyword
        );
      });
    }
  };

  handleSort = (field) => {
    const { sortBy, sortOrder, limit, keyword } = this.state;
    let newSortOrder = "ASC";

    if (sortBy === field && sortOrder === "ASC") {
      newSortOrder = "DESC";
    }

    this.setState(
      {
        sortBy: field,
        sortOrder: newSortOrder,
        page: 1,
      },
      () => {
        this.props.fetchAllDoctorRedux(1, limit, field, newSortOrder, keyword);
      }
    );
  };

  renderSortLabel = (field) => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy !== field) return null;
    return sortOrder === "ASC" ? " ↑" : " ↓";
  };

  render() {
    const {
      doctors,
      page,
      limit,
      keyword,
      listPosition,
      selectedPosition,
      showDoctorModal,
      selectedDoctor,
    } = this.state;

    const { language, totalDoctors } = this.props;

    let filteredDoctors = doctors || [];

    if (selectedPosition && selectedPosition.value !== "ALL") {
      filteredDoctors = filteredDoctors.filter(
        (d) => d.positionId === selectedPosition.value
      );
    }

    const totalPages = Math.ceil((totalDoctors || 0) / limit) || 1;

    return (
      <>
        <div className="doctors-container">
          <div className="title text-center">
            <FormattedMessage id="admin.manage-doctor.title" />
          </div>

          <div className="doctor-function">
            <div className="btn-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                className="input-search"
                type="text"
                placeholder="Tìm theo tên bác sĩ"
                value={keyword}
                onChange={this.handleSearchDoctor}
              />
            </div>

            <div className="doctor-filter-group">
              <div className="filter-item">
                <label className="filter-label"><FormattedMessage id="admin.manage-user.user-create.position" /></label>
                <Select
                  value={selectedPosition}
                  onChange={this.handleChangePosition}
                  options={listPosition}
                  placeholder="Tất cả chức danh"
                  classNamePrefix="schedule-select"
                  isClearable
                />
              </div>

              <button
                className="btn-clear-filter"
                onClick={this.handleClearFilter}
              >
                <FormattedMessage id="admin.filter-cancel" />
              </button>
            </div>
          </div>

          <div className="doctors-table mt-3 mx-1">
            <table>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th>Email</th>

                  <th onClick={() => this.handleSort("firstName")}>
                    <FormattedMessage id="admin.manage-doctor.doctor-fullName" /> {this.renderSortLabel("firstName")}
                  </th>

                  <th><FormattedMessage id="admin.manage-user.user-create.position" /></th>
                  <th><FormattedMessage id="admin.manage-user.user-create.avatar" /></th>

                  <th onClick={() => this.handleSort("createdAt")}>
                    <FormattedMessage id="admin.manage-user.user-createAt" />{this.renderSortLabel("createdAt")}
                  </th>

                  <th><FormattedMessage id="admin.manage-user.user-action" /></th>
                </tr>

                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.email}</td>

                      <td>
                        {item.firstName} {item.lastName}
                      </td>

                      <td>
                        {item.positionData
                          ? language === LANGUAGES.VI
                            ? item.positionData.valueVi
                            : item.positionData.valueEn
                          : ""}
                      </td>
                      <td className="doctor-avatar-cell">
                        {item.image ? (
                          <img
                            className="doctor-avatar"
                            src={item.image}
                            alt="avatar"
                          />
                        ) : (
                          <span><FormattedMessage id="admin.nothing" /></span>
                        )}
                      </td>

                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : ""}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <FormattedMessage id="admin.manage-user.user-no-found" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination mt-3 d-flex justify-content-center align-items-center">
            <button
              className="btn btn-light mx-2"
              onClick={() => this.handleChangePage("prev")}
              disabled={page <= 1}
            >
              <FormattedMessage id="admin.prev" />
            </button>

            <span>
              <FormattedMessage id="admin.page" /> {page} <FormattedMessage id="admin.of" /> {totalPages}. <FormattedMessage id="admin.total" /> {totalDoctors || 0} <FormattedMessage id="admin.manage-doctor.doctor" />
            </span>

            <button
              className="btn btn-light mx-2"
              onClick={() => this.handleChangePage("next")}
              disabled={page >= totalPages}
            >
              <FormattedMessage id="admin.next" />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctorRedux: (page, limit, sortBy, sortOrder, keyword) =>
      dispatch(actions.fetchAllDoctor(page, limit, sortBy, sortOrder, keyword)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageDoctor);
