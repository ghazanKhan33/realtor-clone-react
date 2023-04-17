import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const [pageState, setPageState] = useState("Sign in")
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(()=>{
 onAuthStateChanged(auth, (user)=>{
  if(user){
    setPageState("Profile")
  }else{
    setPageState('Sign in')
  }
 })
  },[auth])
  const pathmatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick= {()=> navigate('/')}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                pathmatchRoute("/") ? "text-black border-b-4 border-b-red-500" : "border-b-transparent text-gray-400"
              }`}
              onClick= {()=> navigate('/')}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold  border-b-[3px] ${
                pathmatchRoute("/offers") ? "text-black border-b-red-500" : "border-b-transparent text-gray-400"
              }`}
              onClick= {()=> navigate('/offers')}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                pathmatchRoute("/sign-in") || pathmatchRoute("/profile") ? "text-black border-b-red-500" : "border-b-transparent text-gray-400"
              }`}
              onClick= {()=> navigate('/profile ')}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
