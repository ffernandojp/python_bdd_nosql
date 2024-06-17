import React from "react";
import HeroForm from "../components/common/HeroForm";

const Add_Hero = () => {
  return (
    <>
      <div className="min-h-screen bg-green-900">
        <h1 className="text-3xl font-bold text-white">Add Hero</h1>
        <div>{<HeroForm />}</div>
      </div>
    </>
  );
};

export default Add_Hero;
