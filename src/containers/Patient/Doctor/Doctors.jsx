// src/containers/System/Doctor/Doctors.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Doctors.scss';
import { getTopDoctorHomeService } from '../../../services/doctorService';

class Doctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDoctors: [],
      keyword: '',
    };
  }

  async componentDidMount() {
    // lấy tối đa 12 bác sĩ
    const res = await getTopDoctorHomeService(12);
    console.log('check res ', res);

    if (res && res.errCode === 0) {
      this.setState({
        allDoctors: res.data || [],
      });
    }
  }

  handleViewDetail = (item) => {
    if (this.props.history) {
      // nếu có trang detail bác sĩ riêng thì sửa lại path ở đây
      this.props.history.push(`/detail-doctor/${item.id}`);
    }
  };

  render() {
    const { allDoctors, keyword } = this.state;

    // build tên hiển thị
    const filterByKeyword = (doctor) => {
      const fullName = `${doctor.lastName || ''} ${doctor.firstName || ''}`.trim();
      return fullName.toLowerCase().includes(keyword.toLowerCase());
    };

    const listToShow = allDoctors.filter(filterByKeyword);

    return (
      <div className="doctors-page">
        {/* breadcrumb */}
        <div className="breadcrumb">
          <i className="fa-solid fa-house"></i> / Bác sĩ
        </div>

        {/* ô tìm kiếm */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm tên bác sĩ"
            value={keyword}
            onChange={(e) => this.setState({ keyword: e.target.value })}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        {/* lưới bác sĩ */}
        <div className="doctor-grid">
          {listToShow.length > 0 &&
            listToShow.map((item) => {
              const fullName = `${item.lastName || ''} ${item.firstName || ''}`.trim();
              return (
                <div
                  key={item.id}
                  className="doctor-item"
                  onClick={() => this.handleViewDetail(item)}
                >
                  <div
                    className="doctor-image"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="doctor-name">{fullName}</div>
                </div>
              );
            })}

          {listToShow.length === 0 && (
            <div className="no-result">Không tìm thấy bác sĩ phù hợp</div>
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

export default withRouter(connect(mapStateToProps)(Doctors));
