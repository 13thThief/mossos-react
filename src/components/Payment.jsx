const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import '../../src/App.css';
import {Helmet} from 'react-helmet-async';
import format from "date-fns/format";

import axios from '@utils/api';

import Loader from '@components/common/Loader';

import { useHistory, useParams } from 'react-router-dom';

function placeOrder(setIsLoading, date, history, setToken) {
  let cart = localStorage.getItem('cart')
  try {
    cart = JSON.parse(cart);
  } catch {
    return;
  }

  const items = [];
  for(const menu in cart){
    items.push({
      menu: menu,
      quantity: cart[menu]['quantity']
    })
  }

  setIsLoading(true);
  axios.post(`${API}/order`, {
    date: date,
    items: items,
  })
  .then(res => {
    return res.data;
  })
  .then(data => {
    localStorage.removeItem('cart');
    localStorage.removeItem('kitchen');
    localStorage.removeItem('kitchenId');
    setIsLoading(false);
    history.replace(data.statusId === 100 ? '/order-pending' : '/order-success', {
      orderNo: data.no,
      orderId: data.id
    })
  })
  .catch((error) => {
    setIsLoading(false);
    if(error.response?.data?.message === 'Invalid Token'){
      setToken(undefined);
    } else {
      history.replace('/order-fail', {
        orderNo: '',
      })
    }
  });
}

export default function Payment({ setToken }) {
  let date = localStorage.getItem('date');
  const [amount, setAmount] = useState(() => {
    let cart = localStorage.getItem('cart');
    if(!cart){
      return;
    }
    cart = JSON.parse(cart);
    let totalAmount = 0;
    for(let menu in cart){
      totalAmount += cart[menu]['price'] * cart[menu]['quantity'];
    }
   return totalAmount;
  });
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const deliveryCharges = 10;

  return (
    <>
    <Loader show={isLoading} />
    <Helmet>
      <title>Payment - Mossos</title>
    </Helmet>
    <div className="px-4 bg-gray-50 overflow-hidden">
      <h2 className="mt-8 text-center text-2xl text-gray-900">Confirm order and pay</h2>
      <div className="mt-8 rounded-md bg-black text-white">
        <p className="px-8 pt-8">You have to pay</p>
        <p className="px-8 mt-2 text-3xl">{`₹${amount + deliveryCharges}`}
        </p>
        <div className="mt-4 border-dashed border-b-2"></div>
        <p className="px-8 pt-8">For</p>
        <p className="px-8 text-xl">{localStorage.getItem('kitchen')}</p>
        <p className="px-8 pt-4">Via</p>
        <p className="px-8 text-xl">Cash On Delivery</p>
        <p className="px-8 pt-4">On</p>
        <p className="px-8 pb-8 text-xl">{format(new Date(date), "do MMM, yyyy 'at' hh:mm a")}</p>
      </div>

      <button type="button"
        className={`bg-black text-white uppercase my-1 mt-3 px-4 py-3 w-full rounded-md ${(!amount) ? "disabled:opacity-50" : ''}`}
        disabled={!amount}
        onClick={() => placeOrder(setIsLoading, date, history, setToken)}
      >
        Place Order
      </button>
    </div>
    </>
  )
}