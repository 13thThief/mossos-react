const API = import.meta.env.VITE_APP_API;

import React, { useState } from "react";
import MenuSlide from 'react-burger-menu/lib/menus/slide'
import { useHistory, useParams, Link } from 'react-router-dom';
import Loader from '@components/common/Loader';
import axios from '@utils/api';

const Menu = ({setToken, token}) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
    <Loader show={isLoading} />
    <MenuSlide
      styles={ styles }
      width={280}
      isOpen={isOpen}
      onStateChange={state => setIsOpen(state.isOpen)}
      bodyClassName={ 'loader-open' }
    >
      <h1 className="text-green-500">Mossos</h1>
      {!token && <Link to="/signup" onClick={() => setIsOpen(false)} className="text-white menu-item">Sign up</Link>}
      <Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link>
      <Link to="/kitchen" onClick={() => setIsOpen(false)} className="menu-item">Kitchens</Link>
      {token && <Link to="/orders" onClick={() => setIsOpen(false)} className="menu-item">My Orders</Link>}
      {token && <Link to="/profile" onClick={() => setIsOpen(false)}> My Account</Link>}
      {token && <button onClick={() => {setIsOpen(false); setIsLoading(true); logout(setIsLoading, setToken, history)}} className="menu-item text-yellow-500">Logout</button>}
      
    </MenuSlide>
    </>
  )
}

function logout(setIsLoading, setToken, history) {
  localStorage.removeItem('user');
  setToken(undefined);
  axios.get(`${API}/logout`)
  .then(() => { setIsLoading(false)})
  .catch(e => { setIsLoading(false)})
  .finally(() => { history.replace('/menu')})
}

const styles = {
  bmBurgerButton: {
    position: 'relative',
    width: '20px',
    height: '18px',
    padding: '3px',
    left: '16px',
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    top: 0,
    transition: 'all 0.2s ease 0s'

  },
  bmMenu: {
    background: '#171717',
    padding: '2.5rem 1.5rem 0',
    fontSize: '1.15rem',
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8rem'
  },
  bmItem: {
    display: 'block',
    padding: '0.8rem',
    paddingLeft: '0.5rem'
  },
  bmOverlay: {
    background: 'rgba(1, 0, 0, 0.5)',
    top: 0,
    transition: 'opacity 0.1s ease-in-out 0s, transform 0s ease 0s'
  }
}

export default Menu;