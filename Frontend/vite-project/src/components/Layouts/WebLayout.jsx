// src/components/Layouts/WebLayout.jsx
import NavigationBar from "../Navbar";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import LiquidEther from '../LiquidEther/LiquidEther';

const WebLayout = () => {
    return (
    <>
    {/* Fixed Background Animation */ }
    < div className = "background-animation" >
            <LiquidEther
                colors={['#5227FF', '#FF9FFC', '#B19EEF', '#8b5cf6', '#ec4899']}
                mouseForce={20}
                cursorSize={120}
                isViscous={false}
                viscous={30}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.5}
                isBounce={false}
                autoDemo={true}
                autoSpeed={0.5}
                autoIntensity={2.2}
                takeoverDuration={0.25}
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