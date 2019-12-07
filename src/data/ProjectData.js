import React from 'react'

export const ProjectData = {
  inProgress: [
    {
      id: "excog",
      name: "Extended Knowledge",
      desc: (
        <div>
          A tool for thinking on scales larger/longer than mindmaps usually allow for. 
          Augmented with <a href="https://en.wikipedia.org/wiki/Extended_cognition" target="_blank" rel="noopener noreferrer">Wikipedia</a> data
        </div>
      ),
      tech: ["React", "Canvas rendering", "socket.io", "Node.js", "Mongo", "Neo4j", "ElasticSearch"],
      links: [
        { label: "website", url: "https://extendedcognition.org/" },
        { label: "my graph", url: "https://extendedcognition.org/graph/justgos" },
      ],
      image: "/textures/project-excog-image.png",
      previewType: "generative-excog",
      previewSize: [ 400, 400 ],
    },
    {
      id: "thingness",
      name: "Thingness",
      desc: (
        <div>
          Evolutionary exploration of cell-level morphogenesis in 2D
        </div>
      ),
      tech: ["Python"],
      links: [
        { label: "github", url: "https://github.com/justgos/thingness" },
      ],
      // image: "/textures/project-thingness-image.png",
      previewType: "generative-thomas",
      previewSize: [ 400, 400 ],
    },
    {
      id: "eso",
      name: "EcoSystemOne",
      desc: (
        <div>
          A platform where you learn by teaching others — by telling stories together, in&nbsp;VR
        </div>
      ),
      tech: ["Unity (Photon, SteamVR)", "Node.js", "Mongo", "ElasticSearch", "Python", "AWS", "Docker Swarm"],
      links: [
        { label: "website", url: "https://ecosystemone.com/" },
      ],
      image: "/textures/project-eso-image.png",
      previewType: "content",
      previewSize: [ 400, 400 ],
      previewScale: 7,
    },
  ],
  archive: [
    // {
    //   id: "body-evo",
    //   name: "Mind-body evolution",
    //   desc: (
    //     <div>
    //       Agents can evolve new limbs, which add new `in` and `out` neurons.<br/>
    //       Mind is a Spiking Neural Network, implemented in <a href="https://brian2.readthedocs.io/en/stable/" target="_blank" rel="noopener noreferrer">brian2</a> and using <a href="http://www.izhikevich.org/publications/spikes.htm" target="_blank" rel="noopener noreferrer">Izhikevich</a> cells dynamics.
    //     </div>
    //   ),
    //   tech: ["Python (Brian2)", "Unity", "ZeroMQ"],
    //   // links: [
    //   //   { label: "website", url: "https://ecosystemone.com/" },
    //   // ],
    //   // image: "/textures/project--image.png",
    //   previewType: "generative-van-der-pol",
    //   previewSize: [ 400, 400 ],
    // },
    {
      id: "artificial-body",
      name: "Artificial worlds",
      desc: (
        <div>
          Terrain generation and object placement are inspired by <a href="https://www.youtube.com/watch?v=SePDzis8HqY" target="_blank" rel="noopener noreferrer">No Man's Sky</a>. 
          Air dynamics are a voxel-based simulation, based on <a href="http://developer.download.nvidia.com/books/HTML/gpugems/gpugems_ch38.html" target="_blank" rel="noopener noreferrer">GPU Gems</a> article.
          {/* <p>
            Originally meant to be a dynamic environment for artificial agents to adapt to, but it hasn't got to that point
          </p> */}
        </div>
      ),
      tech: ["Unity", "Python"],
      links: [
        { label: "github", url: "https://github.com/justgos/brave-gen" },
      ],
      // image: "/textures/project--image.png",
      previewType: "generative-van-der-pol",
      previewSize: [ 400, 400 ],
    },
    {
      id: "l2mapper",
      name: "Map viewer for Lineage II",
      desc: (
        <div>
          In a time of being somewhat obsessed with the game, spent a few weeks dawn till dusk trying to find ways to read an altered Unreal Engine data format and understanding how it's meant to be visualized.
        </div>
      ),
      tech: ["C++", "OpenGL"],
      links: [
        { label: "github", url: "https://github.com/justgos/l2mapper" },
      ],
      image: "/textures/project-l2mapper-image.png",
      previewType: "content",
      previewSize: [ 500, 379 ],
      previewScale: 8,
    },
  ],
}
      