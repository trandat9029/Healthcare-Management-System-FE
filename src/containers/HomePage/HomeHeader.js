import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./HomeHeader.scss";
import logo from "../../assets/logo.svg";
import { LANGUAGES } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions";
import { withRouter } from "react-router";
import { MAIN_NAV_LINKS } from "./navLink";
import { getAllSpecialtyService } from "../../services/specialtyService"; // add

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      specialties: [],
      suggestions: [],
      isOpenSuggest: false,
    };
    this._debounceTimer = null;
  }

  async componentDidMount() {
    // Fetch once for searching
    const res = await getAllSpecialtyService({ limit: 999 });
    if (res && res.errCode === 0) {
      const list = res.specialties || [];
      this.setState({ specialties: list });
    }

    // close dropdown when clicking outside
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    // Close when click outside the search box area
    if (!e.target.closest(".header-specialty-search")) {
      this.setState({ isOpenSuggest: false });
    }
  };

  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };

  handleNavigate = (to) => {
    const { history } = this.props;
    if (history) {
      history.push(to);
    }
  };

  isActiveLink = (link) => {
    const { location } = this.props;
    if (!location) return false;

    const currentPath = location.pathname;

    if (link.key === "home") {
      return currentPath === "/" || currentPath === "/home";
    }

    return link.matchPaths.some((p) => currentPath.startsWith(p));
  };

  scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  normalize = (s = "") =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  handleSearchChange = (e) => {
    const keyword = e.target.value;

    this.setState({ keyword, isOpenSuggest: true });

    if (this._debounceTimer) clearTimeout(this._debounceTimer);

    this._debounceTimer = setTimeout(() => {
      const kw = this.normalize(keyword);
      if (!kw) {
        this.setState({ suggestions: [] });
        return;
      }

      const suggestions = this.state.specialties
        .filter((sp) => this.normalize(sp.name).includes(kw))
        .slice(0, 8);

      this.setState({ suggestions });
    }, 200);
  };

  handleSelectSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
      this.setState({
        keyword: "",
        suggestions: [],
        isOpenSuggest: false,
      });
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const first = this.state.suggestions[0];
      if (first) this.handleSelectSpecialty(first);
    }
    if (e.key === "Escape") {
      this.setState({ isOpenSuggest: false });
    }
  };

  render() {
    const language = this.props.language;
    const { keyword, suggestions, isOpenSuggest } = this.state;

    return (
      <>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fa-solid fa-bars"></i>
              <img
                className="header-logo"
                src={logo}
                alt="logo"
                onClick={this.returnToHome}
              />
            </div>

            <div className="center-content">
              {MAIN_NAV_LINKS.map((link) => (
                <div
                  key={link.key}
                  className={
                    this.isActiveLink(link)
                      ? "child-content active"
                      : "child-content"
                  }
                  onClick={() => this.handleNavigate(link.to)}
                >
                  <h4>
                    <b>
                      <FormattedMessage id={link.titleId} />
                    </b>
                  </h4>
                  <p className="subs-desc">
                    <FormattedMessage id={link.subId} />
                  </p>
                </div>
              ))}
            </div>

            <div className="right-content">
              <div className="support">
                <i className="fa-solid fa-circle-question"></i>
                <FormattedMessage id="homeHeader.support" />
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                  VI
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>

        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="banner.title2" />
              </div>

              {/* UPDATED SEARCH UI */}
              <div className="search header-specialty-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  value={keyword}
                  onChange={this.handleSearchChange}
                  onKeyDown={this.handleKeyDown}
                  placeholder="Tìm chuyên khoa khám bệnh"
                  onFocus={() => this.setState({ isOpenSuggest: true })}
                />

                {isOpenSuggest && suggestions.length > 0 && (
                  <div className="search-suggest">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="suggest-item"
                        onClick={() => this.handleSelectSpecialty(item)}
                      >
                        <span className="suggest-name">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {isOpenSuggest && keyword.trim() && suggestions.length === 0 && (
                  <div className="search-suggest">
                    <div className="suggest-empty">Không tìm thấy chuyên khoa</div>
                  </div>
                )}
              </div>
            </div>

            <div className="content-down">
              <div className="options">
                <div
                  className="option-child"
                  onClick={() => this.scrollToSection("section-specialty")}
                >
                  <div className="icon-child">
                    <i className="fa-solid fa-stethoscope"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child2" />
                  </div>
                </div>

                <div
                  className="option-child"
                  onClick={() => this.scrollToSection("section-medical-facility")}
                >
                  <div className="icon-child">
                    <i className="fa-solid fa-hospital"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child3" />
                  </div>
                </div>

                <div
                  className="option-child"
                  onClick={() => this.scrollToSection("section-handbook")}
                >
                  <div className="icon-child">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child4" />
                  </div>
                </div>

                <div
                  className="option-child"
                  onClick={() => this.scrollToSection("section-outstanding-doctor")}
                >
                  <div className="icon-child">
                    <i className="fa-solid fa-user-doctor"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child5" />
                  </div>
                </div>

                <div
                  className="option-child"
                  onClick={() => this.scrollToSection("section-about")}
                >
                  <div className="icon-child">
                    <i className="fa-solid fa-circle-question"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
