import React from "react";
import { Link } from 'react-router-dom';

const FooterCTA = ({ btnText, mainContent, subContent, kitchenId, link}) => (
  <div
    className="fixed bottom-0 left-0 w-full"
    style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -4px 4px 0px" }}
  >
    <div
      className="flex justify-between bg-white"
      style={{
        padding: "10px 10px 10px 16px",
        boxShadow: "0 0 3px 0 rgba(0,0,0,.19)",
      }}
    >
      <div className="flex flex-col justify-center">
        <p className="font-semibold text-xl">{mainContent}</p>
        {
          kitchenId ?
          <p className="text-sm underline"><Link to={`/kitchen/${kitchenId}`}>{subContent}</Link></p>
          :
          subContent ? <p className="text-sm">{subContent}</p> : null
        }
      </div>
      <Link to={link}>
        <button
          className="text-sm flex items-center bg-gray-800 rounded-md text-white font-semibold uppercase"
          type="button"
          style={{
            padding: "12px 15px",
            width: "170px",
            height: "49px",
            justifyContent: "space-evenly",
          }}
        >
          {btnText}
          <IconNext />
        </button>
      </Link>
    </div>
  </div>
);

function MemoIconNext() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={14} height={21} viewBox="10 400 500 50">
      <path transform="scale(1,-1) translate(0, -650)" fill="#ffffff" d="M396 219l-121-125c-12-13-13-34-1-46 11-12 31-11 44 2l184 191c13 14 14 34 2 46l-170 177c-12 12-32 11-45-2-12-13-13-34-1-46l124-129-379 0c-19 0-33-15-33-34 0-18 15-34 33-34l363 0z m76 57l1 1 0-1c0 0-1 0-1 0l0 0z" />
    </svg>
  )
}

const IconNext = React.memo(MemoIconNext)

export default FooterCTA;