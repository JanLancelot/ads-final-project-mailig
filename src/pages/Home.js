import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ChatWindow from '../components/ChatWindow';
import { collection, addDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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
    // Fetch featured projects from Firebase
    const fetchFeaturedProjects = async () => {
      const q = query(collection(db, "projects"), where("featured", "==", true));
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => doc.data());
      setFeaturedProjects(projects);
    };

    fetchFeaturedProjects();

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

    // Listen for changes in the 'messages' collection
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

    // Clean up the listener when the component unmounts
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
      const messagesRef = collection(db, "messages"); // Reference to the "messages" collection
      await addDoc(messagesRef, {
        ...formData,
        read: false,
        timestamp: new Date(),
      });
      setFormSubmitted(true);
      setFormData({ name: "", email: "", message: "" }); // Reset form data
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
              <div className="rounded-md shadow relative">
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-yellow-400 hover:bg-yellow-500 md:py-4 md:text-lg md:px-10"
                >
                  Get in Touch
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-sm">
                      {unreadCount}
                    </span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Logos Section */}
      <div className="bg-blue-950 py-2">
        <div
          ref={logosContainerRef}
          className="flex whitespace-nowrap space-x-4 overflow-hidden"
        >
          <div ref={logosRef} className="flex">
            <img
              src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png"
              alt="Client 1"
              className="h-12 w-auto"
            />
            <img
              src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png"
              alt="Client 2"
              className="h-12 w-auto"
            />
            <img
              src="https://wro.innofabrik.de/wp-content/uploads/2021/08/logo-with-wordmark.png"
              alt="Client 3"
              className="h-12 w-auto"
            />
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
                    Learn More
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

      <ChatWindow />
    </Layout>
  );
};

export default Home;
