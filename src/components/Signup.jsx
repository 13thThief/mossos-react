const API = import.meta.env.VITE_APP_API;

import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';

import Loader from '@components/common/Loader';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const onSubmit = data => {
    setIsLoading(true);

    axios.post(`${API}/signup`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      password1: data.password1,
      password2: data.password2,
    })
    .then(res => {
      return res.data;
    })
    .then((data) => {
      setIsLoading(false);
      alert(data.message);
      history.replace('/login')
    })
    .catch((error) => {
      if(error.response){
        alert(error.response.data?.message)
      }
      setIsLoading(false);
    })
  }
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Loader show={isLoading} />
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <Link to="/" className="">
            <img title="Mossos" className="h-12 w-34" alt="Mossos" src="/images/mossos-logo.png" />
          </Link>
        </div>
        <div>
           <h2 className="mt-6 text-center text-2xl text-gray-700">Create your new account</h2>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex">
              <input
                {
                  ...register('firstName', {
                    required: true
                  })
                }
                type="text"
                className="appearance-none rounded-none relative block w-full px-2 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-tl-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
              />
              <input
                {
                  ...register('lastName', {
                    required: true
                  })
                }
                type="text"
                className="appearance-none rounded-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-tr-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
              />
            </div>
            {errors.firstName && <span className="text-sm text-red-700">Please enter your full name</span>}
            <div>
              <input
                {
                  ...register('phone', {
                    required: true,
                    validate: validatePhone,
                    minLength: 10,
                    maxLength: 10,
                  })
                }
                type="tel"
                className="appearance-none rounded-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Mobile No."
              />
              {errors.phone && <span className="text-sm text-red-700">Please enter valid 10 digit mobile no.</span>}
            </div>
            <div>
              <input
                {
                  ...register('email', {
                    required: true,
                    validate: validateEmail
                  })
                }
                type="email"
                className="appearance-none rounded-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email Address"
              />
              {errors.email && <span className="text-sm text-red-700">Please enter valid email</span>}
            </div>
            <div className="flex">
              <input
                {
                  ...register('password1', {
                    required: true,
                    minLength: 8,
                    validate: validatePassword
                  })
                }
                type="password"
                className="appearance-none rounded-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <input
                {
                  ...register('password2', {
                    required: true,
                    minLength: 8,
                    validate: validatePassword
                  })
                }
                type="password"
                className="appearance-none rounded-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password again"
              />
            </div>
            { (errors.password1 || errors.password2) && <span className="text-sm text-red-500">Password should be atleast 8 characters long</span>}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gray-900 hover:bg-green-700 focus:outline-none"
            >
              Sign up
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">
           <div className="text-md">
              <Link to="/login" className="text-lg text-green-600">
                I want to log in!
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const plusEmailRegex = /^[^+@]+@\S+$/i;
const phoneRegex = /\d{10}/;

const validatePhone = phone => phoneRegex.test(phone);

const validateEmail = email => {
  if (!email) return false;
  if(!emailRegex.test(email)) return false;
  if(!plusEmailRegex.test(email)) return false;
  return true;
};

const validatePassword = password => {
  if (!password) return false;
  if(password.length < 8)
    return false;
  return true;
};

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1);
}