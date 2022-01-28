const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import '../../src/App.css';

import {Helmet} from 'react-helmet-async';
import axios from '@utils/api';
import axios2 from '@utils/api';

import { useHistory, useParams, Link } from 'react-router-dom';

import CartCTA from '@components/common/FooterCTA';
import Header from '@components/common/Header';
import Spinner from '@components/common/Spinner';
import MainHeader from '@components/common/MainHeader';

const ImgVeg = "/images/veg.png";
const ImgNonVeg = "/images/nonveg.png";
const ImgDefaultMenu = "/images/meal2.svg";
const ImgDefaultKitchen = "/images/kitchen.png";
function resetLocalStorage() {
  localStorage.removeItem('cart');
  localStorage.removeItem('kitchenId');
  localStorage.removeItem('kitchen');
}

const addButtonClass = "focus:none bg-gray-800 px-2 mt-8 uppercase text-sm h-4 py-1 text-white";
const removeButtonClass = "focus:none border px-2 mt-8 uppercase text-sm h-4 border-gray-500 py-1";

export default function SpecificKitchen({ setToken, token }) {

  const { kitchenId } = useParams();
  const history = useHistory();

  const [buttonMenu, setButtonMenu] = useState({});
  const [kitchen, setKitchen] = useState(null);
  const [kitchenMenu, setKitchenMenu] = useState([]);
  const [amount, setAmount] = useState(() => {
    let cart = localStorage.getItem('cart');
    if(!cart) return 0;
    try {
      cart = JSON.parse(cart)
      let amount = Object.values(cart).reduce((acc, menu) => (acc + menu.price), 0);
      return amount;
    } catch {
      return 0;
    }
  });
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

  function addToBag(e) {
    e.preventDefault();
    const kitchenId = localStorage.getItem('kitchenId');
    if(kitchenId && kitchenId !== kitchen.id){
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
    let menu = kitchenMenu.find(menu => menu.id === menuId);
    cart[menuId] = { quantity: 1, price: menu.price };
    setAmount(amount + menu.price);
    setItems(items => items + 1);
    localStorage.setItem('kitchenId', kitchen.id);
    localStorage.setItem('kitchen', kitchen.name);
    localStorage.setItem('cart', JSON.stringify(cart));
    setButtonMenu({...buttonMenu, ...cart});
  }

  function removeFromBag(e) {
    e.preventDefault();
    let menuId = e.target.id;
    let cart = localStorage.getItem('cart');
    try {
      cart = JSON.parse(cart);
    } catch {
      resetLocalStorage();
    }
    let menu = kitchenMenu.find(menu => menu.id === menuId);
    setAmount(amount - menu.price);
    delete cart[menuId];
    setItems(items => items - 1);
    setButtonMenu(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    if(!Object.keys(cart).length){
      localStorage.removeItem('kitchenId');
      localStorage.removeItem('kitchen')
    }
  }

  useEffect(() => {
    getSpecificKitchen();
    getKitchenMenus();

    let cart = localStorage.getItem('cart');
    if(cart){
      cart = JSON.parse(cart);
      let price=0;
      for(let menu of kitchenMenu){
        let menuId = menu.id;
        if(menuId in cart){
          price += menu.price;
        }
      }
      setButtonMenu({...buttonMenu, ...cart})
    }
  }, []);

  function getSpecificKitchen() {
    axios.get(`${API}/kitchen/${kitchenId}`)
      .then(res => {
        return res.data;
      })
      .then((data) => {
        setKitchen(data);
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        }
      });
  };

  function getKitchenMenus() {
    axios2.get(`${API}/kitchen/${kitchenId}/menus`)
      .then(res => {
        return res.data;
      })
      .then((data) => {
        setKitchenMenu(data);
      })
      .catch((error) => {

      });
  };

  if(!kitchen){
    return <Spinner />
  }

  return (
    <>
      <Helmet>
        <title>{`${kitchen?.name} - Mossos`}</title>
      </Helmet>

      <MainHeader setToken={setToken} token={token}/>

      <Header
        history={history}
        content={kitchen?.name || 'Kitchen'}
      />

      <div className="grid grid-cols-1">
        <div className="col-start-1 row-start-1 px-2 pt-48 pb-3" style={{ zIndex: -1}}>
          <h2 className="text-xl text-white">{kitchen?.name}</h2>
        </div>
        <div className="col-start-1 row-start-1 flex">
          <div className="w-full grid grid-cols-3 grid-rows-2 gap-2">
            <div className="relative col-span-3 row-span-2">
              <img src={kitchen.image || ImgDefaultKitchen} alt="" className="absolute inset-0 w-full h-full object-cover bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-2">
        <div className="flex items-center text-sm my-5">
          <div>{kitchen?.description}</div>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {kitchenMenu.map((menu) => (
          <article key={menu.id} className="p-4">
            <Link to={`/menu/${menu.id}`} className="flex space-x-4">
              <img src={menu.image || ImgDefaultMenu} alt={menu.name} className="flex-none w-18 h-36 rounded-lg object-cover bg-gray-100" width="144" height="144" />
            
            <div className="">
              <h2 className="flex-none text-lg text-black mb-0.5">
                {menu.name}
              </h2>
              <div className="flex-none text-sm whitespace-pre">
                {
                  menu.servings ?
                  <><span>₹{menu.price} · </span><span className="text-gray-500">{menu.servings}</span></>
                  :
                  <span>₹{menu.price}</span>
                }
              </div>
              <div className="mt-2 flex items-center">
                <img src={ menu.veg ? ImgVeg : ImgNonVeg } alt="" className="flex-none w-5 h-5 rounded-lg object-cover" width="20" height="20" />
                { menu.recommended && <span className="text-green-600 mx-4 px-2 text-sm border border-green-500 rounded">Recommended</span> }
              </div>
              <AddRemoveButton
                id={menu.id}
                className={ Object.keys(buttonMenu).includes(menu.id) ? removeButtonClass : addButtonClass }
                style={{outline: "currentcolor none medium", width: '82px'}}
                onClick={ Object.keys(buttonMenu).includes(menu.id) ? removeFromBag : addToBag }
              >
                { Object.keys(buttonMenu).includes(menu.id) ? 'Remove' : 'Add' }
              </AddRemoveButton>       
            </div>
            </Link>
          </article>
        ))}         
      </ul>

      <div style={{ height: '80px'}}></div>
      { Boolean(items) && <CartCTA kitchenId={localStorage.getItem('kitchenId') === kitchenId ? false : localStorage.getItem('kitchenId') } link="/cart" kitchen={true} btnText={'View Bag'} mainContent={`${items} ${items === 1 ? 'item' : 'items'}`} subContent={localStorage.getItem('kitchen')}/> }
    </>
  );
}

const AddRemoveButton = ({ id, style, className, onClick, children }) => (
  <button
    id={id}
    style={style}  
    className={className}
    onClick={onClick}
  >
  {children}  
  </button>
)
