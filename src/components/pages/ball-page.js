import React, { useEffect, useRef, useState } from "react";
import BallBounceStyle from "../../styles/ball-collision-bouce-style";

class Ball {
  constructor(stageWidth, stageHeight, speed, radius) {
    this.radius = radius;
    this.vx = speed;
    this.vy = speed;

    const diameter = radius * 2;
    this.x = diameter + (Math.random() * stageWidth - diameter);
    this.y = diameter + (Math.random() * stageHeight - diameter);
  }

  draw(ctx, stageWidth, stageHeight) {
    this.x += this.vx;
    this.y += this.vy;

    ctx.fillStyle = "fdd700";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const BallPage = () => {
  const canvasRef = useRef();
  const requestRef = useRef();
  const [ctx, setCtx] = useState();

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  const animate = (time) => {
    // The 'state' will always be the initial value here
    requestRef.current = requestAnimationFrame(animate);
  };

  const draw = (ctx) => {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  //   useEffect(() => {
  //     requestRef.current = requestAnimationFrame(animate);
  //     return () => cancelAnimationFrame(requestRef.current);
  //   }, []); // Make sure the effect runs only once

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(document.body.clientWidth);
      setCanvasHeight(document.body.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
    const context = canvasRef.current.getContext("2d");

    let frameCount = 0;
    let animationFrameId;

    //Our draw came here
    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <BallBounceStyle>
      <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef}></canvas>
    </BallBounceStyle>
  );
};

export default BallPage;
