// src/components/Layouts/WebLayout.jsx
import { useEffect, useState } from "react";
import NavigationBar from "../Navbar";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import LiquidEther from '../LiquidEther/LiquidEther';

const WebLayout = () => {
    const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bootstrap breakpoints
  const isMobile = width < 768;           // xs, sm
  const isTablet = width >= 768 && width < 992; // md
  const isLg = width >= 992;   
    return (
    <>
    {/* Fixed Background Animation */ }
    < div className = "background-animation" >
            <LiquidEther
                colors={['#5227FF', '#FF9FFC', '#B19EEF', '#8b5cf6', '#ec4899']}
                mouseForce={isLg ? 15 : isTablet ? 20 : 20}
                cursorSize={isLg ? 100 : isTablet ? 120 : 120}
                isViscous={false}
                viscous={10}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.4}
                isBounce={false}
                autoDemo={true}
                autoSpeed={0.2}
                autoIntensity={2.2}
                takeoverDuration={9.95}
                autoResumeDelay={3000}
                autoRampDuration={0.6}
                style={{ width: '100%', height: '100%' }}
            />
    </div >
    <div className="app-content d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-grow-1">
            <Outlet />
        </main>
        <Footer />
    </div>
    </>
  );
};

export default WebLayout;