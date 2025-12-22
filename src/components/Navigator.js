import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./Navigator.scss";

class Navigator extends Component {
  state = {
    expandedMenu: {},
  };

  toggle = (index) => {
    this.setState((prev) => {
      const expandedMenu = {};
      const needExpand = !prev.expandedMenu[index];
      if (needExpand) {
        expandedMenu[index] = true;
      }
      return { expandedMenu };
    });
  };

  render() {
    const { menus, onLinkClick, location } = this.props;
    const { expandedMenu } = this.state;

    return (
      <Fragment>
        <ul className="navigator-menu list-unstyled">
          {menus.map((item, index) => {
            const hasSub = item.menus && item.menus.length > 0;
            const isOpen = !!expandedMenu[index];

            const isActive =
              location &&
              (location.pathname === item.link ||
                (hasSub &&
                  item.menus.some((m) => m.link === location.pathname)));

            return (
              <li
                key={index}
                className={
                  "menu-group" +
                  (isOpen ? " open" : "") +
                  (isActive ? " active" : "")
                }
              >
                {/* hàng chính: icon + text + nút submenu */}
                <div className="menu-group-name">
                  <Link
                    to={item.link}
                    className="menu-main-link"
                    onClick={onLinkClick}
                  >
                    {item.icon && <i className={`menu-icon ${item.icon}`} />}
                    <FormattedMessage id={item.name} />
                  </Link>

                  {hasSub && (
                    <button
                      type="button"
                      className="menu-toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.toggle(index);
                      }}
                    >
                      <i
                        className={
                          isOpen ? "fa-solid fa-minus" : "fa-solid fa-plus"
                        }
                      />
                    </button>
                  )}
                </div>

                {/* submenu nếu có */}
                {hasSub && (
                  <ul
                    className={
                      "menu-list list-unstyled" + (isOpen ? " open" : "")
                    }
                  >
                    {item.menus.map((sub, subIndex) => {
                      const isSubActive =
                        location && location.pathname === sub.link;

                      return (
                        <li
                          key={subIndex}
                          className={"menu" + (isSubActive ? " active" : "")}
                        >
                          <Link
                            to={sub.link}
                            className="menu-link"
                            onClick={onLinkClick}
                          >
                            <FormattedMessage id={sub.name} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigator)
);
