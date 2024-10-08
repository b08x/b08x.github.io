import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Server, Database, Code, Shield, UserCircle, Box, Laptop } from 'lucide-react';

const slides = [
  {
    title: "Ansible Collection for AI/NLP Systems",
    content: "A comprehensive set of roles and playbooks designed for local deployment of AI and NLP development environments, with potential for scaling to distributed systems.",
    icon: Server
  },
  {
    title: "Core Services",
    content: "Automate the deployment and configuration of essential services on your local machine, including Graylog, Postgres/PGvector, Redis, ChromaDB, and Open Artifacts.",
    icon: Database
  },
  {
    title: "AI Development Platforms",
    content: "Set up AI development platforms such as Flowise, Dify.ai, Ollama, LocalAI, and integrate Open Source Anthropic Artifacts on your workstation.",
    icon: Server
  },
  {
    title: "Development Tools",
    content: "Integrate local development tools like Jupyter Labs, our customized SillyTavern, and Open Artifacts to support your AI/NLP workflow.",
    icon: Code
  },
  {
    title: "DevOps Integration",
    content: "Implement processes for backups, deployments, and management of Open Artifacts, optimized for local development with potential for scaling.",
    icon: Shield
  },
  {
    title: "Local Workstation Architecture",
    content: "Visualize how components work together on a single local machine, with potential for distributed deployment.",
    icon: Laptop,
    diagram: `
graph TD
    subgraph "Local Workstation"
        App[Application Server]
        subgraph "Core Services"
            App --> Graylog[Graylog]
            App --> Postgres[Postgres]
            App --> Redis[Redis]
            App --> OA[Open Artifacts]
        end
        
        subgraph "AI/ML Services"
            App --> Flowise[Flowise]
            Flowise --> LocalAI[LocalAI]
            Flowise --> OA
            LocalAI --> OA
        end
        
        subgraph "Development Environment"
            Dev[Developer] --> Jupyter[Jupyter Notebook]
            Jupyter --> Ruby[Ruby Environment]
            Jupyter --> Python[Python Environment]
            Jupyter --> OA
        end
        
        subgraph "Local DevOps"
            DevOps[DevOps Tools] --> App
            DevOps --> Graylog
            DevOps --> Postgres
            DevOps --> Redis
            DevOps --> Flowise
            DevOps --> LocalAI
            DevOps --> Jupyter
            DevOps --> OA
        end
        
        Graylog --> Postgres
        Flowise --> Postgres
        Flowise --> Redis
        LocalAI --> Redis
        OA --> Postgres
    end
    
    User[User / Developer] --> App
    
    classDef local fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef core fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    classDef ai fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef dev fill:#fce4ec,stroke:#880e4f,stroke-width:2px;
    classDef oa fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px;
    
    class App,Graylog,Postgres,Redis,Flowise,LocalAI,Jupyter,Ruby,Python,DevOps local;
    class Graylog,Postgres,Redis core;
    class Flowise,LocalAI ai;
    class Jupyter,Ruby,Python dev;
    class OA oa;
    `
  },
  {
    title: "Scalability Potential",
    content: "While optimized for local deployment, the architecture can be scaled to distributed systems when needed.",
    icon: Server,
    diagram: `
graph TD
    subgraph "Local Development"
        LW[Local Workstation]
    end
    
    subgraph "Potential Distributed Deployment"
        LB[Load Balancer]
        AS1[App Server 1]
        AS2[App Server 2]
        DB[(Distributed Database)]
        Cache[(Distributed Cache)]
        OA[Open Artifacts Service]
    end
    
    LW --> |Scale Up| LB
    LB --> AS1
    LB --> AS2
    AS1 --> DB
    AS1 --> Cache
    AS1 --> OA
    AS2 --> DB
    AS2 --> Cache
    AS2 --> OA
    
    classDef local fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef distributed fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    
    class LW local;
    class LB,AS1,AS2,DB,Cache,OA distributed;
    `
  },
  {
    title: "Open Artifacts in Local Development",
    content: "Leverage Open Source Anthropic Artifacts for enhanced AI/NLP capabilities on your local machine.",
    icon: Box,
    diagram: `
graph TD
    OA[Open Artifacts]
    subgraph "Local AI Applications"
        OA --> |Enhance NLP| NLP[NLP Tasks]
        OA --> |Improve Training| MT[Model Training]
        OA --> |Enrich| KG[Knowledge Graphs]
        OA --> |Augment| QA[Question Answering]
        OA --> |Support| TD[Text Generation]
    end
    
    Dev[Local Developer] --> |Contribute & Use| OA
    OA --> |Store| LDB[(Local Database)]
    OA --> |Cache| LCache[(Local Cache)]
    
    LDevOps[Local DevOps Tools] --> |Manage & Deploy| OA
    
    classDef oa fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px;
    classDef ai fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    classDef human fill:#ffcdd2,stroke:#b71c1c,stroke-width:2px;
    classDef local fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    
    class OA oa;
    class NLP,MT,KG,QA,TD ai;
    class Dev human;
    class LDB,LCache,LDevOps local;
    `
  }
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="relative h-96 bg-white rounded-lg shadow-inner overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.icon && <slide.icon className="w-16 h-16 mb-4 text-blue-500" />}
            <h2 className="text-2xl font-bold mb-4 text-center">{slide.title}</h2>
            <p className="text-center text-gray-600 mb-4">{slide.content}</p>
            {slide.diagram && (
              <div className="w-full h-64 overflow-auto bg-gray-50 p-4 rounded">
                <pre className="text-xs">
                  <code>{slide.diagram}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevSlide}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-sm text-gray-500">
          {currentSlide + 1} / {slides.length}
        </div>
        <button
          onClick={nextSlide}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Slideshow;
