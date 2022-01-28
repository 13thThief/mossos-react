const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import '../../src/App.css';
import {Helmet} from 'react-helmet-async';

import axios from '@utils/api';

import { useHistory, useParams, Link } from 'react-router-dom';

import CartCTA from '@components/common/FooterCTA';
import Header from '@components/common/Header';
import MainHeader from '@components/common/MainHeader';

import Spinner from '@components/common/Spinner';

const ImgVeg = "/images/veg.png";
const ImgNonVeg = "/images/nonveg.png";
const ImgDefaultMenu = "/images/meal2.svg";
const ImgDefaultKitchen = "/images/kitchen.png";

function resetLocalStorage() {
  localStorage.removeItem('cart');
  localStorage.removeItem('kitchenId');
  localStorage.removeItem('kitchen');
}

const addButtonClass = "focus:none bg-gray-800 px-3 mt-8 uppercase font-semibold text-sm h-8 rounded-md py-1 text-white";
const removeButtonClass = "focus:none border px-3 mt-8 uppercase font-semibold text-sm h-8 rounded-md border-gray-500 py-1";

export default function SpecificMenu({ setToken, token }) {

  const { menuId } = useParams();
  const history = useHistory();

  const [buttonMenu, setButtonMenu] = useState({});
  const [menu, setMenu] = useState(null);
  const [isMenuInCart, setIsMenuInCart] = useState(false);
  const [amount, setAmount] = useState(0);
  const [cart, setCart] = useState(() => {
    let cart = localStorage.getItem('cart');
    if(!cart) return {};
    try {
      cart = JSON.parse(cart);
      return cart;
    } catch {
      resetLocalStorage();
    }
  })
  const [items, setItems] = useState(() => {
    let cart = localStorage.getItem('cart');
    if(!cart) return 0;
    try {
      cart = JSON.parse(cart);
      return Object.keys(cart).length
    } catch {
      resetLocalStorage();
    }
  });

  useEffect(() => {
    getSpecificMenu();

    let cart = localStorage.getItem('cart');
    if(cart){
      try {
        cart = JSON.parse(cart);
      } catch {
        console.log('parse error')
        return;
      }
      let amount = Object.values(cart).reduce((acc, menu) => (acc + menu.price), 0);
      if(menuId in cart){
        setAmount(menu?.price || 0);
        setIsMenuInCart(true);
      }
    }
  }, [menuId]);

  function addToBag(e) {
    const kitchenId = localStorage.getItem('kitchenId');
    if(kitchenId && kitchenId !== menu?.kitchens?.id){
      alert('You can only order from one kitchen at a time. Please remove current items from bag');
      return;
    }

    let menuId = e.target.id;
    let cart = localStorage.getItem('cart');
    if(cart){
      try {
        cart = JSON.parse(cart);
      } catch {
        resetLocalStorage();
      }
      if(cart[menuId]){
        return;
      }
    }

    if(!cart) cart = {};
    cart[menuId] = { quantity: 1, price: menu.price };
    setAmount(amount + menu.price);
    setItems(items => items + 1);
    setIsMenuInCart(true);
    localStorage.setItem('kitchenId', menu.kitchens?.id);
    localStorage.setItem('kitchen', menu.kitchens?.name);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function removeFromBag(e) {
    let menuId = e.target.id;
    let cart = localStorage.getItem('cart');
    try {
      cart = JSON.parse(cart);
    } catch {
      resetLocalStorage();
    }
    setAmount(amount - menu.price);
    delete cart[menuId];
    setIsMenuInCart(false);
    setItems(items => items - 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    if(!Object.keys(cart).length){
      localStorage.removeItem('kitchenId');
      localStorage.removeItem('kitchen')
    }
  }

    function changeQuantity(e, action){
      const { name } = e.target
      let cart = localStorage.getItem('cart');
      if(!cart){
        return;
      }

      cart = JSON.parse(cart);
      let quantity = cart[name]['quantity'];
      if(quantity === 1 && !action){
        delete cart[name];
        localStorage.setItem('cart', JSON.stringify(cart));
        if(!Object.keys(cart).length){
          localStorage.removeItem('kitchenId');
          localStorage.removeItem('kitchen')
        }
        setIsMenuInCart(false);
        setCart(cart);
        setItems(items => items - 1);
        return;
      }
      if(quantity === 10 && action){
        return;
      }
      if (action) cart[name]['quantity']++;
      else cart[name]['quantity']--;
      setCart(cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

  function getSpecificMenu() {
    axios.get(`${API}/menu/${menuId}`)
      .then(res => {
        return res.data;
      })
      .then((data) => {
        if(!data){
          history.replace('/404')
        } else setMenu(data);
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        }
      });
  };

  if(!menu){
    return <Spinner />
  }

  return (
    <>
      <Helmet>
        <title>{`${menu?.name} - Mossos`}</title>
      </Helmet>

      <MainHeader setToken={setToken} token={token}/>

      <Header
        history={history}
        content={menu?.name ? `${menu?.name} by ${menu?.kitchens?.name}` : 'Menu'}
      />

      <div className="grid grid-cols-1">
        <div className="col-start-1 row-start-1 px-4 pt-48 pb-3 bg-gradient-to-t from-black" style={{ zIndex: -1}}>
        </div>
        <div className="col-start-1 row-start-1 flex" style={{ zIndex: -2 }}>
          <div className="w-full grid grid-cols-3 grid-rows-2 gap-2">
            <div className="relative col-span-3 row-span-2">
              <img src={menu?.image || ImgDefaultMenu} alt={menu?.name} className="absolute inset-0 w-full h-full object-cover bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-col space-y-4 bg-gray-50">
        <div className="flex flex-row items-center">
          <img
            src={ menu?.veg ? ImgVeg : ImgNonVeg } alt={ menu?.veg ? '(Veg)' : '(Non-veg)' }
            className="inline-block w-18 h-18 rounded-lg object-cover bg-gray-100"
            width="20" height="20"
          />
          <p className="ml-2 font-semibold text-black tracking-tight">{menu?.name}
          </p>
          { menu.recommended && <span className="text-sm ml-2 py-1 px-2 border rounded" style={{ color: '#388e3c', borderColor: '#388e3c'}}>Recommended</span> }
        </div>
        <div className="flex items-center text-sm font-medium my-5">
          <p className="">{menu?.description}</p>
        </div>
        <div className="flex-none text-sm font-medium whitespace-pre">
          {
            menu.servings ?
            <><span>₹{menu.price} · </span><span className="text-gray-500">{menu.servings}</span></>
            :
            <span>₹{menu.price}</span>
          }
        </div>
        <AddRemoveButton
          id={menu?.id}
          className={ isMenuInCart ? removeButtonClass : addButtonClass }
          style={{outline: "currentcolor none medium", }}
          onClick={ isMenuInCart ? removeFromBag : addToBag }
          isMenuInCart={isMenuInCart}
          changeQuantity={changeQuantity}
          cart={cart}
        >
          { isMenuInCart ? <QuantityButton/> : 'Add To Bag' }
        </AddRemoveButton>
        {/*<PlusMinusButton />*/}
        <p className="text-gray-500">See more delicacies from <Link to={`/kitchen/${menu?.kitchens?.id}`} style={{color: '#388e3c'}}>{menu?.kitchens?.name}</Link></p>
        <div style={{ height: '140px'}}></div>
        {/*<Spinner />*/}
        {
          !!items
          &&
          <CartCTA
            kitchenId={localStorage.getItem('kitchenId') || false }
            kitchen={true}
            link="/cart"
            btnText={'View Bag'}
            mainContent={`${items} ${items === 1 ? 'item' : 'items'}`}
            subContent={localStorage.getItem('kitchen')}/>
          }    
      </div>
      </>
  );
}

const AddRemoveButton = ({ id, style, className, onClick, cart, isMenuInCart, changeQuantity }) => {
  if(isMenuInCart){
    let quantity = cart[id];
    return (
      <div className="w-24 h-8 flex justify-items content-center items-center rounded border border-solid shadow">
        <button name={id} onClick={e => {changeQuantity(e, false)}} className="flex-1 focus:outline-none">-</button>
        <button className="flex-1 focus:outline-none">{quantity ? quantity['quantity'] : 1}</button>
        <button name={id} onClick={e => {changeQuantity(e, true)}} className="flex-1 focus:outline-none">+</button>
      </div>
    )
  } else {
    return (
      <button
        id={id}
        style={style}
        className={className}
        onClick={onClick}
      >
      Add To Bag 
      </button>
    )
  }
  
}

const QuantityButton = () => (
  <div className="w-20 flex justify-items content-center items-center rounded border border-solid shadow">
    <button name={1} onClick={e => {}} className="flex-1 focus:outline-none">-</button>
    <button className="flex-1 focus:outline-none">{1}</button>
    <button name={2} onClick={e => {}} className="flex-1 focus:outline-none">+</button>
  </div>
)