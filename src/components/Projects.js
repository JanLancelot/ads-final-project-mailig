import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

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

  const deleteProject = async (id) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Projects</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={startAdding}
          className="px-4 py-2 bg-blue-700 text-white rounded-full"
        >
          Add Project
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            name="title"
            value={currentProject.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="block w-full mb-2 p-2 border"
          />
          <textarea
            name="description"
            value={currentProject.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="block w-full mb-2 p-2 border"
          />
          <input
            type="text"
            name="link"
            value={currentProject.link}
            onChange={handleInputChange}
            placeholder="Link"
            className="block w-full mb-2 p-2 border"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="block w-full mb-2 p-2 border"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded-full"
          >
            {isEditing ? "Update" : "Add"} Project
          </button>
          <button
            onClick={resetForm}
            type="button"
            className="px-4 py-2 bg-gray-700 text-white rounded-full ml-2"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-white rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.05 }}
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
            )}
            <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-700 mb-4">{project.description}</p>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-700 hover:underline"
              >
                View Project <ArrowRightIcon className="w-4 h-4 ml-1" />
              </a>
            )}
            <div className="flex items-center mt-4">
              <button
                onClick={() => startEditing(project)}
                className="px-2 py-1 bg-yellow-700 text-white rounded-full"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="px-2 py-1 bg-red-700 text-white rounded-full ml-2"
              >
                Delete
              </button>
              <button
                onClick={() => toggleFeatured(project)}
                className={`px-2 py-1 ml-2 ${
                  project.featured ? "bg-yellow-400" : "bg-gray-400"
                } text-white rounded-full`}
              >
                {project.featured ? (
                  <StarIconSolid className="w-4 h-4" />
                ) : (
                  <StarIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
