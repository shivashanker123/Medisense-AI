import { useEffect, useRef } from "react";
import Typed from "typed.js";

function Homedynamictext({
  strings = [],
  className = "",
  typeSpeed = 52,
  backSpeed = 28,
  backDelay = 1500,
  loop = true,
  showCursor = true,
}) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || strings.length === 0) {
      return undefined;
    }

    const typed = new Typed(textRef.current, {
      strings,
      typeSpeed,
      backSpeed,
      backDelay,
      loop,
      showCursor,
      smartBackspace: true,
    });

    return () => {
      typed.destroy();
    };
  }, [backDelay, backSpeed, loop, showCursor, strings, typeSpeed]);

  return <span ref={textRef} className={className} />;
}

export default Homedynamictext;
