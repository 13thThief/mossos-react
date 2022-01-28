import React from "react";
import { Link } from 'react-router-dom';

import SideBar from './SideBar';

const MainHeader = ({ history, content, token, setToken }) => (
  <header className="sticky w-full top-0 outline-0" style={{ zIndex: 1}}>
    <div className="flex flex-row items-center h-12 bg-white">
      <SideBar setToken={setToken} token={token}/>
      <Link to="/" className="ml-6 flex-1 text-gray-700 text-lg outline-0">
        <img title="Mossos" className="h-8 w-32" alt="Mossos" src="/images/mossos-logo.png" />
      </Link>
      {!token && <Link to="/login" className="mr-6 font-bold">Login</Link>}
    </div>
  </header>
);

export default MainHeader;
