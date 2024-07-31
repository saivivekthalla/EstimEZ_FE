import React from "react";
import TabContent from "./TabContent";

const PhaseComponent = () => {
  const [verticalValue, setverticalVerticalValue] = React.useState(0);

  const handleChangeForVertical = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setverticalVerticalValue(newValue);
  };
  return (
    <div className="bg-transparent shadow-none">
      <div className="md:flex m-4 gap-1">
        <div className="flex-col tabs-vertical">
          <div
            className={`tab-root ${
              verticalValue === 0 &&
              "relative p-14 -right-1 selected rounded-l-md mb-3"
            }`}
          >
            <button
              className={`inline-flex justify-center items-center px-4 py-3 bg-[#003F9DA6] text-white font-bold rounded-tl-lg rounded-bl-lg mb-[20px] h-[86px] w-[110px] 
              ${
                verticalValue === 0 &&
                "vertical-container discover left-3 top-0 absolute rounded"
              }`}
              onClick={(e) => handleChangeForVertical(e, 0)}
            >
              DISCOVER
            </button>
          </div>
          <div
            className={`tab-root ${
              verticalValue === 1 &&
              "relative p-14 selected rounded-l-md mb-5 -right-1"
            }`}
          >
            <button
              className={`inline-flex justify-center items-center px-4 py-3 bg-[#003F9DA6] text-white font-bold rounded-tl-lg rounded-bl-lg mb-[20px] h-[86px] w-[110px] ${
                verticalValue === 1 &&
                "vertical-container left-3 top-0 absolute concieve rounded"
              }`}
              onClick={(e) => handleChangeForVertical(e, 1)}
            >
              CONCIEVE
            </button>
          </div>
          <div
            className={`tab-root ${
              verticalValue === 2 && "relative p-14 selected rounded-l-md -right-1"
            }`}
          >
            <button
              className={`inline-flex justify-center items-center px-4 py-3 bg-[#003F9DA6] text-white font-bold rounded-tl-lg rounded-bl-lg mb-[20px] h-[86px] w-[110px] ${
                verticalValue === 2 &&
                "vertical-container left-3 top-0 absolute build rounded"
              }`}
              onClick={(e) => handleChangeForVertical(e, 2)}
            >
              BUILD
            </button>
          </div>
        </div>
        <div
          className={`bg-[#B09FFF40] rounded-tr-lg rounded-b-lg w-full ${
            verticalValue === 2 ? "rounded-bl-none" : ""
          }`}
        >
          <div className={`${verticalValue === 0 ? "block" : "hidden"}`}>
            <TabContent name="Discover" type="discover" />
          </div>
          <div className={`${verticalValue === 1 ? "block" : "hidden"}`}>
            <TabContent name="Conceive" type="conceive" />
          </div>
          <div className={`${verticalValue === 2 ? "block" : "hidden"}`}>
            <TabContent name="Build" type="build" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseComponent;
