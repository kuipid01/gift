import React from "react";
import "./loadind.css";
const Loadingshimmer = () => {
  return (
    <div className="card br flex relative border border-light  w-[calc(50%-10px)] md:w-[calc(33.3333%-20px)] flex-col justify-between h-[350px] md:h-[500px]">
      <div className="wrapper py-3 flex flex-col justify-center items-center h-full">
        <div className="br profilePic w-[95%] h-4/5 relative animate"></div>
        <div className="comment br animate w-[95%] h-[30px]"></div>
        <div className="comment br animate w-[95%] h-[30px]"></div>
      </div>
    </div>
  );
};

export default Loadingshimmer;
