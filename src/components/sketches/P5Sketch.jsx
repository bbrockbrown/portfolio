import { ReactP5Wrapper } from "react-p5-wrapper";
import perlin from './perlin';


export default function P5Sketch({ refreshKey = 0 }) {
  return <ReactP5Wrapper key={refreshKey} className='absolute inset-0 w-full h-full' sketch={perlin} />
}
