import React from "react";
import { Link } from 'react-router-dom';

const ImgLemonade = "/images/lemonade.svg";

export default function FourOhFour() {
  return (
    <div style={{backgroundImage: "linear-gradient(135deg, #684ca0 35%, #1c4ca0 100%)"}} className="text-white min-h-screen flex items-center">
      <div className="container mx-auto p-4 flex flex-wrap items-center">
        <div className="w-full md:w-5/12 text-center p-4">
          <img src={ImgLemonade} alt="Not Found" />
        </div>
        <div className="w-full text-center p-4">
          <div className="text-6xl font-medium">404</div>
          <div className="text-xl md:text-3xl font-medium mb-2 mt-4">
            Your thirst for more knowledge couldn't be quenched
          </div>
          <span className="text-lg">Have some <Link to="/menu" className="underline">lemonade</Link> instead</span>
        </div>
      </div>
    </div>
  )
}