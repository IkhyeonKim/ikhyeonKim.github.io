import React, { useCallback, useEffect, useRef, useState } from "react";
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

const BallPage = (props) => {
  const { ...rest } = props;

  const canvasRef = useRef();
  const requestRef = useRef();
  const [ctx, setCtx] = useState();

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  const animate = (time) => {
    // The 'state' will always be the initial value here
    requestRef.current = requestAnimationFrame(animate);
  };

  const bounceWindow = useCallback((canvasWidth, canvasHeight, x, y, speed, radius, vx, vy) => {
    const minX = radius;
    const minY = radius;
    const maxX = canvasWidth - radius;
    const maxY = canvasHeight - radius;

    let newX = x;
    let newY = y;
    let _vx = vx;
    let _vy = vy;

    if (x <= minX || x >= maxX) {
      _vx *= -1;
      newX += _vx;
    } else if (y <= minY || y >= maxY) {
      _vy *= -1;
      newY += _vy;
    } else {
      newX += _vx;
      newY += _vy;
    }

    return { x: newX, y: newY, vx: _vx, vy: _vy };
  }, []);

  const drawBall = useCallback((ctx, frameCount, x, y, radius) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // console.log({ ctx, frameCount, x, y, radius });

    ctx.fillStyle = "#fdd700";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI); // x,y,radius
    // ctx.arc(x, y, radius * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI); // x,y,radius
    ctx.fill();
  }, []);

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

    console.log(canvasRef.current.width);
    let speed = 5;
    const radius = 50;

    const diameter = radius * 2;

    let x = radius + Math.random() * (canvasRef.current.width - diameter);
    let y = radius + Math.random() * (canvasRef.current.height - diameter);
    let vx = speed;
    let vy = speed;

    let frameCount = 0;
    let animationFrameId;

    //Our draw came here
    const render = () => {
      frameCount++;

      const newXY = bounceWindow(canvasRef.current.width, canvasRef.current.height, x, y, speed, radius, vx, vy);
      x = newXY.x;
      y = newXY.y;
      vx = newXY.vx;
      vy = newXY.vy;
      //   speed = newXY.speed;

      drawBall(context, frameCount, x, y, radius);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [bounceWindow, drawBall]);

  return (
    <BallBounceStyle>
      <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} {...rest}></canvas>
    </BallBounceStyle>
  );
};

export default BallPage;
