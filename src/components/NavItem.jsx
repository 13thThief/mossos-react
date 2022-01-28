import React from "react";
import { Link } from 'react-router-dom';

export default function NavItem({ href, color, isActive, children }) {
  let activeColor = 'bg-yellow-100 text-yellow-700';
  if(href === '/kitchen') activeColor = 'bg-purple-100 text-purple-600';
  if(color === 'veg'){
    activeColor = 'bg-green-100 text-green-700';
  } else if(color === 'nonveg'){
    activeColor = 'bg-red-100 text-red-700';
  }
  return (
    <li>
      <Link
        to={href}
        className={`block px-2 py-1 rounded-md ${isActive ? activeColor : ''}`}
      >
        {children}
      </Link>
    </li>
  )
}
