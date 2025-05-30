import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSide from "../components/RightSide";

const HomePage = () => {
  const [selectUser, setSelectUser] = useState(false);
  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[2%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${
          selectUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar selectUser={selectUser} setSelectUser={setSelectUser} />
        <ChatContainer selectUser={selectUser} setSelectUser={setSelectUser} />
        <RightSide selectUser={selectUser} setSelectUser={setSelectUser} />
      </div>
    </div>
  );
};

export default HomePage;
