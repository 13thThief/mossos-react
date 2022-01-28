const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from '@utils/api';
import Spinner from '@components/common/Spinner';

const ImgDefaultKitchen = "/images/kitchen2.png";

export default function Kitchen({ setToken }) {
  const [kitchens, setKitchens] = useState([]);

  useEffect(() => {
    getKitchens();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function getKitchens() {
    axios.get(`${API}/kitchen`)
      .then(res => {
        return res.data;
      })
      .then((data) => {
        setKitchens(data);
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        }
      });
  };

  if(!kitchens.length){
    return <Spinner />
  }

  return (
    <>
    <div className="flex flex-wrap justify-center p-2 pt-0">
      {
        kitchens.map((kitchen) => (
            <div key={kitchen.id} className="w-1/2">
              <div className="p-2">
                <Link to={`/kitchen/${kitchen.id}`}>
                  <div className="flex justify-center rounded">
                    <img
                      src={kitchen.image || ImgDefaultKitchen}
                      alt={kitchen.name}
                      className="rounded-lg object-cover bg-gray-100"
                    /> 
                  </div>
                  <h1 className="capitalize h-5 text-lg mt-2 text-gray-800">{kitchen.name}</h1>
                </Link>
              </div>
            </div>
        ))
      }
      {
        kitchens.length % 2 !==0 && <div className="w-1/2"></div>
      }
    </div>
    
   </>
  )
}


function IconNext() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={14} height={21} viewBox="10 400 500 50">
      <path transform="scale(1,-1) translate(0, -650)" fill="#ffffff" d="M396 219l-121-125c-12-13-13-34-1-46 11-12 31-11 44 2l184 191c13 14 14 34 2 46l-170 177c-12 12-32 11-45-2-12-13-13-34-1-46l124-129-379 0c-19 0-33-15-33-34 0-18 15-34 33-34l363 0z m76 57l1 1 0-1c0 0-1 0-1 0l0 0z" />
    </svg>
  )
}
