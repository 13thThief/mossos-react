import React from "react";
import { Link } from "react-router-dom";

const buttonClass = "w-full flex-none text-lg leading-6 font-semibold py-3 px-6 border rounded-xl transition-colors duration-200"
const darkButton = buttonClass + " bg-gray-600 text-white border-transparent";

export default function Home() {
  const previouslogin = localStorage.getItem('login') === '1';
  
  return (
    <>
    <div className="flex justify-center items-center text-sm bg-black font-semibold text-white text-center h-10">
      <p>Mossos has shutdown. Thank you!</p>
      <p>Exclusively for Vasai (W). In selected areas only.</p>
      </div>
    <div className="h-1/2 px-4 bg-gray-20 overflow-hidden text-center">
      <div className="flex justify-center mt-20">
        <Link to="/" className="">
          <img title="Mossos" className="h-12 w-32" alt="Mossos" src="/images/mossos-logo.png" />
        </Link>
      </div>
      <h1 className="text-2xl leading-none font-extrabold tracking-tight text-gray-900 mt-8 mb-8">Ghar Ka Khana Aap Ke Ghar</h1>  
      <p className="text-sm px-4">Fresh. Delicious. Home-made</p>
      <p className="text-sm mb-5">food at your doorstep!</p>
      <div className="">
        <p className="text-md">Next Day Delivery</p>
        <p style={{fontSize: '16px'}} className="text-sm mx-auto w-64 mt-2 mb-8">This gives time for your home-chef to plan for your meal, pick fresh ingredients and serve it hot & fresh!</p>
      </div>
      <div className="flex flex-wrap space-y-4 sm:space-y-0 sm:space-x-4 text-center text-green-600">
        <Link
          to="/menu"
          className={ buttonClass + " bg-gray-40 border-green-600" + " text-green-600" }
        >
          Explore Menu
        </Link>
        <Link
          to="/login"
          className={ darkButton }
        >
          Log In
        </Link>
      </div>
    </div>
    </>
  );
}

function MemoIconNext() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={14} height={21} viewBox="10 400 500 50">
      <path transform="scale(1,-1) translate(0, -650)" fill="#37ab87" d="M396 219l-121-125c-12-13-13-34-1-46 11-12 31-11 44 2l184 191c13 14 14 34 2 46l-170 177c-12 12-32 11-45-2-12-13-13-34-1-46l124-129-379 0c-19 0-33-15-33-34 0-18 15-34 33-34l363 0z m76 57l1 1 0-1c0 0-1 0-1 0l0 0z" />
    </svg>
  )
}

const IconNext = React.memo(MemoIconNext)
