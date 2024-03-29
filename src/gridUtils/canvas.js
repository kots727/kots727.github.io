import React, { useRef, useEffect, useState, useContext } from 'react'
import {GridField} from './Grid.js'
import {Context} from '../App.js'

export function Canvas() { 
const [grid,setGrid] = useContext(Context)
     const canvasRef = useRef(null)

    useEffect(() => {
      const interval = setInterval(() => {
          
     const c = canvasRef.current;
     c.width  = window.innerWidth;
     c.height = window.innerHeight;
     
var ctx = c.getContext("2d");
if(grid.height!==300){
  ctx.rect(0, 0,c.width, c.height);
  ctx.fill();
grid.draw(ctx)
}
      }, 10);
      return () => clearInterval(interval);
    }, [grid])

    return (
    <canvas ref={canvasRef} style={{ 
      height: '100vh',
      width: '100vw',
      display:'block',
    }}></canvas>
    );
}
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  function lerp(t, a, b) {
    return a + t * (b - a);
  }
  function grad2(i, x, y) {
    const v = i & 1 ? y : x;
    return i & 2 ? -v : v;
  }
  const P = Uint8Array.of(151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180)
    const p = new Uint8Array(512);
    for (let i = 0; i < 256; ++i) p[i] = p[i + 256] = P[i];
function perlin2(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const X = xi & 255, Y = yi & 255;
    const u = fade(x -= xi), v = fade(y -= yi);
    const A = p[X] + Y, B = p[X + 1] + Y;
    return lerp(
      v,
      lerp(u, grad2(p[A], x, y), grad2(p[B], x - 1, y)),
      lerp(u, grad2(p[A + 1], x, y - 1), grad2(p[B + 1], x - 1, y - 1))
    );
  }
  function octave(noise, octaves) {
    return function(x, y, z) {
      let total = 0;
      let frequency = 1;
      let amplitude = 1;
      let value = 0;
      for (let i = 0; i < octaves; ++i) {
        value += noise(x * frequency, y * frequency, z * frequency) * amplitude;
        total += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      return value / total;
    };
  }
export function makePerlinField(
    width,
    height,
    nx,
    ny,
    noiseScale = 1,
    noiseOctaves = 2,
    noiseOffset = 0,
    seeds = [0, 0],
    angleScale = 4
  ) {
    let g = new GridField(width, height,nx,ny);
    let [seedX, seedY] = seeds;
    let noise = octave(perlin2, noiseOctaves);
    for (let i =0; i<nx; i++) {
      for (let j=0; j<ny; j++) {
        let angle =
          (noiseOffset +
            noise(
              (seedX + i / g.nx) * noiseScale,
              (seedY + j / g.ny) * noiseScale
            )) *
          Math.PI *
          0.7 *
          angleScale;
        g.setAngle(i, j, angle);
      }
    }
    return g;
  }