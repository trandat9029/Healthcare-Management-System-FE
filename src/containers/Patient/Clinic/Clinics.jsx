// src/containers/System/Clinic/Clinics.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Clinics.scss';
import { getAllClinicService } from '../../../services/clinicService';
import { withRouter } from 'react-router';

class Clinics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allClinics: [],
      keyword: '',
    };
  }

  async componentDidMount() {
    const res = await getAllClinicService({ limit: 'ALL' });
    console.log('check res ', res);

    if (res && res.errCode === 0) {
      this.setState({
        allClinics: res.data ? res.data : [],
      });
    }
  }

  handleViewDetail = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${item.id}`);
    }
  };

  render() {
    const { allClinics, keyword } = this.state;

    // Lọc theo từ khóa
    const filtered = allClinics.filter((item) =>
      (item.name || '').toLowerCase().includes(keyword.toLowerCase())
    );

    return (
      <div className="clinics-page">
        {/* breadcrumb */}
        <div className="breadcrumb">
          <i className="fa-solid fa-house"></i> / Phòng khám
        </div>

        {/* ô tìm kiếm */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm tên phòng khám"
            value={keyword}
            onChange={(e) => this.setState({ keyword: e.target.value })}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        {/* lưới phòng khám */}
        <div className="clinic-grid">
          {filtered.length > 0 &&
            filtered.map((item, index) => (
              <div
                key={item.id || index}
                className="clinic-item"
                onClick={() => this.handleViewDetail(item)}
              >
                <div
                  className="clinic-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="clinic-name">{item.name}</div>
              </div>
            ))}

          {filtered.length === 0 && (
            <div className="no-result">Không tìm thấy phòng khám phù hợp</div>
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

export default withRouter(connect(mapStateToProps)(Clinics));
