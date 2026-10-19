import React, { Suspense } from "react";
import { About, Contact, Experience, Hero, Navbar, StarsCanvas, Tech, Works } from "../components";

const Home = () => (
  <div className="relative z-0 bg-primary">
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <Navbar /><Hero />
    </div>
    <About /><Experience /><Tech /><Works />
    <div className="relative z-0"><Contact /><Suspense fallback={null}><StarsCanvas /></Suspense></div>
  </div>
);

export default Home;
