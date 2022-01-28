const API = import.meta.env.VITE_APP_API;

import React from "react";
import { useHistory, Link } from 'react-router-dom';
import {Helmet} from 'react-helmet-async';

const SvgSuccess = "/images/success.svg";
const SvgPending = "/images/pending.svg";
const SvgFail = "/images/fail.svg";


export default function Order({ location, setToken, status }) {
  const history = useHistory();
  const order = history.location.state;
  if(!order){
    setTimeout(() => {
      history.replace('/menu');
    }, 50);
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Order X - Mossos</title>
      </Helmet>
        {
          (() => {
            switch (status) {
              case 'success':
               return <OrderSuccessful order={order}/>
              case 'fail':
               return <OrderFailed order={order}/>
              case 'pending':
               return <OrderPending order={order}/>
             }
          })()
        }
    </>
  );
}

const OrderSuccessful = ({order}) => (
  <>
  <div className="h-screen" style={{background: '#25AE88'}}>
    <div className="flex flex-col justify-center items-center pt-32">
      <img src={SvgSuccess} alt="Order Success" />
      <p className="font-bold text-2xl text-white mt-12">Order Placed!</p>
      <p className="text-gray-100 font-semibold text-md mt-2">#{order.orderNo}</p>
      <p className="mt-2 text-white rounded-md px-8 py-2 text-sm">Please note that your order may arrive a little before or after your set delivery time due to weather</p>
      <Link
          to={`/order-details/${order.orderId}`}
          replace
          className="mt-8 w-5/6 bg-white text-center text-sm flex-none text-md leading-6 font-semibold py-3 px-6 border rounded-md"
          style={{ color: '#25ae88' }}
        >
          Track Order Status
        </Link>
        <Link
          to="/menu"
          replace
          className="mt-4 w-5/6 text-center text-white text-sm flex-none text-md leading-6 font-semibold py-3 px-6 border rounded-md"
        >
          Browse Menu
        </Link>
    </div>
  </div>
  </>
)

const OrderFailed = () => (
  <>
  <div className="h-screen" style={{background: '#EF4444'}}>
    <div className="flex flex-col justify-center items-center pt-32">
      <img src={SvgFail} alt="Order Success" />
      <p className="font-bold text-2xl text-white mt-12">Order Failed!</p>
      <p className="text-gray-100 font-semibold text-md mt-2">Sorry! Something went wrong!</p>
      <p className="text-gray-100 font-semibold text-md mt-1">Please try again!</p>
      <Link
          to='/menu'
          className="mt-8 w-5/6 bg-white text-center text-sm flex-none text-md leading-6 font-semibold py-3 px-6 border rounded-md"
          style={{ color: '#EF4444' }}
        >
          Browse Menu
        </Link>
    </div>
  </div>
  </>
)

const OrderPending = ({order}) => (
  <>
  <div className="h-screen" style={{background: '#F59E0B'}}>
    <div className="flex flex-col justify-center items-center pt-32">
      <img src={SvgPending} alt="Order Pending Approval" />
      <p className="font-bold text-2xl text-white mt-12">Order Pending Approval!</p>
      <p className="text-gray-100 font-semibold text-md mt-2">#{order.orderNo}</p>
      <p className="px-8 mt-2 py-1 font-bold text-white">
      We have received your order but it is pending confirmation by the kitchen.
      It will be confirmed if the kitchen can fulfill it.
      </p>
      <p className="mt-2 text-white rounded-md px-8 py-2 text-sm">Please note that your order, once confirmed, may arrive a little before or after your set delivery time due to weather</p>
      <Link
          to={`/order-details/${order.orderId}`}
          className="mt-8 w-5/6 bg-white text-center text-sm flex-none text-md leading-6 font-semibold py-3 px-6 border rounded-md"
          style={{ color: '#F59E0B' }}
        >
          Track Order Status
        </Link>
        <Link
          to="/menu"
          className="mt-4 w-5/6 text-center text-white text-sm flex-none text-md leading-6 font-semibold py-3 px-6 border rounded-md"
        >
          Browse Menu
        </Link>
    </div>
  </div>
  </>
)