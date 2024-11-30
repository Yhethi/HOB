import React, { useRef, useState } from "react";
import anime from "animejs";
import "../../assets/styles/tools/ButtonAnimation.scss";

const AnimatedButton = () => {
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const progressBarRef = useRef(null);
  const pathRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const pathEl = pathRef.current;
    const offset = pathEl.getTotalLength();

    anime
      .timeline({
        complete: () => {
          buttonRef.current.classList.add("button");
          progressBarRef.current.style.width = "0";
          progressBarRef.current.style.height = "10px";
          progressBarRef.current.style.borderRadius = "5px";
          progressBarRef.current.style.backgroundColor = "#2B2D2F";
          setIsAnimating(false);
        },
      })
      .add({
        targets: textRef.current,
        duration: 0,
        opacity: "0",
      })
      .add({
        targets: buttonRef.current,
        duration: 1300,
        height: 10,
        width: "100%",
        backgroundColor: "#007bff",
        border: "0",
        borderRadius: 100,
        begin: () => {
          // Cambiar temporalmente la clase para la animación
          buttonRef.current.classList.remove("button");
        },
      })
      .add({
        targets: progressBarRef.current,
        duration: 2000,
        width: "100%",
        easing: "linear",
      })
      .add({
        targets: buttonRef.current,
        width: 0,
        duration: 1,
      })
      .add({
        targets: progressBarRef.current,
        width: "100%",
        height: 40,
        delay: 500,
        duration: 750,
        borderRadius: 80,
        backgroundColor: "#0F0",
        marginTop: "-10px",
      })
      .add({
        targets: pathEl,
        strokeDashoffset: [offset, 0],
        duration: 0,
        easing: "easeInOutSine",
      })
      .add({
        targets: buttonRef.current,
        duration: 10,
        width: "100%",
        height: "36px",
        borderRadius: "5px",
        easing: "easeOutCubic",
        complete: () => {
          textRef.current.style.opacity = "1";
        },
      })
      .add({
        targets: textRef.current,
        duration: 10,
        opacity: "1",
        easing: "easeInOutQuad",
      });
  };

  return (
    <>
      <div className="button" ref={buttonRef} onClick={handleAnimation}>
        <div className="text" ref={textRef}>
          Finalizar Compra
        </div>
      </div>
      <div className="progress-bar" ref={progressBarRef}>
        <div className="compra_realizada">
          <span>Compra Realizada</span>
          <svg x="0px" y="0px" viewBox="0 0 25 30">
            <path
              className="check"
              ref={pathRef}
              d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default AnimatedButton;
