import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [selectImage, setSelectImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Shahzaib");
  const [bio, setBio] = useState("shahzaib@gmail.com");

  const handleSubmit = async (e)=>{
    e.preventDefault();
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              className={`w-12 h-12 ${selectImage && "rounded-full"}`}
              src={
                selectImage
                  ? URL.createObjectURL(selectImage)
                  : assets.avatar_icon
              }
              alt="avatar_icon"
            />
            upload profile image
          </label>
          <input
          onChange={(e)=>setName(e.target.value)}
          value={name}
            type="text"
            required
            placeholder="Your name..."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
          <textarea onChange={(e)=>setBio(e.target.value)}
          value={bio} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={4} placeholder="Write profile bio" required></textarea>
          <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer " type="submit">Save</button>
        </form>
        <img className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10" src={assets.logo_icon} alt="logo_icon" />
      </div>
    </div>
  );
};

export default ProfilePage;
