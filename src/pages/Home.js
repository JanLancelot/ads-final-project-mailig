import React, { useEffect, useRef } from "react";
import Layout from "../components/Layout";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import WROLogo from '../images/wro.webp';

const Home = () => {
  const logosContainerRef = useRef(null);

  useEffect(() => {
    const logosContainer = logosContainerRef.current;
    let scrollPosition = 0;

    function marqueeScroll() {
      scrollPosition -= 1;
      logosContainer.style.transform = `translateX(${scrollPosition}px)`;

      if (scrollPosition <= -logosContainer.offsetWidth) {
        scrollPosition = 0;
      }

      requestAnimationFrame(marqueeScroll);
    }

    marqueeScroll();
  }, []);

  return (
    <Layout>
      <div className="bg-blue-900 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> 
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-yellow-400 sm:text-5xl md:text-6xl">
              Welcome to <span className="text-white">Lancelot</span>'s
              Portfolio
            </h1>
            <p className="mt-3 text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl mx-auto md:mt-5 md:text-xl">
              I'm a passionate web developer specializing in React, Firebase,
              and Tailwind CSS. Explore my projects, skills, and get in touch to
              discuss potential collaborations.
            </p>
            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="rounded-md shadow">
                <a
                  href="#projects"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 md:py-4 md:text-lg md:px-10"
                >
                  View Projects
                </a>
              </div>
              <div className="rounded-md shadow">
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-yellow-400 hover:bg-yellow-500 md:py-4 md:text-lg md:px-10"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-950 py-6">
        <div
          ref={logosContainerRef}
          className="flex whitespace-nowrap space-x-4 overflow-hidden"
        >
          {/* Add your client logos here */}
          <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 1" className="h-12 w-auto" />
          <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 2" className="h-12 w-auto" />
          <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 3" className="h-12 w-auto" />
          {/* ... (more logos) ... */}

          {/* Duplicate logos to create seamless scrolling */}
          <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 1" className="h-12 w-auto" />
          <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 2" className="h-12 w-auto" />
          <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 3" className="h-12 w-auto" />
          {/* ... (duplicate more logos) ... */}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
