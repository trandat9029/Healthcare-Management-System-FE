import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";


class About extends Component {

    render() {
        return (
            <>
                <div className="section-share section-about">
                  <div className="section-about-header">
                    Truyền thông nói gì về Onizuka
                  </div>
                  <div className="section-about-content">
                    <div className="content-left">
                      <iframe width="100%" height="400" 
                        src="https://www.youtube.com/embed/bs1oTjF91P0" 
                        title="REWIND TUỔI THƠ | GREAT TEACHER ONIZUKA - THẦY GIÁO GIANG HỒ &amp; LŨ HỌC SINH BÁO ĐỜI!" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen>
                      </iframe>
                    </div>
                    <div className="content-right">
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum repellat nisi repudiandae distinctio omnis fuga quam perspiciatis porro dolorum culpa, obcaecati quidem reprehenderit inventore autem. Modi ab perferendis illo aliquid.
                      </p>
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
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
