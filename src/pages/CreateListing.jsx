import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "sale",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((pre) => ({
        ...pre,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((pre) => ({
        ...pre,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuid()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
            setLoading(false);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
              setLoading(false);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      console.log(error);
      toast.error("Images not uploaded");
    });
    const formDataCopy = { ...formData, imgUrls, timestamp: serverTimestamp() };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Lisiting created");
    navigate(`/category/${formData.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 mb-6">
        <div>
          <label className="text-lg mt-6 font-semibold">Sell / Rent</label>
          <div className="flex gap-6">
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                type === "rent"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
              id="type"
              value="sale"
              onClick={onChange}
            >
              Sell
            </button>
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                type === "sale"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
              id="type"
              value="rent"
              onClick={onChange}
            >
              Rent
            </button>
          </div>
        </div>
        <div>
          <label className="text-lg font-semibold">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            maxLength="32"
            minLength="10"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600"
          />
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="px-4 py-2 text-xl text-gray-700 border border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <div>
          <label className="text-lg mt-6 font-semibold">Parking spot</label>
          <div className="flex gap-6">
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                !parking ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
              id="parking"
              value={true}
              onClick={onChange}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                parking ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
              id="parking"
              value={false}
              onClick={onChange}
            >
              No
            </button>
          </div>
        </div>
        <div>
          <label className="text-lg mt-6 font-semibold">Furnished</label>
          <div className="flex gap-6">
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
              id="furnished"
              value={true}
              onClick={onChange}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                furnished ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
              id="furnished"
              value={false}
              onClick={onChange}
            >
              No
            </button>
          </div>
        </div>
        <div>
          <label className="text-lg font-semibold">Address</label>
          <textarea
            type="text"
            id="address"
            value={address}
            onChange={onChange}
            placeholder="Address"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600"
          />
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-lg font-semibold">Latitude</p>
            <input
              type="number"
              id="latitude"
              value={latitude}
              min="-90"
              max="90"
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Longitude</p>
            <input
              type="number"
              id="longitude"
              value={longitude}
              min="-180"
              max="180"
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600 text-center"
            />
          </div>
        </div>

        <div>
          <label className="text-lg font-semibold">Description</label>
          <textarea
            type="text"
            id="description"
            value={description}
            onChange={onChange}
            placeholder="Description"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600"
          />
        </div>
        <div>
          <label className="text-lg mt-6 font-semibold">Offer</label>
          <div className="flex gap-6">
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                !offer ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
              id="offer"
              value={true}
              onClick={onChange}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out w-full ${
                offer ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
              id="offer"
              value={false}
              onClick={onChange}
            >
              No
            </button>
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg">Regular Price</p>
          <div className="flex items-center gap-6">
            <input
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onChange}
              min="50"
              max="40000000"
              required
              className="px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600 text-center"
            />
            {type === "rent" && (
              <p className="text-md whitespace-nowrap ">$ / Month</p>
            )}
          </div>
        </div>
        {offer && (
          <div>
            <p className="font-semibold text-lg">Discounted Price</p>
            <div className="flex items-center gap-6">
              <input
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onChange}
                min="50"
                max="40000000"
                required={offer}
                className="px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <p className="text-md whitespace-nowrap ">$ / Month</p>
              )}
            </div>
          </div>
        )}
        <div>
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-500">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
