import { Outlet } from "react-router";
import { ModeToggle } from "../mode-toggle";


export default function Navbar() {
  return(
    <>
      <nav className='relative w-full flex flex-row p-3 z-10'>
        <div className="">hi</div>
      </nav>
      <Outlet />
    </>
  );
}