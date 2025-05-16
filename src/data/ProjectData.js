import React from 'react'

export const ProjectData = {
  inProgress: [
    // {
    //   id: "currently",
    //   name: "[unnamed project]",
    //   desc: (
    //     <div>
    //       Pondering how to link biological observations across spatial and temporal scales.<br/>
    //       To draw long-range inferences that'd fill gaps in our knowledge
    //     </div>
    //   ),
    //   // tech: ["Python"],
    //   links: [
    //     //{ label: "view graph", url: "https://graph.gos.garden/#z=1530.00/47.98/0.51" },
    //   ],
    //   // image: "/textures/project-thingness-image.png",
    //   //video: "/video/currently.mp4",
    //   previewType: "generative-thomas",
    //   previewSize: [ 400, 400 ],
    // },
    // {
    //   id: "excog-2",
    //   name: "Extended Knowledge v2",
    //   desc: (
    //     <div>
    //       A personal tool for thinking
    //     </div>
    //   ),
    //   // tech: ["Python"],
    //   links: [
    //     { label: "view graph", url: "https://graph.gos.garden/#z=1530.00/47.98/0.51" },
    //   ],
    //   // image: "/textures/project-thingness-image.png",
    //   video: "/video/excog-2.mp4",
    //   previewType: "generative-thomas",
    //   previewSize: [ 400, 400 ],
    // },
  ],
  archive: [
    {
      id: "zenith",
      name: "Zenith: The Last City",
      desc: (
        <div>
          As a part of the RamevVR team, brought the VR MMO through multiple releases, starting from pre-beta.
          <br/>
          <ul style={{
            marginTop: '.5em',
            paddingInlineStart: '40px',
          }}>
            <li>Engineered the procedural grass and clouds.</li>
            <li>Designed and implemented the "sentive" and "bird" gliding modes, utilizing more controller DoFs — feels less like pressing a button a more like having wings.</li>
            <li>Co-designed and implemented the house building, with seamless instancing and shared neighborhoods.</li>
            <li>Ported the networking from SpatialOS onto a custom-made back-end, supporting 100 players in close proximity with full-skeleton network sync on a single shard.</li>
            <li>Architected and administered the cloud infrastructure with multiple regions (GCP/Terraform/K8s) and developed monitoring, analytics and game master tools.</li>
          </ul>
        </div>
      ),
      tech: ["C#", "Unity", "Compute shaders", "TypeScript / React", "Kuberneres", "Terraform"],
      links: [
        { label: "first release trailer", url: "https://www.youtube.com/watch?v=oPEho2Zb_JM" },
      ],
      // image: "/textures/project-thingness-image.png",
      video: "/video/zenith.mp4",
      previewType: "generative-thomas",
      previewSize: [ 400, 400 ],
    },
    {
      id: "spatial-cell",
      name: "Spatial cell",
      desc: (
        <div>
          Molecule-scale simulation of a biological cell
        </div>
      ),
      tech: ["C++", "CUDA", "Unity", "Python"],
      links: [
        { label: "blog post", url: "https://graph.gos.garden/node/4bbb96b6-d858-419a-94d3-e7eae9e008ad#" },
        { label: "github", url: "https://github.com/justgos/spatial-cell" },
      ],
      // image: "/textures/project-thingness-image.png",
      video: "/video/spatial-cell.mp4",
      previewType: "generative-thomas",
      previewSize: [ 400, 400 ],
    },
    {
      id: "indagatio-muris-senis",
      name: "Indagatio Muris Senis",
      desc: (
        <div>
          Exploration of the Mus Musculus aging dynamics
        </div>
      ),
      tech: ["Python", "TypeScript", "WebGL"],
      links: [
        { label: "visualization", url: "https://gos.garden/vis-age/" },
        { label: "github", url: "https://github.com/justgos/indagatio-muris-senis" },
      ],
      // image: "/textures/project-thingness-image.png",
      video: "/video/indagatio-muris-senis.mp4",
      previewType: "generative-thomas",
      previewSize: [ 400, 400 ],
    },
    {
      id: "thingness",
      name: "Thingness",
      desc: (
        <div>
          Exploration of cell-level morphogenesis in 2D
        </div>
      ),
      tech: ["Python"],
      links: [
        { label: "github", url: "https://github.com/justgos/thingness" },
      ],
      // image: "/textures/project-thingness-image.png",
      video: "/video/thingness.mp4",
      previewType: "generative-thomas",
      previewSize: [ 400, 400 ],
    },
    {
      id: "excog",
      name: "Extended Knowledge v1",
      desc: (
        <div>
          A tool for thinking on scales larger/longer than mindmaps usually allow for.<br/>
          Augmented with <a href="https://en.wikipedia.org/wiki/Extended_cognition" target="_blank" rel="noopener noreferrer">Wikipedia</a> data
        </div>
      ),
      tech: ["React", "Canvas rendering", "socket.io", "Node.js", "Mongo", "Neo4j", "ElasticSearch"],
      links: [
        // { label: "website", url: "https://extendedcognition.org/" },
        { label: "iteration 1 (video)", url: "https://www.youtube.com/watch?v=pQgasxd2-mE" },
        { label: "iteration 2 (video)", url: "https://www.youtube.com/watch?v=aPhjCrcgRPY" },
        { label: "iteration 3 (video)", url: "https://www.youtube.com/watch?v=FmLUpeSrsC0" },
      ],
      // image: "/textures/project-excog-image.png",
      video: "/video/ex-k.mp4",
      previewType: "generative-excog",
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
      // image: "/textures/project-eso-image.png",
      video: "/video/act.mp4",
      previewType: "content",
      previewSize: [ 400, 400 ],
      previewScale: 7,
    },
    {
      id: "body-evo",
      name: "Mind-body evolution",
      desc: (
        <div>
          Agents can evolve new limbs, which add new sensory and motor neurons.<br/>
          Mind is a Spiking Neural Network, implemented in <a href="https://brian2.readthedocs.io/en/stable/" target="_blank" rel="noopener noreferrer">brian2</a> and using <a href="http://www.izhikevich.org/publications/spikes.htm" target="_blank" rel="noopener noreferrer">Izhikevich</a> cells dynamics.
        </div>
      ),
      tech: ["Python (Brian2)", "Unity", "ZeroMQ"],
      // links: [
      //   { label: "website", url: "https://ecosystemone.com/" },
      // ],
      image: "/textures/body-evo-mind-structure.jpg",
      previewType: "generative-van-der-pol",
      previewSize: [ 400, 400 ],
    },
    {
      id: "brave-gen",
      name: "Artificial worlds",
      desc: (
        <div>
          Terrain generation and object placement are inspired by <a href="https://www.youtube.com/watch?v=SePDzis8HqY" target="_blank" rel="noopener noreferrer">No Man's Sky</a>.<br/>
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
      video: "/video/brave-gen.mp4",
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
      image: "/textures/l2mapper.jpg",
      previewType: "content",
      previewSize: [ 500, 379 ],
      previewScale: 8,
    },
  ],
}
      