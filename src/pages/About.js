import { motion } from "framer-motion";
import lancelot from "../images/lancelot.png";
import Layout from "../components/Layout";

const AboutMe = () => {
  return (
    <Layout>
      <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            >
              <img
                src={lancelot}
                alt="Lancelot's Portrait"
                className="rounded-full shadow-lg max-w-md mx-auto"
              />
            </motion.div>
            <motion.div
              className="md:w-1/2 text-left p-6"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
                About Me
              </h2>
              <p className="mt-4 text-gray-700 sm:mt-6 sm:text-lg md:text-xl">
                Hi, my name is Jan Lancelot P. Mailig, and I am passionate web developer
                specializing in React, Firebase, and Tailwind. I've been doing this for four year now,
                but my passion for learning hasn't waned. I'm also knowledgeable in Lego Robotics, and have represented
                the Philippines twice in the World Robot Olympiad.
              </p>
              <h3 className="mt-6 text-2xl font-bold text-gray-800">Skills</h3>
              <ul className="mt-3 text-gray-700 sm:mt-4 sm:text-lg md:text-xl list-disc list-inside">
                <li>React</li>
                <li>Firebase</li>
                <li>Tailwind CSS</li>
                <li>JavaScript (ES6+)</li>
                <li>HTML & CSS</li>
                <li>Git & GitHub</li>
                <li>Responsive Design</li>
                <li>Lego Robotics</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutMe;
