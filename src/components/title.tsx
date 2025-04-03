import React from "react";
import { useNavigate } from "react-router-dom";

import back from "../assets/back.svg"

function Title(props: TitleProps) {
  const { title, showBackButton = false } = props;
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-[16px] items-start">
      <div className="flex gap-5">
        {showBackButton && (
          <button
            onClick={handleBackButtonClick}
            className="flex items-center gap-2 bg-transparent text-blue-600 hover:text-blue-800"
          >
            <img src={back} alt="back-button"></img>
          </button>
        )}
        <h2>{title}</h2>
      </div>
      <div className="h-[2px] bg-[#D4D4D4] w-full" />
    </div>
  );
}

interface TitleProps {
  title: string;
  showBackButton?: boolean;
}

export default Title;
