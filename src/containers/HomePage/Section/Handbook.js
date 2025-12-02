import React, { Component } from "react";
import { connect } from "react-redux";
import "./Handbook.scss";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { handleGetListPostHandbook } from "../../../services/handbookService";

class Handbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandbook: [],
    };
  }

  async componentDidMount() {
    // có thể truyền page, limit nếu cần, tạm để backend tự default
    let res = await handleGetListPostHandbook();
    if (res && res.errCode === 0) {
      this.setState({
        dataHandbook: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailHandbook = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${item.id}`);
    }
  };

  handleViewMoreHandbooks = () => {
    if (this.props.history) {
      this.props.history.push(`/handbooks`);
    }
  };

  render() {
    let { dataHandbook } = this.state;

    return (
      <>
        <div className="section-share section-handbook">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">
                {/* nếu bạn có text riêng cho handbook thì đổi id lại */}
                <FormattedMessage id="homepage.handbook" defaultMessage="Cẩm nang" />
              </span>
              <button
                className="btn-section"
                onClick={this.handleViewMoreHandbooks}
              >
                <FormattedMessage id="homepage.more-info" />
              </button>
            </div>

            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataHandbook &&
                  dataHandbook.length > 0 &&
                  dataHandbook.map((item, index) => {
                    const title = item.title || item.name || "Handbook";
                    const thumb = item.image;

                    return (
                      <div
                        className="section-customize handbook-child"
                        key={index}
                        onClick={() => this.handleViewDetailHandbook(item)}
                      >
                        <div className="handbook-card">
                          <div className="handbook-img-wrapper">
                            <img src={thumb} alt={title} />
                          </div>
                          <div className="handbook-info">
                            <h3 className="handbook-title">{title}</h3>
                            {/* nếu có field mô tả ngắn thì show thêm ở đây */}
                            {/* <p className="handbook-desc">{item.shortDescription}</p> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        </div>
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
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Handbook));
