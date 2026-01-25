import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const Homedynamictext = () => {
  const el = useRef(null);

  useEffect(() => {
    // Initialize Typed.js
    const typed = new Typed(el.current, {
      strings: [
        "AI-Powered Health Predictions",
        "Smart Diagnosis,Faster Decisions.",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div style={{ fontSize: "2.3rem", fontWeight: "bold", color: "white" }}>
      <span ref={el} />
    </div>
  );
};

export default Homedynamictext;
