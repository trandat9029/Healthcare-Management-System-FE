import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Handbooks.scss';
import { handleGetListPostHandbook } from '../../../services/handbookService';
import { FormattedMessage } from 'react-intl';

class Handbooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handbooks: [],
      keyword: '',
    };
  }

  async componentDidMount() {
    const res = await handleGetListPostHandbook();
    console.log('check res ', res);

    if (res && res.errCode === 0) {
      this.setState({
        handbooks: res.data || [],
      });
    }
  }

  handleViewDetail = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${item.id}`);
    }
  };

  render() {
    const { handbooks, keyword } = this.state;

    const filtered = handbooks.filter((item) => {
      const title = (item.title || item.name || '').toLowerCase();
      return title.includes(keyword.toLowerCase());
    });

    return (
      <div className="handbooks-page">
        {/* breadcrumb */}
        <div className="breadcrumb">
          <i className="fa-solid fa-house"></i> / <FormattedMessage id="patient.handbook.handbook" />
        </div>

        {/* ô tìm kiếm */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm bài viết"
            value={keyword}
            onChange={(e) => this.setState({ keyword: e.target.value })}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        {/* lưới bài viết */}
        <div className="handbook-grid">
          {filtered.length > 0 &&
            filtered.map((item) => {
              const title = item.title || item.name || '';
              const shortDesc =
                item.description || item.shortDescription || item.contentHTML || '';

              return (
                <div
                  key={item.id}
                  className="handbook-item"
                  onClick={() => this.handleViewDetail(item)}
                >
                  <div
                    className="handbook-image"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="handbook-body">
                    <h3 className="handbook-title">{title}</h3>
                    {shortDesc && (
                      <p className="handbook-desc">
                        {shortDesc.length > 110
                          ? shortDesc.slice(0, 110) + '...'
                          : shortDesc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

          {filtered.length === 0 && (
            <div className="no-result"><FormattedMessage id="patient.handbook.no-result" /></div>
          )}
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

export default withRouter(connect(mapStateToProps)(Handbooks));
