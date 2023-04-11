import React from 'react'
import {FcGoogle} from 'react-icons/fc'

const OAuth = () => {
  return (
    <button className='w-full flex gap-2 justify-center items-center bg-red-600 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-700 active:bg-red-800 hover:shadow-lg transitio duration-300 ease-in-out rounded'><FcGoogle className='text-2xl bg-white rounded-full' /> Continue with Google</button>
  )
}

export default OAuth