import React from "react";
// import HomeHeader from "./../";
// import HomeFooter from "./HomePage/HomeFooter";

import './ClientLayout.scss'
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";

const ClientLayout = ({ children, showBanner }) => {
  return (
    <>
      <HomeHeader isShowBanner={showBanner} />
      {children}
      <HomeFooter />
    </>
  );
};

export default ClientLayout;
