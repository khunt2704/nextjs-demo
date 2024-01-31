import React from "react";
// import Image from "next/future/image";
import notfound from "../assets/images/404img.png"
const No_Found = () => {
  return (
    <div className="backgound_body">
      <div className="all_error_contents">
        <div className="images">
          <img src={notfound} alt=""/>
          <h3>Page Not Found</h3>
          <p>The page you are looking does not seem to exist.</p>
        </div>
      </div>
    </div>
  );
};

export default No_Found;
