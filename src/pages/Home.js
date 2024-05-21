import React from "react";
import Layout from "../components/Layout";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import WROLogo from '../images/wro.webp';

const Home = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Adjust the number of logos to show at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Adjust the speed of the slide animation
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 768, // Adjust for smaller screens
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

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

      <div className="client-logos">
        <Slider {...settings}>
          <div>
            <img src={WROLogo} alt="WRO Logo" />
          </div>
        </Slider>
      </div>
    </Layout>
  );
};

export default Home;
