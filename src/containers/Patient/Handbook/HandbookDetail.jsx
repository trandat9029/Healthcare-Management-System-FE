// src/containers/System/Handbook/HandbookDetail.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HandbookDetail.scss';
import _ from 'lodash';
import banner from '../../../assets/images/banner.jpg';
import { handleGetDetailHandbookById } from '../../../services/handbookService';
import { FormattedMessage } from 'react-intl';

class HandbookDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandbook: {},
    };
  }

  async componentDidMount() {
    if (this.props.match && this.props.match.params) {
      const id = this.props.match.params.id;

      const res = await handleGetDetailHandbookById(id);
      console.log('check res', res);

      if (res && res.errCode === 0 && res.data) {
        this.setState({
          dataHandbook: res.data,
        });
      }
    }
  }

  render() {
    const { dataHandbook } = this.state;

    const title = dataHandbook.name || '';
    const author = dataHandbook.author || 'BookingHealth';
    const date = dataHandbook.datePublish
      ? new Date(dataHandbook.datePublish).toLocaleDateString('vi-VN')
      : '';
    const contentHTML = dataHandbook.descriptionHTML || '';
    const coverImage = dataHandbook.image || banner;

   // src/containers/System/Handbook/HandbookDetail.js

    return (
      <div className="handbook-detail-page">   {/* đổi từ detail-specialty-container */}
        {/* Banner lớn phía trên */}
        <div
          className="hb-hero"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="hb-hero-overlay" />
          <div className="hb-hero-inner">
            <div className="hb-breadcrumb">
              <FormattedMessage id="patient.handbook.handbook-detail.homepage" /> {'>'} <FormattedMessage id="patient.handbook.handbook-detail.handbook" /> {'>'} {title}
            </div>
            <h1 className="hb-hero-title">{title}</h1>
          </div>
        </div>

        {/* Thân trang. chia 2 cột giống hình */}
        <div className="detail-specialty-body">
          {/* Cột trái */}
          <div className="hb-left">
            <div className="description-specialty">
              <img src={coverImage} alt={title} className="hb-main-image" />

              <h1 className="hb-article-title">{title}</h1>

              <div
                className="hb-article-content"
                dangerouslySetInnerHTML={{ __html: contentHTML }}
              />
            </div>
          </div>

          {/* Cột phải */}
          <div className="hb-right">
            <div className="hb-meta-box">
              <h3 className="hb-meta-title"><FormattedMessage id="patient.handbook.handbook-detail.title" /></h3>

              <div className="hb-meta-row">
                <span className="hb-meta-label"><FormattedMessage id="patient.handbook.handbook-detail.author" /></span>
                <span className="hb-meta-value">{author}</span>
              </div>

              <div className="hb-meta-row">
                <span className="hb-meta-label"><FormattedMessage id="patient.handbook.handbook-detail.date-publish" /></span>
                <span className="hb-meta-value">{date}</span>
              </div>

              <div className="hb-meta-row">
                <span className="hb-meta-label"><FormattedMessage id="patient.handbook.handbook-detail.label" /></span>
                <span className="hb-meta-value">{title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(HandbookDetail);
