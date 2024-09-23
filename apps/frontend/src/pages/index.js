import React, { useEffect, useState } from 'react';
import { getProjects } from '../../services/apiService';

const HomePage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from API
    getProjects().then((data) => {
      // Ensure data is an array and set it to state
      setProjects(data || []); 
    }).catch((error) => {
      console.error("Error fetching projects:", error);
    });
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))
        ) : (
          <li>No projects available</li>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
