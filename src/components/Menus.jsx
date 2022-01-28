const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";

import { Link } from 'react-router-dom';

import axios from '@utils/api';

const ImgVeg = "/images/veg.png";
const ImgNonVeg = "/images/nonveg.png"
const ImgDefaultMenu = "/images/meal2.svg";

import Spinner from '@components/common/Spinner';

export default function Menu({ location, setToken }) {
  const [menus, setMenus] = useState([]);
  const p = new URLSearchParams(window.location.search);
  let foodType = Object.fromEntries(p.entries());
  
  useEffect(() => {
    getMenus();
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function getMenus() {
    let api;
    if('veg' in foodType){
      api = `${API}/menu?v=${foodType.veg === '1' ? 1 : 0}`;
    } else api = `${API}/menu`;
   
    axios.get(api)
      .then(res => {
        return res.data;
      })
      .then((data) => {
        setMenus(data);
      })
      .catch((error) => {
        if(error.response?.data?.message === 'Invalid Token'){
          setToken(undefined);
        }
      });
  };

  if(!menus.length){
    return <Spinner />
  }

  return (
    <>      
      {
        menus.map(menu => (
          <Link key={menu.id} to={`/menu/${menu.id}`}>
            <article className="p-4 flex space-x-2">
              <img
                src={menu.image || ImgDefaultMenu}
                alt={`A nice photo of ${menu.name} couldn't load`}
                className="flex-none w-36 h-24 rounded-md object-cover bg-gray-100"
                style={{ height: '6.25rem', /*position: 'relative'*/}}
              />
                <div className="min-w-0 flex-auto">
                <h2 className="text-lg text-black mb-0.5 tracking-tighter">
                  {menu.name}
                </h2>
                <div className="flex flex-wrap text-sm  whitespace-pre">
                  {
                    menu.servings ?
                    <><span className="">₹{menu.price} · </span><span className="text-gray-500">{menu.servings}</span></>
                    :
                    <span>₹{menu.price}</span>
                  }
                  <div className="flex-none w-full mt-1 ">
                    <dt className="inline">By</dt>{' '}
                    <dd className="inline text-black">{menu.kitchens.name}</dd>
                  </div>
                  {
                    <div className="mt-2 flex">
                    <img src={ menu.veg ? ImgVeg : ImgNonVeg } alt="" className="flex-none w-5 h-5 rounded-lg object-cover" width="20" height="20" />
                    { menu.recommended && <span className="mx-4 px-2 border rounded" style={{ color: '#388e3c', borderColor: '#388e3c'}}>Recommended</span> }
                    </div>
                  }
                  
                  <div className="absolute top-0 rounded-lg bg-amber-50 text-amber-900 px-2 py-0.5 hidden items-center space-x-1">
                    <dt className="text-amber-500">
                      <span className="sr-only">Rating</span>
                      <svg width="16" height="20" fill="currentColor">
                        <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                      </svg>
                    </dt>
                    <dd>{menu.price}</dd>
                  </div>
                </div>
                </div>
            </article>
          </Link>
        ))
      }

      
    </>
  );
}