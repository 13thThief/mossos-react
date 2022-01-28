const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";

import {Helmet} from 'react-helmet-async';

import Spinner from '@components/common/Spinner';
import MHeader from '@components/common/MainHeader';
import Kitchen from '@components/Kitchen';
import Menus from '@components/Menus';
import CartCTA from '@components/common/FooterCTA';
import Nav from '@components/Nav';
import NavItem from '@components/NavItem';

// import {parse} from 'query-string';

export default function Wrapper({ location, token, setToken, helmet, children }) {
  const [items, setItems] = useState(() => {
    let cart = localStorage.getItem('cart');
    if(!cart) return 0;
    return Object.keys(JSON.parse(cart)).length
  });
  const p = new URLSearchParams(window.location.search);
  // let foodType = parse(location.search);
  let foodType = Object.fromEntries(p.entries());

  return (
    <>
      <Helmet>
        <title>{ location.pathname === '/kitchen' ? 'Kitchen' : 'Menu'}</title>
      </Helmet>
      <MHeader setToken={setToken} token={token}/>
      <Nav>
        <NavItem href="/menu" color={'all'} isActive={ location.pathname === '/menu' && !('veg' in foodType) }>Menu</NavItem>
        <NavItem href="/kitchen" color={'other'} isActive={ location.pathname === '/kitchen' }>Kitchens</NavItem>
        <NavItem href="menu?veg=1" color={'veg'} isActive={foodType.veg === '1'}>Veg</NavItem>
        <NavItem href="menu?veg=0" color={'nonveg'} isActive={foodType.veg === '0'}>Non Veg</NavItem>
      </Nav>
      {
        location.pathname === '/kitchen' ?
          <Kitchen location={location} setToken={setToken} />
          :
          <Menus location={location} setToken={setToken} /> 
      }
      
      <div style={{ height: '80px'}}></div>
      {
        Boolean(items) &&
        <CartCTA
          link="/cart"
          btnText={'View Bag'}
          mainContent={`${items} ${items === 1 ? 'item' : 'items'}`}
          kitchenId={localStorage.getItem('kitchenId')}
          subContent={localStorage.getItem('kitchen')}
        />
      }
    </>
  );
}


