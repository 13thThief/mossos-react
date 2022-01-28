const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import '../../src/App.css';
import DatePicker from "react-datepicker";
import { setMinutes, setHours, setSeconds, addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

import axios from '@utils/api';

import { useHistory } from 'react-router-dom';

import 'react-spring-bottom-sheet/dist/style.css';

import PaymentCTA from './common/FooterCTA';
import Header from './common/Header';

const Calendar = () => {
  const [date, setDate] = useState(setHours(setMinutes(setSeconds(addDays(new Date(), 1), 0), 0), 13));
  useEffect(() => {
    localStorage.setItem('date', date);
  }, [date])

  return (
    <div className="">
      <DatePicker
        selected={date}
        onChange={setDate}

        dateFormat="MMMM d, h:mm aa"
        timeFormat="h:mm aa"
        timeIntervals={30}
        includeDates={[
          addDays(new Date(), 1),
          addDays(new Date(), 2)
        ]}
        includeTimes={[
          setHours(setMinutes(new Date(), 0), 10),
          setHours(setMinutes(new Date(), 30), 10)
        ]}
        showTimeSelect
        className="border-2 border-solid border-gray-200 rounded pl-2"
        disabledKeyboardNavigation
        onFocus={(e) => e.target.readOnly = true}
      />
    </div>
  );
};

export default function Checkout({ user, order, setToken }) {
  let now = new Date();
  let deliveryCharges = 10;
  let history = useHistory();
  let [loading, setLoading] = useState(false);

  const [delivery, setDelivery] = useState({});
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

  useEffect(() => {
      axios.get(`${API}/user/delivery`)
      .then(res => {
        return res.data;
      })
      .then((data) => {
        setDelivery(data);
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        }
        if(error.response?.status === 404){
          history.push('/new-address')
        }
      });
  }, []);

  if(!amount){
    history.replace('/');
  }

  return (
    <>
      <Header
        history={history}
        content="Checkout"
      />

    <section className="min-h-screen">
      <div style={{height: '100vh', padding: '9px 6px 80px', background: 'rgb(244, 244, 244) none repeat scroll 0% 0%'}}>
      <DeliveryAddress
        delivery={delivery}
      />
      <CheckoutSummary
        subtotal={amount}
        deliveryCharges={10}
        now={now}
      />
      {
        !!amount /*&&  (localStorage.getItem('kitchenId') === 'kitchen4' || delivery.serviceable)*/ &&
        <PaymentCTA
          btnText={'Proceed to pay'}
          mainContent={`₹${amount + deliveryCharges}`}
          subContent={'To Pay'}
          link={'/payment'}
        />
      }
      </div>
    </section>
    </>
  )
}

const DeliveryAddress = ({ delivery }) => (
        <div className="bg-white" style={{margin: '0px 0px 9px', boxShadow: 'rgba(0, 0, 0, 0.19) 0px 0px 3px 0px'}}>
          <div style={{padding: 15}}>
            <h6 className="text-sm font-semibold pb-2">
              Delivery Details
            </h6>
            <h5 className="text-sm font-semibold mb-1">{delivery.name}</h5>
            <p className="text-sm mb-3">{delivery.address}</p>
            <div className="flex items-end mb-3">
              <p className="text-sm font-semibold break-all">{delivery.phone}</p>
            </div>
            <div className="flex items-end" style={{marginBottom: 10}}>
              <p className="text-sm break-all">{delivery.email}</p>
            </div>
          </div>
        </div>
)

const CheckoutSummary = ({ subtotal, deliveryCharges, now }) => (
  <div className="bg-white" style={{margin: '0px 0px 9px', boxShadow: 'rgba(0, 0, 0, 0.19) 0px 0px 3px 0px'}}>
      <div className="flex justify-betwen items-end text-sm" style={{padding: '15px 15px 11px', borderBottom: '1px solid rgb(246, 246, 246)'}}>
        <div className="flex">
          <p className="font-semibold">Delivery Date</p>
        </div>
        <Calendar />
      </div>
      <div className="flex justify-between text-sm items-end" style={{padding: '8px 15px'}}>
        <div className="flex flex-col">
          <p className="text-sm font-semibold" style={{padding: '5px 0px'}}>
            Order Summary
          </p>
          <p className="text-sm" style={{padding: '5px 0px'}}>Amount</p>
        </div>
        <p>{`₹${subtotal}`}</p>
      </div>
      <div className="flex justify-between text-sm" style={{padding: '8px 15px', border: '1px solid rgb(245, 245, 246)'}}>
        <p style={{padding: '4px 0px'}}>Delivery Charges</p>
        <p style={{padding: '4px 0px'}}>{`₹${deliveryCharges}`}</p>
      </div>
      <div className="flex justify-between text-sm items-start" style={{padding: '8px 15px'}}>
        <div className="flex flex-col">
          <p className="text-sm font-semibold" style={{padding: '3px 0px'}}>
            Total Amount
          </p>
          <p className="text-xs" style={{color: 'rgb(150, 150, 150)'}}>
            Including all taxes
          </p>
        </div>
        <p className="font-semibold" style={{fontSize: 15}}>{`₹${subtotal + deliveryCharges}`}</p>
      </div>
      {
        now.getHours() > 19 &&
        <div className="flex justify-between text-sm items-start" style={{padding: '8px 15px', border: '1px solid rgb(245, 245, 246)'}}>
          <p className="text-yellow-600" style={{fontSize: 13}}>Ordering after 7 PM for next day will be placed but remain pending until approved by the kitchen to ensure whether it can be fulfilled the next day or not.</p>
        </div>
      }
      {
        false && (localStorage.getItem('kitchenId') !== 'kitchen4' && !delivery.serviceable) &&
        <div className="flex justify-between text-sm items-start" style={{padding: '8px 15px', border: '1px solid rgb(245, 245, 246)'}}>
          <p className="text-red-600" style={{fontSize: 13}}>Sorry! Your address / location is currently not serviceable. However, we'll be there soon!</p>
        </div>
      }
    </div>
)