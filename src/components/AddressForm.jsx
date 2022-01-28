const API = import.meta.env.VITE_APP_API;

import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from '@utils/api';

import Loader from '@components/common/Loader';

export default function AddressForm() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

    const onSubmit = data => {
      setIsLoading(true);

      axios.post(`${API}/user/address`, {
        flatNo: data.flatNo,
        building: data.building,
        street1: data.street1,
        street2: data.street2,
        landmark: data.landmark,
        location: location
      }, { headers: { token: localStorage.getItem('token')}})
      .then(res => {
        return res.data;
      })
      .then(data => {
        setIsLoading(false);
        history.replace('/menu');
      })
      .catch((error) => {
        if(error.response){
          alert(error.response.data?.message)
        }
        setIsLoading(false);
      })
  }

  const { register, handleSubmit, formState: { errors } } = useForm();

  let location;
  if (!localStorage.getItem('location')){
    navigator.geolocation.getCurrentPosition(({coords})=>{
      location = `${coords.latitude} ${coords.longitude} ${coords.accuracy}`;
      localStorage.setItem('location', 1);
      }, ()=>{}, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Loader show={isLoading} />
      <div className="max-w-md w-full space-y-8">
        {/*<Link to="/"><h2 className="mt-6 text-center text-3xl font-extrabold text-green-700">Mossos</h2></Link>*/}
        <div>
           <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Enter your address details</h2>
           </div>
        <form className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex">
              <input
                {
                  ...register('flatNo', {
                    required: true,
                    maxLength: 20
                  })
                }
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-tl-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Flat No."
              />
              <input
                {
                  ...register('building', {
                    required: true
                  })
                }
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-tr-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Building"
              />
            </div>
            <p>{errors.flatNo && <span className="text-sm text-gray-500">Please enter valid flat number</span>}</p>
            {errors.building && <span className="text-sm text-gray-500">Please enter valid building</span>}
            <div>
              <input
                {
                  ...register('street1', {
                    required: true,
                    maxLength: 100
                  })
                }
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Locality / Street"
              />
              {errors.phone && <span className="text-sm text-gray-500">Please enter valid 10 digit mobile no.</span>}
            </div>
            <div>
              <input
                {
                  ...register('street2', {
                  })
                }
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Street 2"
              />
              {errors.email && <span className="text-sm text-gray-500">Please enter valid email</span>}
            </div>
            <div className="flex">
              <input
                {
                  ...register('landmark', {
                  })
                }
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Landmark (Eg. Near Panchvati Hotel)"
              />
            </div>
            <div className="flex">
              <input
                disabled
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Vasai (W)"
              />
            </div>
          </div>
          <p className="w-full justify-center py-2 px-4 text-gray-600 text-sm">Orders are servicable depending on your location.</p>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-green-700 focus:outline-none"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
    console.log(s.charAt(0).toUpperCase() + s.slice(1))
  return s.charAt(0).toUpperCase() + s.slice(1);
}