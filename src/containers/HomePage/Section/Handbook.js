import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";


class Handbook extends Component {

  render() {
    return (
      <>
        <div className="section-share section-handbook">  
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">Cẩm nang</span>
              <button className="btn-section">xem thêm</button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings} >
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 1</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 2</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 3</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 4</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 5</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 6</h3>
                </div>
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
    

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);



// import React, { Component } from "react";
// import { connect } from "react-redux";
// import "./Handbook.scss";
// import Slider from "react-slick";
// import { getAllSpecialtyService } from "../../../services/userService";
// import { FormattedMessage } from "react-intl";
// import { withRouter } from "react-router";

// class Handbook extends Component {

//   constructor(props){
//     super(props);
//     this.state = {
//       dataHandbook: [],
//     }
//   }
  
//   async componentDidMount(){
//     let res = await getAllSpecialtyService();
//     if(res && res.errCode === 0){
//       this.setState({
//         dataHandbook: res.data ? res.data : [],
//       })
//         console.log('check data: ', this.state);
//     }
//   }
  
//   // handleViewDetailSpecialty = (item) =>{
//   //   if(this.props.history){
//   //     this.props.history.push(`/detail-specialty/${item.id}`);
//   //   }
//   // }

//  render() {
//     let { dataHandbook } = this.state;

//     return (
//       <>
//         <div className="section-share section-handbook">
//           <div className="section-container">
//             <div className="section-header">
//               <span className="title-section">
//                 <FormattedMessage id="homepage.specialty-popular" />
//               </span>
//               <button className="btn-section">
//                 <FormattedMessage id="homepage.more-info" />
//               </button>
//             </div>
//             <div className="section-body">
//               <Slider {...this.props.settings} >
//                 {dataHandbook && dataHandbook.length > 0 &&
//                   dataHandbook.map((item, index) =>{
//                     return (
//                         <div 
//                           className="section-customize specialty-child" 
//                           key={index}
//                           onClick={() => this.handleViewDetailSpecialty(item)}
//                         >
//                           <div 
//                             className="bg-image section-specialty"
//                             style={{ backgroundImage: `url(${item.image})` }}
//                           ></div>
//                           <h3 className="specialty-name">{item.name}</h3>
//                       </div>
//                     )
//                   })
//                 }

//               </Slider>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     isLoggedIn: state.user.isLoggedIn,
//     language: state.app.language

//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//   };
// };

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Handbook));
