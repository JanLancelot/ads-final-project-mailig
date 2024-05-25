import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { Spotlight } from "../components/ui/Spotlight";

import lancelot from "../images/lancelot.png";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState([]);

  const logosContainerRef = useRef(null);
  const logosRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const q = query(
        collection(db, "projects"),
        where("featured", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map((doc) => doc.data());
      setFeaturedProjects(projects);
    };

    fetchFeaturedProjects();

    const unsubscribe = onSnapshot(
      collection(db, "messages"),
      (querySnapshot) => {
        let unreadCount = 0;
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          if (!message.read) {
            unreadCount++;
          }
        });
        setUnreadCount(unreadCount);
      }
    );

    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const messagesRef = collection(db, "messages"); 
      await addDoc(messagesRef, {
        ...formData,
        read: false,
        timestamp: new Date(),
      });
      setFormSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error adding document:", error);
      setErrorMessage("An error occurred while sending your message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div
        className="h-[60rem] w-full flex md:items-center md:justify-center bg-black/[0.96] relative overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, transparent 0 calc(50% - 2px), rgba(255, 255, 255, 0.04) calc(50%) calc(50% + 2px), transparent calc(50% + 2px) 100%), repeating-linear-gradient(to bottom, transparent 0 calc(50% - 2px), rgba(255, 255, 255, 0.04) calc(50%) calc(50% + 2px), transparent calc(50% + 2px) 100%)",
          backgroundSize: "20px 20px",
        }}
      >
        {" "}
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
              fill="white"
            />
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                Welcome to <span className="text-yellow-400">Lancelot</span>'s
                Portfolio
              </h1>
              <p className="mt-3 text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl mx-auto md:mt-5 md:text-xl">
                I'm a passionate web developer specializing in React, Firebase,
                and Tailwind CSS. Explore my projects, skills, and get in touch
                to discuss potential collaborations.
              </p>
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="rounded-md shadow">
                  <a
                    href="#projects"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition duration-300 md:py-4 md:text-lg md:px-10"
                  >
                    View Projects
                  </a>
                </div>
                <div className="rounded-md shadow relative">
                  <a
                    href="#contact"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-yellow-400 hover:bg-yellow-500 transition duration-300 md:py-4 md:text-lg md:px-10"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={lancelot}
                alt="Lancelot's Portrait"
                className="rounded-full shadow-lg max-w-md mx-auto"
              />
            </motion.div>
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
                  <h3 className="text-lg font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <Link
                    to={project.link}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    View Website
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
            Contact Me
          </h2>
          {formSubmitted ? (
            <p className="text-green-500 text-center mb-4">
              Thank you for your message!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-white font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-white font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-white font-bold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-center mt-2">{errorMessage}</p>
              )}
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
