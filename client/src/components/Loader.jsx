import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className=" border-[6px] border-[#f3f3f3] border-t-[#3498db] rounded-[50%] w-10 h-10 animate-spin "></div>
    </div>
  );
};

export default Loader;
