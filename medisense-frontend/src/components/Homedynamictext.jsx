import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js'; // We import the engine directly

const Homedynamictext = () => {
  // Create a reference to the HTML element where typing happens
  const el = useRef(null);

  useEffect(() => {
    // Initialize Typed.js
    const typed = new Typed(el.current, {
      strings: [
        "AI-Powered Health Predictions",
        "Early detection made simple, fast, and accessible for everyone.",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true
    });

    // cleanup: Destroy the instance when component unmounts
    return () => {
      typed.destroy();
    };
  }, []);

  return (
      
      <div style={{ fontSize: '2.3rem', fontWeight: 'bold', color: 'white' }}>
        {/* The typing effect will be attached to this span */}
        <span ref={el} />
      </div>
    // </div>
  );
};

export default Homedynamictext;