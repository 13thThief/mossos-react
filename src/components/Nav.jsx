import React from "react";

export default function Nav({ children }) {
  return (
    <nav className="p-4 pt-2 bg-white sticky" style={{ top: '38px' }}>
      <ul className="flex justify-around space-x-2">
        {children}
      </ul>
    </nav>
  )
}
