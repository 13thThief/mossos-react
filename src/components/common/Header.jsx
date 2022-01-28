import React from "react";

const Header = ({ history, content, noOfItems }) => (
  <header className="sticky w-full top-0 outline-0" style={{ zIndex: 0}}>
    <div className="flex flex-row items-center h-12 bg-white">
      <button className="p-3 h-12 w-12 outline-0 focus:outline-none" type="button" onClick={history.goBack}>
        <IconBack />
      </button>
      {
        noOfItems ?
        <p className="flex-1 ml-4">{content}<span>{`(${noOfItems})`}</span></p>
        :
        <h2 className="">{content}</h2>
      }
    </div>
  </header>
);

function MemoIconBack() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
      <g fill="none" fillRule="evenodd">
        <path stroke="#FFF" strokeOpacity=".02" strokeWidth=".1" d="M1 1h24v24H1z"></path>
        <path fill="#000" fillRule="nonzero" d="M19.125 12.125H9.351l4.272-4.272a.872.872 0 0 0-.002-1.236.879.879 0 0 0-1.24.002l-5.674 5.674a1 1 0 0 0 0 1.414l5.676 5.676a.872.872 0 0 0 1.234-1.234l-4.266-4.274h9.774a.875.875 0 1 0 0-1.75z"></path>
      </g>
    </svg>
  )
}

const IconBack = React.memo(MemoIconBack)

export default Header;
