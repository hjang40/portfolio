import React, { useState } from "react";
import LeftSidebar from "../components/projects/LeftSidebar";
import RightSidebar from "../components/projects/RightSidebar";
import ProjectGrid from "../components/projects/ProjectGrid";
import Pokedex from "../components/projects/Pokedex";
import { projectData } from "../components/projects/projectData";
import {
  getAllSkills,
  getAllCategories,
  filterProjectsByCategory,
  getProjectStats,
  getCategoryCounts,
} from "../components/projects/projectUtils";

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Derived data
  const skills = getAllSkills(projectData);
  const categories = getAllCategories(projectData);
  const filteredProjects = filterProjectsByCategory(projectData, selectedCategory);
  const stats = getProjectStats(filteredProjects);
  const categoryCounts = getCategoryCounts(projectData, categories);

  // Project management functions
  const openProject = (project) => {
    setSelected(project);
    setImgIndex(0);
    setShowSkillsModal(false);
    setShowImageZoom(false);
  };

  const closeProject = () => {
    setSelected(null);
    setShowSkillsModal(false);
    setShowImageZoom(false);
  };

  // Image navigation functions
  const nextImage = () => {
    if (!selected || selected.images.length === 0) return;
    setImgIndex((prev) => (prev + 1) % selected.images.length);
  };

  const prevImage = () => {
    if (!selected || selected.images.length === 0) return;
    setImgIndex(
      (prev) => (prev - 1 + selected.images.length) % selected.images.length
    );
  };

  // Modal management functions
  const openSkillsModal = () => setShowSkillsModal(true);
  const closeSkillsModal = () => setShowSkillsModal(false);
  const openImageZoom = () => setShowImageZoom(true);
  const closeImageZoom = () => setShowImageZoom(false);

  return (
    <div className="flex min-h-screen p-6 bg-red-500">
      <LeftSidebar stats={stats} skills={skills} />
      
      <ProjectGrid 
        filteredProjects={filteredProjects} 
        openProject={openProject} 
      />
      
      <RightSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredProjects={filteredProjects}
        categoryCounts={categoryCounts}
      />

      <Pokedex
        selected={selected}
        closeProject={closeProject}
        imgIndex={imgIndex}
        nextImage={nextImage}
        prevImage={prevImage}
        setImgIndex={setImgIndex}
        openSkillsModal={openSkillsModal}
        openImageZoom={openImageZoom}
        showSkillsModal={showSkillsModal}
        closeSkillsModal={closeSkillsModal}
        showImageZoom={showImageZoom}
        closeImageZoom={closeImageZoom}
      />
    </div>
  );
}