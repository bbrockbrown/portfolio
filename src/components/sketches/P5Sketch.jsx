import { useEffect, useRef } from 'react';
import { ReactP5Wrapper } from "react-p5-wrapper";
import perlin from './perlin';

export default function P5Sketch() {
  return <ReactP5Wrapper className='absolute' sketch={perlin} />
}
