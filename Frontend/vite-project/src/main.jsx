import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "simplebar-react/dist/simplebar.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css';
import App from './App.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'aos/dist/aos.css';
import AOS from 'aos';

const Root = () => {
  useEffect(() => {
    AOS.init({
      duration: 500, // animation duration in ms
      once: true,     // whether animation happens only once
      easing: 'ease-out-cubic',
      mirror: false,  // whether elements animate out while scrolling past
    });
  }, []);

  return <App />;
};


createRoot(document.getElementById('root')).render(
  <>
    <Root />
    <ToastContainer />
  </>,
)
