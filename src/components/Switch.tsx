import React, { useState } from "react";

interface ToggleSwitchProps {
  onLabel?: string;
  offLabel?: string;
  onToggle: (e: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onLabel, offLabel, onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  return (
    <button
      className={`w-28 h-8 flex items-center rounded-full p-1 cursor-pointer ${
        isOn ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={handleToggle}
    >
      <div
        className={`w-14 h-6 bg-white rounded-full shadow-md transform transition-transform flex justify-center items-center ${
          isOn ? "translate-x-12" : "translate-x-0"
        }`}
      >{isOn ? onLabel : offLabel}</div>
    </button>
  );
};

export default ToggleSwitch;
