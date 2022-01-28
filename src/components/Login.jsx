const API = import.meta.env.VITE_APP_API;

import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';

import Loader from '@components/common/Loader';

export default function Login({ setToken }) {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const onSubmit = data => {
    setIsLoading(true);

    axios.post(`${API}/login`, {
      email: data.email,
      password: data.password
    })
      .then(res => {
        return res.data;
      })
      .then(data => {
        localStorage.setItem('user', data.user.id);
        localStorage.setItem('name', `${data.user.first_name} ${data.user.last_name}`);
        localStorage.setItem('login', 1);
        setIsLoading(false);
        setToken(data.token);
        if(!data.user.addressExists){
            history.replace('/new-address'); 
        }
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
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <Link to="/" className="">
            <img title="Mossos" className="h-12 w-34" alt="Mossos" src="/images/mossos-logo.png" />
          </Link>
        </div>
        <div>
           <h2 className="mt-6 text-center text-2xl text-gray-900">Log in to your account</h2>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                {
                  ...register('email', {
                    required: true,
                    validate: validateEmail
                  })
                }
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && <span className="text-sm text-gray-500">Please enter valid email</span>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {
                  ...register('password', {
                    required: true,
                    validate: validatePassword
                  })
                }
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && <span className="text-sm text-gray-500">Invalid Password</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gray-900 hover:bg-green-700 focus:outline-none"
            >
              Log in
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
           <div className="text-md">
              <Link to="/signup" className="text-lg text-green-600 hover:text-gray-900">
                I want to sign up!
              </Link>
            </div>
            <div className="text-md mt-3">
              <a href="/forgot-password.html" className="text-green-600 hover:text-gray-900">
                Forgot your password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const plusEmailRegex = /^[^+@]+@\S+$/i;

const validateEmail = email => {
  if (!email)
    return false;
  if(!plusEmailRegex.test(email))
    return false;
  if(!emailRegex.test(email))
    return false;
  return true;
};

const validatePassword = password => {
  if (!password)
    return false;
  if(password.length < 8)
    return false;
  return true;
};