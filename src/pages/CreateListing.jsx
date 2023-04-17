import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading,setLoading] = useState(false);
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

  const onSubmit = (e)=>{
    e.preventDefault();
    setLoading(true);
    if(discountedPrice >= regularPrice){
        setLoading(false)
        toast.error("Discounted price needs to be less than regular price")
        return
    }

  }
  if(loading){
    return <Spinner/>
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
        {geolocationEnabled && (
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
                required={geolocationEnabled}
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
                required={geolocationEnabled}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600 text-center"
              />
            </div>
          </div>
        )}
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
        <div className="">
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
