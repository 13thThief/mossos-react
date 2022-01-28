const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from 'react-router-dom';
import {Helmet} from 'react-helmet-async';

import axios from '@utils/api';

const ImgVeg = "/images/veg.png";
const ImgNonVeg = "/images/nonveg.png"
const ImgDefaultMenu = "/images/food.svg";

import Spinner from '@components/common/Spinner';
import MainHeader from '@components/common/MainHeader';
import Header from '@components/common/Header';

export default function Profile({ location, setToken, token }) {
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    getOrders();
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function getOrders() {
    axios.get('/user/profile')
      .then(res => {
        return res.data;
      })
      .then((data) => {
        setProfile(data)
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        }
        if(error.response?.data?.message !== 'Invalid Token'){
          alert(error.response.data?.message);
          history.push('/menu')
        }
      });
  };

  if(!profile){
    return <Spinner />
  }

  return (
    <>
      <Helmet>
        <title>My Account - Mossos</title>
      </Helmet>

      <MainHeader setToken={setToken} token={token}/>
      <Header history={history} content='My Account'/>
      <div className="shadow-sm bg-gray-50 divide-y rounded-md p-4 mx-4" style={{ background: '#f2f5fa'}}>
        <div className="mb-3">
          <p className="capitalize font-semibold">{profile.firstName} {profile.lastName}</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500 font-semibold mt-2 text-sm">Email</p>
          <p className="font-semibold text-gray-900">{ profile.email }</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500 font-semibold mt-2 text-sm">Phone</p>
          <p className="font-semibold text-gray-900">{ profile.phone }</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500 font-semibold mt-2 text-sm">Address</p>
          <p className="font-semibold text-gray-900">{ profile.addresses }</p>
        </div>
      </div>
    </>
  );
}


