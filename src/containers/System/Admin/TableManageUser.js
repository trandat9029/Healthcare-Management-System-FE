import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";
import UserRedux from "./UserRedux";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils/constant";

class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "DESC",

            showUserModal: false,
            modalAction: CRUD_ACTIONS.CREATE,
            selectedUser: null,
        };
    }

    async componentDidMount() {
        const { page, limit, sortBy, sortOrder } = this.state;
        await this.props.fetchUserRedux(page, limit, sortBy, sortOrder);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listUsers !== this.props.listUsers) {
        this.setState({
            userRedux: this.props.listUsers,
        });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id);
    };

    // mở modal tạo mới
    openCreateUserModal = () => {
        this.setState({
        showUserModal: true,
        modalAction: CRUD_ACTIONS.CREATE,
        selectedUser: null,
        });
    };

    // mở modal edit
    openEditUserModal = (user) => {
        this.setState({
            showUserModal: true,
            modalAction: CRUD_ACTIONS.EDIT,
            selectedUser: user,
        });
    };

    // đóng modal
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

        if (type === "prev" && page > 1) {
            newPage = page - 1;
        }

        if (type === "next" && page < totalPages) {
            newPage = page + 1;
        }

        if (newPage !== page) {
            this.setState(
                {
                page: newPage,
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
        }
    };

    handleSort = (field) => {
        const { sortBy, sortOrder } = this.state;
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

    render() {
        const { userRedux, page, limit, showUserModal, modalAction, selectedUser } =
        this.state;
        const { totalUsers, language } = this.props;

        const arrUsers = userRedux || [];
        const totalPages = Math.ceil((totalUsers || 0) / limit) || 1;

        return (
        <>
            <div className="users-container">
                <div className="title text-center">
                    <FormattedMessage id="admin.manage-user.title" />
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
                            onClick={this.openCreateUserModal}
                        >
                            Thêm người dùng
                        </button>
                    </div>
                </div>

                <div className="users-table mt-3 mx-1">
                    <table>
                    <tbody>
                        <tr>
                        <th onClick={() => this.handleSort("email")}>
                            Email{this.renderSortLabel("email")}
                        </th>
                        <th onClick={() => this.handleSort("firstName")}>
                            First name{this.renderSortLabel("firstName")}
                        </th>
                        <th onClick={() => this.handleSort("lastName")}>
                            Last name{this.renderSortLabel("lastName")}
                        </th>
                        <th>Address</th>
                        <th onClick={() => this.handleSort("roleId")}>
                            Vai trò{this.renderSortLabel("roleId")}
                        </th>
                        <th onClick={() => this.handleSort("createdAt")}>
                            Created at{this.renderSortLabel("createdAt")}
                        </th>
                        <th>Actions</th>
                        </tr>

                        {arrUsers && arrUsers.length > 0 ? (
                        arrUsers.map((item, index) => {
                            console.log('check item: ', item);
                            
                            return (
                            <tr key={index}>
                                <td>{item.email}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.address}</td>
                                <td>{language === LANGUAGES.VI ?  item.roleData.valueVi : item.roleData.valueEn}</td>
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
                            <td colSpan="6" style={{ textAlign: "center" }}>
                            No users found
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
                        Prev
                    </button>
                    <span>
                        Page {page} of {totalPages} . Total {totalUsers || 0} users
                    </span>
                    <button
                        className="btn btn-light mx-2"
                        onClick={() => this.handleChangePage("next")}
                        disabled={page >= totalPages}
                    >
                        Next
                    </button>
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
    fetchUserRedux: (page, limit, sortBy, sortOrder) =>
      dispatch(actions.fetchAllUsersStart(page, limit, sortBy, sortOrder)),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
