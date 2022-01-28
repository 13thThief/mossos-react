const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from 'react-router-dom';
import {Helmet} from 'react-helmet-async';

import axios from '@utils/api';
import format from "date-fns/format";

const ImgVeg = "/images/veg.png";
const ImgNonVeg = "/images/nonveg.png"

import Spinner from '@components/common/Spinner';
import MainHeader from '@components/common/MainHeader';
import Header from '@components/common/Header';
import Loader from '@components/common/Loader';

const PENDING_APPROVAL = 100;
const PENDING = 101;
const CONFIRMED = 200;
const DELIVERED = 201;
const CANCELLED = 400;
const DECLINED = 500;

function cancelOrder(order, setOrder, setIsLoading){

  if (window.confirm('Are you sure you want to cancel this order?')) {
    setIsLoading(true);
    axios.post('/order/cancel', {
      orderId: order.id
    })
    .then(res => res.data)
    .then(data => {
      setOrder(data);
      setIsLoading(false);
    })
    .catch(e => {
      console.error('Cancel Order Error', e.message);
      alert('Something went wrong during cancellation');
      setIsLoading(false);
    })
  }
}

export default function Order({ location, setToken, token }) {
  const { orderId } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    getSpecificOrder();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function getSpecificOrder() {
    axios.get(`/order/${orderId}`)
      .then(res => res.data)
      .then(data => {
        setOrder(data);
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        } else if(error.response?.status === 500){
          history.goBack();
        }
      });
  };

  if(!Object.keys(order).length){
    return <Spinner />
  }

  const whatsApp = `I want to talk regarding my order #${order.no} from ${order.kitchens.name}`;
  const deliveryCharges = 10;

  return (
    <>
      <Helmet>
        <title>Order Details - Mossos</title>
      </Helmet>

      <Loader show={isLoading} />
      
      <MainHeader setToken={setToken} token={token}/>
      <Header history={history} content='Order Detail'/>
      
      <div className="px-5">
        {
          order.statusId === PENDING_APPROVAL  ?
            <div className="pb-2 mb-2 border-b-2 border-dashed text-green-600">
            Your order will be confirmed once the kitchen approves it!
            </div>
          : null
        }
        {
          order.statusId === DECLINED ?
            <div className="pb-2 mb-2 border-b-2 border-dashed text-red-500">
            Sorry! The kitchen declined your order as it was unable to fulfill it.
            </div>
          : null
        }
        <div className="flex justify-between mb-2">
          <div className="flex flex-col font-semibold">
            #{ order.no }
            <p className="text-gray-500">{format(new Date(order.createdAt), "d MMM, yyyy 'at' hh:mm a")}</p>
          </div>

          {
            statusMessage(order)
          }

        </div>

        <p className="text-gray-500 font-semibold">From</p>
        <Link to={`/kitchen/${order.kitchens.id}`} className="font-semibold text-green-600">{ order.kitchens.name }</Link>
        <p className="text-gray-500 font-semibold mt-2">To</p>
        <p className="font-semibold">{ order.addresses }</p>
        <p className="text-gray-500 font-semibold mt-2">On</p>
        <p className="font-semibold">{format(new Date(order.deliveryDate), "d MMM, yyyy 'at' hh:mm a")}</p>
        <p className="text-gray-500 font-semibold mt-2">Payment Method</p>
        <p className="font-semibold border-b-2 mb-4 pb-4">Cash</p>

        <div className="border-b-2 mb-4 pb-2">
          {
            order.items.map(item => {
              return (
                <div key={item.menuId} className="flex justify-between mb-2">
                  <div className="flex flex-col font-semibold">
                    <span>
                      <img src={ item.menus.veg ? ImgVeg : ImgNonVeg } alt=""
                        className="align-text-bottom inline flex-none w-5 h-5 rounded-lg object-cover mr-1" width="18" height="18" />
                      <span>{ item.menus.name } × { item.quantity }</span>
                    </span>
                  </div>
                  <div className="font-semibold">
                    ₹ { item.totalPrice }
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col font-semibold">
            <p className="text-gray-500 font-semibold">Item Total</p>
          </div>
          <div className="font-semibold">
            ₹ { order.amount }
          </div>
        </div>
        <div className="flex justify-between mt-2 pb-1 border-b-2 border-dashed">
          <div className="flex flex-col font-semibold ">
            <p className="text-gray-500 font-semibold">Delivery Charges</p>
          </div>
          <div className="font-semibold">
            ₹ { deliveryCharges }
          </div>
        </div>
        <div className="flex justify-between mt-2 border-b-2 mb-5 pb-2">
          <div className="flex flex-col font-semibold">
            <p className="text-black font-semibold">Total</p>
          </div>
          <div className="font-bold">
            ₹ { order.amount + deliveryCharges }
          </div>
        </div>

        {
          (order.statusId === PENDING_APPROVAL || order.statusId === CONFIRMED) ?
          <div className="mb-4">
            <button
              className="group w-full flex justify-center py-2 px-4 border border-red-500 font-medium rounded-md text-red-500 focus:outline-none"
              onClick={() => cancelOrder(order, setOrder, setIsLoading)}
            >
              Cancel
            </button>
          </div>
          : null
        }

        <div className="bg-yellow-200 rounded-xl p-4 mb-2">
          <div className="flex justify-between">
            <p className="font-semibold text-gray-900">Feedback? Suggestions? Complaints?</p>
            <div className="flex flex-col justify-center">
            <a className="font-semibold text-indigo-600" href={`https://wa.me/91XXXXXXXXXXS?text=${encodeURIComponent(whatsApp)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function statusMessage(order){
  switch(order.statusId) {
    case PENDING_APPROVAL:
    case PENDING:
      return (
        <div className="text-yellow-500 font-semibold">
          <p className="bg-yellow-100 px-2 py-1 rounded-md">{ order.statuses.message }</p>
        </div>
      )
    break;

    case CONFIRMED:
    case DELIVERED:
      return (
        <div className="text-green-500 font-semibold">
          <p className="bg-green-100 px-2 py-1 rounded-md">{ order.statuses.message }</p>
        </div>
      )
    break;

    case CANCELLED:
    case DECLINED:
      return (
        <div className="text-red-500 font-semibold">
          <p className="bg-red-100 px-2 py-1 rounded-md">{ order.statuses.message }</p>
        </div>
      )
    break;
  }
}