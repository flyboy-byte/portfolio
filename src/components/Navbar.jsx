import React, { useEffect, useState } from 'react';
  import { Link } from 'react-router-dom';
  import { close, logo, menu } from '../assets';
  import { navLinks } from '../constants';
  import { styles } from '../styles';
  const Navbar = () => {
    const [active, setActive] = useState('');
    const [toggle, setToggle] = useState(false);
    useEffect(() => { if (toggle) setActive(''); }, [toggle]);
    return (
      <nav className={`${styles.paddingX} w-full flex items-center py-3 fixed top-0 z-20 bg-primary`}>
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2" onClick={() => { setActive(''); window.scrollTo(0,0); }}>
            <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
            <p className="text-white text-[20px] font-bold cursor-pointer flex">
              LOGAN&nbsp;<span className="sm:block hidden">NIGHT</span>
            </p>
          </Link>
          <ul className="list-none hidden sm:flex flex-row gap-6">
            {navLinks.map(l => (
              <li key={l.id} onClick={() => setActive(l.title)}
                className={`${active===l.title?'text-white':'text-secondary'} hover:text-white text-[18px] font-medium cursor-pointer`}>
                <a href={`#${l.id}`}>{l.title}</a>
              </li>
            ))}
          </ul>
          <div className="sm:hidden flex flex-1 justify-end items-center">
            <img src={toggle ? close : menu} alt="menu" className="w-[28px] h-[18px] object-contain cursor-pointer" onClick={() => setToggle(!toggle)} />
            <div className={`p-4 black-gradient absolute top-14 right-0 mx-2 my-2 min-w-[140px] z-10 rounded-xl ${toggle?'flex':'hidden'}`}>
              <ul className="list-none flex flex-col gap-4">
                {navLinks.map(l => (
                  <li key={l.id} onClick={() => { setActive(l.title); setToggle(false); }}
                    className="text-secondary hover:text-white text-[16px] font-medium cursor-pointer">
                    <a href={`#${l.id}`}>{l.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  export default Navbar;