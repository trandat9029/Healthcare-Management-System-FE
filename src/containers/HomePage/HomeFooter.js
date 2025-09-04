import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";


class HomeFooter extends Component {

    render() {
        return (
            <>
                <div className="home-footer">
                  <p>&copy; 2025 Onizuka. More information, please visit Onizuka. <a href="https://www.youtube.com/" target="_blank"> &#8594; Click here &#8592;</a></p>
                  
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
