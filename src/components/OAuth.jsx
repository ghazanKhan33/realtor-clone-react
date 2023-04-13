import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check whethte the user already exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()){
        await setDoc(docRef,{
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp()
        })
      }
      navigate('/');
    } catch (error) {
      toast.error("Could not authorize with Google")
    }
  };

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="w-full flex gap-2 justify-center items-center bg-red-600 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-700 active:bg-red-800 hover:shadow-lg transitio duration-300 ease-in-out rounded"
    >
      <FcGoogle className="text-2xl bg-white rounded-full" /> Continue with
      Google
    </button>
  );
};

export default OAuth;
