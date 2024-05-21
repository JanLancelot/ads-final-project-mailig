import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const logosContainerRef = useRef(null);
  const logosRef = useRef(null);

  useEffect(() => {
    // Marquee scroll effect for client logos
    const logosContainer = logosContainerRef.current;
    const logos = logosRef.current;
    let scrollPosition = 0;
    let isCloned = false;

    function marqueeScroll() {
      scrollPosition -= 1;
      logosContainer.style.transform = `translateX(${scrollPosition}px)`;

      if (scrollPosition <= -logos.offsetWidth / 2 && !isCloned) {
        logos.innerHTML += logos.innerHTML;
        isCloned = true;
      }

      if (scrollPosition <= -logos.offsetWidth) {
        scrollPosition = 0;
        isCloned = false;
        logos.innerHTML = logos.innerHTML.slice(0, logos.innerHTML.length / 2);
      }

      requestAnimationFrame(marqueeScroll);
    }

    marqueeScroll();
  }, []);

  const featuredProjects = [
    {
      title: "E-Commerce Platform",
      description:
        "Developed a robust e-commerce platform with React, handling product listings, shopping cart, and secure checkout.",
      image: "https://colorlib.com/wp/wp-content/uploads/sites/2/15_awesome-websites.jpg",
      link: "/project1",
    },
    {
      title: "Real-Time Chat App",
      description:
        "Built a real-time chat application using Firebase for seamless communication and group messaging.",
      image: "https://colorlib.com/wp/wp-content/uploads/sites/2/15_awesome-websites.jpg",
      link: "/project2",
    },
    {
      title: "Portfolio Website",
      description:
        "Designed and implemented a modern portfolio website showcasing my skills and projects.",
      image: "https://colorlib.com/wp/wp-content/uploads/sites/2/15_awesome-websites.jpg",
      link: "/project3",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
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

      {/* Client Logos Section */}
      <div className="bg-blue-950 py-2">
        <div ref={logosContainerRef} className="flex whitespace-nowrap space-x-4 overflow-hidden">
          <div ref={logosRef} className="flex">
            <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 1" className="h-12 w-auto" />
            <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 2" className="h-12 w-auto" />
            <img src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png" alt="Client 3" className="h-12 w-auto" />
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <section id="projects" className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <Link
                    to={project.link}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;