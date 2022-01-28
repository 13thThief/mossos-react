const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from 'react-router-dom';
import {Helmet} from 'react-helmet-async';

import axios from '@utils/api';
import format from "date-fns/format";

import Spinner from '@components/common/Spinner';
import MainHeader from '@components/common/MainHeader';
import Header from '@components/common/Header';

export default function Order({ location, setToken, token }) {
  const history = useHistory();
  const [orders, setOrders] = useState(null);
  
  useEffect(() => {
    getOrders();
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function getOrders() {
    axios.get('/order')
      .then(res => {
        return res.data;
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        }
      });
  };

  if(!orders){
    return <Spinner />
  }

  const deliveryCharges = 10;

  return (
    <>
      <Helmet>
        <title>My Order - Mossos</title>
      </Helmet>

      <MainHeader setToken={setToken} token={token}/>
      <Header history={history} content='My Orders'/>
      <div className="divide-y divide-gray-300 space-y-3 px-5">
        {
          orders.length ?
          orders.map((order) => (
            <Link className="block pt-2" key={order.id} to={`/order-details/${order.id}`}>
              <div className="flex justify-between mb-2">
                <div className="flex flex-col font-semibold">
                  #{ order.no }
                  <p className="text-gray-500">{format(new Date(order.createdAt), "d MMM, yyyy 'at' hh:mm a")}</p>
                </div>
                { statusMessage(order) }
              </div>
              <div className="flex justify-between mb-2">
                <p>{order.items.reduce((acc, current) => acc + current.quantity, 0)} items from <span className="font-semibold">{ order.kitchens.name }</span></p>
                <div className="font-semibold">
                  ₹ { order.amount + deliveryCharges }
                </div>
              </div>
            </Link>
          )) :
          <p>You have not ordered anything yet.</p>
        }            
      </div>
    </>
  );
}

function statusMessage(order){
  switch(order.statusId) {
    case 100: // Pending Approval
    case 101: // Pending
      return (
        <div className="text-yellow-500 font-semibold">
          <p className="bg-yellow-100 px-2 py-1 rounded-md">{ order.statuses.message }</p>
        </div>
      )
    break;

    case 200: // Confirmed
    case 201: // Delivered
      return (
        <div className="text-green-500 font-semibold">
          <p className="bg-green-100 px-2 py-1 rounded-md">{ order.statuses.message }</p>
        </div>
      )
    break;

    case 400: // Cancelled
    case 500: // Declined
      return (
        <div className="text-red-500 font-semibold">
          <p className="bg-red-100 px-2 py-1 rounded-md">{ order.statuses.message }</p>
        </div>
      )
    break;
  }
}