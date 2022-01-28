const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect, useRef } from "react";
import '../../src/App.css';

import axios from '@utils/api';

import { useHistory, Link } from 'react-router-dom';
import Loader from '@components/common/Loader';

import Header from './common/Header';
import ImgEmptyBag from '/images/bag.svg';
const ImgVeg = "/images/veg.png";
const ImgNonVeg = "/images/nonveg.png";
const ImgDefaultMenu = "/images/food.svg";
const ImgDefaultKitchen = "/images/kitchen.png";

import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { useForm } from "react-hook-form";

export default function Cart({ token, setToken }) {

  const history = useHistory();

  const [kitchen] = useState(() => {
    return localStorage.getItem('kitchen')
  })
  const [menus, setMenus] = useState([]);
  const [amount, setAmount] = useState(1);
  const [noOfItems, setnoOfItems] = useState(0);
  const [cart, setCart] = useState(() => {
    let cart = localStorage.getItem('cart');
    if(!cart) return {};
    try {
      cart = JSON.parse(cart)
      return cart;
    } catch {
      return {};
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deliveryCharges = 10;

  useEffect(() => {
    let totalAmount = 0;
    for(let menu in cart){
      totalAmount += cart[menu]['price'] * cart[menu]['quantity'];
    }
    setAmount(totalAmount);
    if(!totalAmount){
      localStorage.removeItem('kitchen');
      localStorage.removeItem('kitchenId');
    }
  }, [cart])

  useEffect(() => {
    window.scrollTo(0, 0);
    let cart = localStorage.getItem('cart');
    if(!cart){
      return;
    }
    cart = JSON.parse(cart);
    let itemsInCart = Object.keys(cart).length;
    if(!itemsInCart){
      return;
    }
    setnoOfItems(itemsInCart);
    getCartDetails(cart);
  }, []);

  function getCartDetails(cart) {
    axios.get(`${API}/cart/details`, {
      params: {
        q: Object.keys(cart)
      }
    })
    .then(res => {
      return res.data;
    })
    .then((data) => {
      if(!data){
        return;
      }
      setMenus(data)
    })
    .catch((error) => {
      if(error.response?.data?.message === 'Invalid Token'){
        setToken(undefined);
      }
    });
  };

  function changeQuantity(e, action){
    const { name } = e.target
    let cart = localStorage.getItem('cart');
    if(!cart){
      return;
    }

    cart = JSON.parse(cart);
    let quantity = cart[name]['quantity'];
    if(quantity === 1 && !action){
      removeItem(name);
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

  function removeItem(id){
    let cart = localStorage.getItem('cart');
    if(!cart){
      return;
    }

    cart = JSON.parse(cart);
    delete cart[id];
    setCart(cart);
    setnoOfItems(noOfItems => noOfItems - 1);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  const onSubmit = data => {
    setIsLoading(true);

    axios.post(`${API}/login`, {
      email: data.email,
      password: data.password
    })
      .then(res => {
        return res.data;
      })
      .then(data => {
        localStorage.setItem('user', data.user.id);
        localStorage.setItem('name', `${data.user.first_name} ${data.user.last_name}`);
        localStorage.setItem('login', 1);
        setIsLoading(false);
        setToken(data.token);
        if(!data.user.addressExists){
            history.replace('/new-address');
            return;
        }
        history.push('/checkout')
      })
      .catch((error) => {
        if(error.response){
          alert(error.response.data?.message)
        }
        setIsLoading(false);
      })
  }

  return (
    <>
    <Header
      history={history}
      content={kitchen}
    />

    <div className="min-h-screen flex flex-col py-2 " style={{backgroundColor: 'rgb(245, 245, 245)'}}>
      <div className="px-2 cart">
       

        {
          !!amount ? 
            <>
             <CartList
              menus={menus}
              cart={cart}
              changeQuantity={changeQuantity}
              removeItem={removeItem}
              />
             <OrderSummary
              amount={amount}
              deliveryCharges={deliveryCharges}
              />
            </>
          :
          <EmptyCart />
        }
        <div style={{ height: '70px'}}></div>
        {
          !!amount &&
          <CheckoutCTA
            btnText={'Checkout'}
            mainContent={`₹${amount + deliveryCharges}`}
            subContent={'To Pay'} /* (MRP incl. of all taxes) */
            link={'/checkout'}
            token={token}
            setToken={setToken}
            history={history}
            setOpen={setOpen}
          />
        }

        <BottomSheet
          open={open}
          onDismiss={() => setOpen(false)}
          snapPoints={({ maxHeight }) => 50/*[maxHeight / 4, maxHeight * 0.6]*/}
          snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
        >
          <div className="flex items-center justify-center py-12 px-4">
            <Loader show={isLoading} />
            <div className="max-w-md w-full space-y-8 text-center">
              <div className="flex justify-center">
                <Link to="/" className="">
                  <img title="Mossos" className="h-12 w-34" alt="Mossos" src="/images/mossos-logo.png" />
                </Link>
              </div>
              <div>
                 <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Log in to your account</h2>
              </div>
              <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      {
                        ...register('email', {
                          required: true,
                          validate: validateEmail
                        })
                      }
                      type="email"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                    {errors.email && <span className="text-sm text-gray-500">Please enter valid email</span>}
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      {
                        ...register('password', {
                          required: true,
                          validate: validatePassword
                        })
                      }
                      type="password"
                      autoComplete="current-password"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                    {errors.password && <span className="text-sm text-gray-500">Invalid Password</span>}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-gray-900 hover:bg-green-700 focus:outline-none"
                  >
                    Log in
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center">
                 <div className="text-md">
                    <Link to="/signup" className="font-medium text-green-600 hover:text-gray-900">
                      I want to sign up!
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </BottomSheet>
  
    </div>
    </div>
    </>
  )
}

const CartList = ({ menus, cart, changeQuantity, removeItem }) =>  (
  <div role="presentation" className="rounded-md w-full mb-1 bg-white my-1" style={{ marginTop: 0}}>
    {
      menus.map(item => {
        if(cart[item.id]){
          return (
            <div key={item.id} className="w-full flex py-4 px-3 border-t border-gray-100">
              <div className="mr-3 flex-col justify-between items-center">
                <div className="h-82px w-82px mb-1">
                  <img src={ item.veg ? ImgVeg : ImgNonVeg } alt="" className="flex-none w-18 h-18 rounded-lg object-cover bg-gray-100" width="20" height="20" />
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <h6 className="font-semibold uppercase text-sm pr-2 align-top">
                    {item.name}
                  </h6>
                </div>
                <p className="text-xxs font-bold opacity-50" />
                <div className="flex items-center justify-between pt-3">
                  <p className="font-bold">
                    <span className="font-semibold mr-1">{`₹${item.price * cart[item.id]['quantity']}`}</span>
                  </p>
                  <div>
                    <div className="w-20 flex justify-items content-center items-center rounded border border-solid shadow">
                      <button name={item.id} onClick={e => changeQuantity(e, false)} className="flex-1 focus:outline-none">-</button>
                      <button className="flex-1 focus:outline-none">{cart[item.id]['quantity']}</button>
                      <button name={item.id} onClick={e => changeQuantity(e, true)} className="flex-1 focus:outline-none">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })
    }
  </div>
)

const EmptyCart = () => (
  <div className="bg-white flex flex-col justify-center" style={{minHeight: 'calc(-8rem + 100vh)'}}>
  <div className="relative mx-auto my-1">
    <figure>
      <img className="p-12" src={ImgEmptyBag} alt="Empty Shopping Cart" />
    </figure>
  </div>
  <h1 className="text-center font-bold" style={{fontSize: 18}}>
    Your bag is empty!
  </h1>
  <span className="text-center" style={{fontSize: 14, opacity: '0.7'}}>Please add some items.</span>
  <Link to="/menu" className="mx-auto my-4 rounded-lg p-2 px-1 bg-black text-white text-sm w-32 text-center">Menu</Link>
</div>
)

const OrderSummary = ({ amount, deliveryCharges }) => (
  <div className="pt-3 bg-white text-sm rounded-md pb-0">
    <h3 className="pt-2 px-5 mb-3 font-semibold">Order</h3>
    <div className="flex px-5 mb-3">
      <div className="w-1/2 mb-2">Amount</div>
      <div className="w-1/2 text-right">{`₹${amount}`}</div>
    </div>
    <div className="flex px-5 mb-3 border-b-2 border-gray-100">
      <div className="w-1/4 text-right">
        <span className="pr-2">{`₹${deliveryCharges}`}</span><span className="text-gray-400 line-through">₹20</span>
      </div>
    </div>

    <div className="flex px-5 mb-3">
      <div className="w-3/4 mb-3 font-semibold">
        To Pay
      </div>
      <div className="w-1/4 text-right font-semibold">
        {`₹${amount + deliveryCharges}`}
      </div>
    </div>
  </div>
)

const CheckoutCTA = ({ btnText, mainContent, subContent, kitchenId, link, history, token, setToken, setOpen}) => (
  <div
    className="fixed bottom-0 left-0 w-full"
    style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -4px 4px 0px" }}
  >
    <div
      className="flex justify-between bg-white"
      style={{
        padding: "10px 10px 10px 16px",
        boxShadow: "0 0 3px 0 rgba(0,0,0,.19)",
      }}
    >
      <div className="flex flex-col justify-center">
        <p className="font-semibold text-xl">{mainContent}</p>
        {
          kitchenId ?
          <p className="text-sm underline"><Link to={`/kitchen/${kitchenId}`}>{subContent}</Link></p>
          :
          subContent ? <p className="text-sm">{subContent}</p> : null
        }
      </div>
        <button
          className="text-sm flex items-center bg-gray-800 rounded-md text-white font-semibold uppercase"
          type="button"
          style={{
            padding: "12px 15px",
            width: "170px",
            height: "49px",
            justifyContent: "space-evenly",
          }}
          onClick={()=>{
              if(!token){
                setOpen(true);
              } else {
                history.push('/checkout')
              }
            }
          }
        >
          {btnText}
          <IconNext />
        </button>
    </div>
  </div>
);

function MemoIconNext() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={14} height={21} viewBox="10 400 500 50">
      <path transform="scale(1,-1) translate(0, -650)" fill="#ffffff" d="M396 219l-121-125c-12-13-13-34-1-46 11-12 31-11 44 2l184 191c13 14 14 34 2 46l-170 177c-12 12-32 11-45-2-12-13-13-34-1-46l124-129-379 0c-19 0-33-15-33-34 0-18 15-34 33-34l363 0z m76 57l1 1 0-1c0 0-1 0-1 0l0 0z" />
    </svg>
  )
}

const IconNext = React.memo(MemoIconNext)


const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const plusEmailRegex = /^[^+@]+@\S+$/i;

const validateEmail = email => {
  if (!email)
    return false;
  if(!plusEmailRegex.test(email))
    return false;
  if(!emailRegex.test(email))
    return false;
  return true;
};

const validatePassword = password => {
  if (!password)
    return false;
  if(password.length < 8)
    return false;
  return true;
};