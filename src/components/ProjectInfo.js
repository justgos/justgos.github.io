import React from 'react'
import SwarmTarget from './SwarmTarget'

export default function ProjectInfo({ project }) {
  return (
    <div className="project" key={project.id}>
      <div className="container">
        <div className={"project-name " + project.id}>{project.name}</div>
        <div className="project-desc">{project.desc}</div>
        {project.tech && <div className="project-tech">
          <span className="tech-list">
            {project.tech.map((tech, i) =>
              <div key={i} className="item">{tech}</div>
            )}
          </span>
        </div>}
        {project.links && <div className="project-links">
          {project.links.map((link, i) => 
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          )}
        </div>}
      </div>
      <div className="container project-preview-media">
        {project.image && 
          <>
            <img src={project.image} alt={project.name + " preview"} />
            <div className="shadow" />
          </>
        }
        {project.video && 
          <>
            <video autoPlay playsInline loop muted src={project.video} />
            <div className="shadow" />
          </>
        }
        {/* <SwarmTarget 
          id={"project-symbol-" + project.id} 
          type={project.previewType} 
          size={project.previewSize} 
          scale={project.previewScale ? project.previewScale : 4} 
          image={project.image}
        /> */}
      </div>
    </div>
  );
};
