import React from "react";

const Button = ({ label, onClick, color = "blue" }) => {
  const colorClass = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
  }[color];

  return (
    <button
      onClick={onClick}
      className={`${colorClass} text-white px-4 py-2 rounded-lg transition-all`}
    >
      {label}
    </button>
  );
};

export default Button;
