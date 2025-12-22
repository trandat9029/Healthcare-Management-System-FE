// src/containers/System/Admin/TableManageUser.js
import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";
import UserRedux from "./UserRedux";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils/constant";
import Select from "react-select";
import { getAllCodeService } from "../../../services/userService";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRedux: [],
      page: 1,
      limit: 9,
      sortBy: "createdAt",
      sortOrder: "DESC",

      // NEW. search
      search: "",

      roleFilter: "ALL",
      listRole: [],
      selectedRole: null,

      // NEW. lưu list ROLE lấy từ Allcode để đổi ngôn ngữ build lại label
      roleCodes: [],

      showUserModal: false,
      modalAction: CRUD_ACTIONS.CREATE,
      selectedUser: null,
    };
  }

  async componentDidMount() {
    const { page, limit, sortBy, sortOrder } = this.state;
    await this.props.fetchUserRedux(page, limit, sortBy, sortOrder);
    this.fetchRoleOptions();
  }

  componentDidUpdate(prevProps) {
    const { listUsers, language } = this.props;

    if (prevProps.listUsers !== listUsers) {
      this.setState({
        userRedux: listUsers,
      });
    }

    // đổi ngôn ngữ thì build lại options ROLE
    if (prevProps.language !== language) {
      const { roleCodes } = this.state;
      if (roleCodes && roleCodes.length > 0) {
        const listRole = this.buildRoleOptionsFromAllcodes(roleCodes);
        this.setState({ listRole });
      }
    }
  }

  fetchRoleOptions = async () => {
    try {
      const res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        const roleCodes = res.data || [];
        const listRole = this.buildRoleOptionsFromAllcodes(roleCodes);
        this.setState({ listRole, roleCodes });
      }
    } catch (error) {
      console.log("fetchRoleOptions error:", error);
    }
  };

  // build options cho Select vai trò từ Allcode ROLE
  buildRoleOptionsFromAllcodes = (roleCodes) => {
    const { language } = this.props;
    const opts = [
      { value: "ALL", label: "Tất cả vai trò" },
      ...(roleCodes || []).map((item) => ({
        value: item.keyMap,
        label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
      })),
    ];
    return opts;
  };

  handleDeleteUser = (user) => {
    this.props.deleteUserRedux(user.id);
  };

  openCreateUserModal = () => {
    this.setState({
      showUserModal: true,
      modalAction: CRUD_ACTIONS.CREATE,
      selectedUser: null,
    });
  };

  openEditUserModal = (user) => {
    this.setState({
      showUserModal: true,
      modalAction: CRUD_ACTIONS.EDIT,
      selectedUser: user,
    });
  };

  closeUserModal = () => {
    this.setState({
      showUserModal: false,
      modalAction: CRUD_ACTIONS.CREATE,
      selectedUser: null,
    });
  };

  handleChangePage = (type) => {
    const { page, limit, sortBy, sortOrder } = this.state;
    const { totalUsers } = this.props;

    const totalPages = Math.ceil((totalUsers || 0) / limit) || 1;
    let newPage = page;

    if (type === "prev" && page > 1) newPage = page - 1;
    if (type === "next" && page < totalPages) newPage = page + 1;

    if (newPage !== page) {
      this.setState({ page: newPage }, () => {
        this.props.fetchUserRedux(
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
    let newSortOrder = "ASC";

    if (sortBy === field && sortOrder === "ASC") newSortOrder = "DESC";

    this.setState(
      {
        sortBy: field,
        sortOrder: newSortOrder,
        page: 1,
      },
      () => {
        this.props.fetchUserRedux(
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
    return sortOrder === "ASC" ? " ↑" : " ↓";
  };

  handleChangeSearch = (e) => {
    const keyword = e.target.value;
    this.setState({ search: keyword, page: 1 }, () => {
      const { page, limit, sortBy, sortOrder, roleFilter, search } = this.state;
      this.props.fetchUserRedux(
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        roleFilter
      );
    });
  };

  handleChangeRole = (selectedRole) => {
    const roleId =
      selectedRole && selectedRole.value ? selectedRole.value : "ALL";
    this.setState({ selectedRole, roleFilter: roleId, page: 1 }, () => {
      const { page, limit, sortBy, sortOrder, roleFilter, search } = this.state;
      this.props.fetchUserRedux(
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        roleFilter
      );
    });
  };

  render() {
    const {
      userRedux,
      page,
      limit,
      showUserModal,
      modalAction,
      selectedUser,
      roleFilter,
      listRole,
      selectedRole,
      search,
    } = this.state;

    const { totalUsers, language } = this.props;

    let arrUsers = userRedux || [];

    // filter theo vai trò
    if (roleFilter !== "ALL") {
      arrUsers = arrUsers.filter((u) => u.roleId === roleFilter);
    }

    // NEW. filter theo search (email hoặc tên)
    const q = (search || "").trim().toLowerCase();
    if (q) {
      arrUsers = arrUsers.filter((u) => {
        const email = (u.email || "").toLowerCase();
        const firstName = (u.firstName || "").toLowerCase();
        const lastName = (u.lastName || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const fullName2 = `${lastName} ${firstName}`.trim();

        return (
          email.includes(q) ||
          firstName.includes(q) ||
          lastName.includes(q) ||
          fullName.includes(q) ||
          fullName2.includes(q)
        );
      });
    }

    const totalPages = Math.ceil((totalUsers || 0) / limit) || 1;

    return (
      <>
        <div className="users-page">
          <div className="users-container">
            <div className="users-header">
              <div className="users-header-top">
                <div className="title">
                  <FormattedMessage id="admin.manage-user.user-title" />
                </div>
              </div>

              <div className="users-header-bottom">
                <button className="btn-search">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    className="input-search"
                    type="text"
                    placeholder="Tìm kiếm theo email hoặc tên"
                    value={search}
                    onChange={this.handleChangeSearch}
                  />
                </button>

                <div className="users-filter">
                  <div className="users-filter-row">
                    <div className="filter-group">
                      <label className="filter-label">
                        <FormattedMessage id="admin.manage-user.user-filter" />
                      </label>
                      <Select
                        value={selectedRole}
                        onChange={this.handleChangeRole}
                        options={listRole}
                        name="selectedRole"
                        placeholder="Tất cả vai trò"
                        classNamePrefix="user-select"
                        isClearable
                      />
                    </div>
                  </div>

                  <div className="user-create">
                    <button
                      className="btn-create-user"
                      onClick={this.openCreateUserModal}
                    >
                      <i className="fa-solid fa-user-plus"></i>
                      <span>
                        <FormattedMessage id="admin.manage-user.user-btn-create" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="users-table mt-3 mx-1">
              <table>
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th onClick={() => this.handleSort("email")}>
                      Email{this.renderSortLabel("email")}
                    </th>
                    <th onClick={() => this.handleSort("firstName")}>
                      <FormattedMessage id="admin.manage-user.user-name" />
                      {this.renderSortLabel("firstName")}
                    </th>
                    <th>
                      <FormattedMessage id="admin.manage-user.user-address" />
                    </th>
                    <th onClick={() => this.handleSort("roleId")}>
                      <FormattedMessage id="admin.manage-user.user-role" />
                      {this.renderSortLabel("roleId")}
                    </th>
                    <th onClick={() => this.handleSort("createdAt")}>
                      <FormattedMessage id="admin.manage-user.user-createAt" />
                      {this.renderSortLabel("createdAt")}
                    </th>
                    <th>
                      <FormattedMessage id="admin.manage-user.user-action" />
                    </th>
                  </tr>

                  {arrUsers && arrUsers.length > 0 ? (
                    arrUsers.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.email}</td>
                          <td>
                            {item.firstName} {item.lastName}
                          </td>
                          <td>{item.address}</td>
                          <td>
                            {language === LANGUAGES.VI
                              ? item.roleData?.valueVi
                              : item.roleData?.valueEn}
                          </td>
                          <td>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : ""}
                          </td>
                          <td>
                            <button
                              className="btn-edit"
                              onClick={() => this.openEditUserModal(item)}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => this.handleDeleteUser(item)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
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
                <FormattedMessage id="admin.page" /> {page} <FormattedMessage id="admin.of" /> {totalPages}. <FormattedMessage id="admin.total" /> {totalUsers || 0}  <FormattedMessage id="admin.manage-user.user" />
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
        </div>

        {showUserModal && (
          <UserRedux
            isOpen={showUserModal}
            actionMode={modalAction}
            currentUser={selectedUser}
            onClose={this.closeUserModal}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    listUsers: state.admin.users,
    totalUsers: state.admin.total,
    pageFromStore: state.admin.page,
    limitFromStore: state.admin.limit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: (page, limit, sortBy, sortOrder, keyword, roleId) =>
      dispatch(
        actions.fetchAllUsersStart(
          page,
          limit,
          sortBy,
          sortOrder,
          keyword,
          roleId
        )
      ),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
