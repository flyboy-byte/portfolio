import React, { useState, useEffect } from "react";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map(({ name, icon }) =>
        isMobile ? (
          <div key={name} className="flex flex-col items-center gap-2 w-16">
            <img src={icon} alt={name} className="w-12 h-12 object-contain" />
            <p className="text-white text-xs text-center leading-tight">{name}</p>
          </div>
        ) : (
          <div key={name} className="w-28 h-28">
            <BallCanvas icon={icon} />
          </div>
        )
      )}
    </div>
  );
};

export default SectionWrapper(Tech, "");
