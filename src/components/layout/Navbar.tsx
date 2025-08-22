import { Outlet } from 'react-router';
// import { ModeToggle } from "../mode-toggle";

export default function Navbar() {
  return (
    <>
      <nav className='!absolute w-full flex bg-transparent flex-row p-3 z-10'>
        <div className=''>hi</div>
      </nav>
      <Outlet />
    </>
  );
}
