import React, { Component } from "react";
import { connect } from "react-redux";
import "./About.scss";

import vnexpress from "../../../assets/aboutus/vnexpress.png";
import vietnamnet from "../../../assets/aboutus/142415-logo-vnnet.png";
import vtcnews from "../../../assets/aboutus/165432-vtcnewslogosvg.png";
import suckhoedoisong from "../../../assets/aboutus/suckhoedoisong.png";
import vtv1 from "../../../assets/aboutus/vtv1.png";

class About extends Component {
  render() {
    const mediaLogos = [
      { id: 1, name: "VnExpress", src: vnexpress },
      { id: 2, name: "Vietnamnet", src: vietnamnet },
      { id: 3, name: "VTC News", src: vtcnews },
      { id: 4, name: "Sức khỏe & Đời sống", src: suckhoedoisong },
      { id: 5, name: "VTV1", src: vtv1 },
      { id: 6, name: "VnExpress 2", src: vnexpress },
    ];
    // sau này bạn chỉ cần thay src thành ảnh thật là được

    return (
      <>
        <div className="section-share section-about">
          <div className="section-about-header">
            Truyền thông nói gì về BookingHealth
          </div>

          <div className="section-about-content">
            <div className="content-left">
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/FyDQljKtWnI"
                  title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="content-right">
              <div className="media-grid">
                {mediaLogos.map((item) => (
                  <div className="media-item" key={item.id}>
                    <img src={item.src} alt={item.name} />
                  </div>
                ))}
              </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
