import React from "react";

const Button = ({ onClick, children }) => (
  <div>
    <button onClick={onClick}>{children}</button>
  </div>
)

export default Button;