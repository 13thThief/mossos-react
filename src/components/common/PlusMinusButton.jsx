import React from "react";

const PlusMinusButton = ({ quantity, id, onClick }) => (
  <div className="w-28 flex h-8 justify-items content-center items-center rounded border border-solid">
    <button name={id} onClick={e => onClick(e, false)} className="h-8 flex-1 focus:outline-none">-</button>
    <button className="h-8 flex-1 focus:outline-none">{quantity}</button>
    <button name={id} onClick={e => onClick(e, true)} className="h-8 flex-1 focus:outline-none">+</button>
  </div>
)

export default PlusMinusButton;