import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentProject({ ...currentProject, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (currentProject.image) {
      const imageRef = ref(storage, `images/${currentProject.image.name}`);
      await uploadBytes(imageRef, currentProject.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const projectData = {
      title: currentProject.title,
      description: currentProject.description,
      link: currentProject.link,
      image: imageUrl,
    };

    if (isEditing) {
      await updateDoc(doc(db, "projects", currentProject.id), projectData);
    } else {
      await addDoc(collection(db, "projects"), projectData);
    }

    resetForm();
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectsData);
  };

  const resetForm = () => {
    setCurrentProject({
      title: "",
      description: "",
      link: "",
      image: null,
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const startEditing = (project) => {
    setCurrentProject(project);
    setIsEditing(true);
    setShowForm(true);
  };

  const startAdding = () => {
    resetForm();
    setShowForm(true);
  };

  const toggleFeatured = async (project) => {
    const projectRef = doc(db, "projects", project.id);
    await updateDoc(projectRef, {
      featured: !project.featured,
    });

    // Update local state
    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === project.id ? { ...p, featured: !p.featured } : p
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">My Projects</h1>
      <button
        onClick={startAdding}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Add Project
      </button>
      {showForm ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {isEditing ? "Edit Project" : "Add Project"}
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={currentProject.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={currentProject.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Link</label>
            <input
              type="url"
              name="link"
              value={currentProject.link}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {isEditing ? "Update Project" : "Add Project"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>
        </form>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-white p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <a
              href={project.link}
              className="text-blue-500 hover:underline flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project <ArrowRightIcon className="w-4 h-4 ml-1" />
            </a>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => startEditing(project)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Edit
              </button>
              <motion.button
                onClick={() => toggleFeatured(project)}
                className={`px-4 py-2 rounded-lg ${
                  project.featured ? "bg-yellow-400" : "bg-gray-300"
                } text-white flex items-center justify-center`}
                whileTap={{ scale: 0.9 }}
              >
                {project.featured ? (
                  <StarIconSolid className="w-5 h-5 text-yellow-600" />
                ) : (
                  <StarIcon className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;