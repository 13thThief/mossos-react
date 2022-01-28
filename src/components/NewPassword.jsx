const API = import.meta.env.VITE_APP_API;

import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import {post} from 'axios';

import Loader from '@components/common/Loader';

export default function Signup() {
  const [load, setLoad] = useState(false);
  const history = useHistory();

  const onSubmit = data => {
    setLoad(true);

    const p = new URLSearchParams(window.location.search);
    let q = Object.fromEntries(p.entries());

    post(`${API}/new-password`, {
      password1: data.password1,
      password2: data.password2,
      pulsar: q.pulsar
    })
    .then(res => {
      return res.data;
    })
    .then(data => {
      setLoad(false);
      alert(data.message);
      history.replace('/login')
    })
    .catch((error) => {
      if(error.response){
        alert(error.response.data?.message)
      }
      setLoad(false);
    })
  }
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Loader show={load} />
      <div className="max-w-md w-full space-y-8">
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm">
            <div>
             <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Reset password</h2>
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
                className="relative block w-full px-3 py-2 border border-b-0 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div className="flex">
              <input
                {
                  ...register('password2', {
                    required: true,
                    minLength: 8,
                    validate: validatePassword
                  })
                }
                type="password"
                className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password again"
              />
            </div>
            { (errors.password1 || errors.password2) && <span className="text-sm text-red-500">Password should be atleast 8 characters long</span>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent font-bold rounded-md text-white bg-gray-900 hover:bg-green-700 focus:outline-none"
            >
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const validatePassword = password => {
  if (!password) return false;
  if(password.length < 8)
    return false;
  return true;
};
