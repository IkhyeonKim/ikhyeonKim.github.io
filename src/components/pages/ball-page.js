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

const radius = 50;

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

  const bounceBlock = useCallback((block, circleX, circleY, vx, vy) => {
    const { width, height, x, y } = block;
    const minX = x - radius;
    const minY = y - radius;
    const maxX = x + width + radius;
    const maxY = y + height + radius;

    let newX = circleX;
    let newY = circleY;
    let _vx = vx;
    let _vy = vy;

    if (circleX > minX && circleX < maxX && circleY > minY && circleY < maxY) {
      const x1 = Math.abs(minX - circleX);
      const x2 = Math.abs(circleX - maxX);
      const y1 = Math.abs(minY - circleY);
      const y2 = Math.abs(circleY - maxY);

      const min1 = Math.min(x1, x2);
      const min2 = Math.min(y1, y2);
      const min = Math.min(min1, min2);

      if (min === min1) {
        // 엑스 축으로 튕기는가
        _vx *= -1;
        newX += _vx;
      } else if (min === min2) {
        // y축으로 튕기는가
        _vy *= -1;
        newY += _vy;
      }
    }
    return { x: newX, y: newY, vx: _vx, vy: _vy };
  }, []);

  const drawBall = useCallback((ctx, frameCount, x, y, radius) => {
    // console.log({ ctx, frameCount, x, y, radius });

    ctx.fillStyle = "#fdd700";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI); // x,y,radius
    // ctx.arc(x, y, radius * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI); // x,y,radius
    ctx.fill();
  }, []);

  const drawBlock = useCallback((ctx, width, height, x, y) => {
    const xGap = 70;
    const yGap = 70;

    const maxX = width + x;
    const maxY = height + y;

    ctx.fillStyle = "#ff384e";
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();

    // bottom shadow
    ctx.fillStyle = "#190f3a";
    ctx.beginPath();
    ctx.moveTo(maxX, maxY);
    ctx.lineTo(maxX - xGap, maxY + yGap);
    ctx.lineTo(x - xGap, maxY + yGap);
    ctx.lineTo(x, maxY);
    ctx.fill();

    // side shadow
    ctx.fillStyle = "#9d0919";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, maxY);
    ctx.lineTo(x - xGap, maxY + yGap);
    ctx.lineTo(x - xGap, maxY + yGap - height);
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
    let speed = 10;

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
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const newXY = bounceWindow(canvasRef.current.width, canvasRef.current.height, x, y, speed, radius, vx, vy);
      x = newXY.x;
      y = newXY.y;
      vx = newXY.vx;
      vy = newXY.vy;
      //   speed = newXY.speed;

      drawBlock(context, 600, 20, 170, 230);
      drawBall(context, frameCount, x, y, radius);

      const bouncedXY = bounceBlock({ width: 600, height: 20, x: 170, y: 230 }, x, y, vx, vy);
      x = bouncedXY.x;
      y = bouncedXY.y;
      vx = bouncedXY.vx;
      vy = bouncedXY.vy;

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [bounceWindow, bounceBlock, drawBall, drawBlock]);

  return (
    <BallBounceStyle>
      <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} {...rest}></canvas>
    </BallBounceStyle>
  );
};

export default BallPage;
