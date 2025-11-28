import React from "react";
import { useNavigate } from "react-router-dom";

const FunctionCard = ({ icon: Icon, title, href, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else if (href) navigate(href);
  };

  return (
    <button
      onClick={handleClick}
      className="flex overflow-hidden rounded-[10px] border-0 shadow-none h-[140px] hover:opacity-75"
    >
      <div className="flex p-0 w-full">
        <div className="w-[141px] h-full bg-white rounded-[10px_0px_0px_10px] border-[3px] border-solid border-primary flex items-center justify-center text-primary">
          {Icon && <Icon size={90} />}
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center rounded-[0px_10px_10px_0px]">
          <h3 className="font-extrabold text-white text-[26px] text-center px-4">
            {title}
          </h3>
        </div>
      </div>
    </button>
  );
};


export default FunctionCard;
