import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Hero, Navbar, Papers, StarsCanvas, Tech, Works } from "./components";

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar /><Hero />
      </div>
      <About /><Experience /><Tech /><Papers /><Works />
      <div className="relative z-0"><Contact /><Suspense fallback={null}><StarsCanvas /></Suspense></div>
    </div>
  </BrowserRouter>
);

export default App;
