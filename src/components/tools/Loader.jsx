import React from "react";
import { useSelector } from "react-redux";

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    isLoading && (
      <div className="loader">
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
      </div>
    )
  );
};

export default Loader;
