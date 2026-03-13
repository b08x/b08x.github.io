import React, { useState, useMemo, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  summary: string;
  tags: string[];
  field?: string;
  tenor?: string;
  mode?: string;
}

interface ProjectsIslandProps {
  projects?: Project[];
}

export default function ProjectsIsland({ projects = [] }: ProjectsIslandProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDark, setIsDark] = useState(typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false);

  // Sync with theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>(['all']);
    if (Array.isArray(projects)) {
      projects.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
          p.tags.forEach(t => cats.add(t));
        }
      });
    }
    return Array.from(cats);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    return list.filter(p => {
      const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
      const tagsArray = Array.isArray(p.tags) ? p.tags : [];
      const matchesCategory = selectedCategory === 'all' || tagsArray.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-8 font-mono">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border border-border p-4 bg-surface shadow-sm">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs uppercase tracking-widest text-muted">Filter::Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm border transition-all ${
                  selectedCategory === cat 
                    ? 'border-accent bg-accent/10 text-accent' 
                    : 'border-border hover:border-foreground/50 text-foreground/75'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs uppercase tracking-widest text-muted">System::Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="QUERY_PROJECTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <div className="absolute right-3 top-2.5 text-[10px] text-muted pointer-events-none">
              CMD+K
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project List */}
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto scrollbar-terminal pr-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`group flex flex-col border p-4 cursor-pointer transition-all ${
                  selectedProject?.id === project.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-foreground/50 bg-surface'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-[10px] text-muted border border-border px-1.5 py-0.5">
                    ID_{project.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                
                <p className="font-prose text-sm text-foreground/80 line-clamp-2 mb-4">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {Array.isArray(project.tags) && project.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-muted uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-border p-8 text-center text-muted italic">
              NO_MATCH_FOUND
            </div>
          )}
        </div>

        {/* Output Console / Detail View */}
        <div className="flex flex-col border border-border bg-black text-green-500 font-mono text-sm overflow-hidden h-[600px] shadow-xl">
          <div className="bg-[#1e1e1e] border-b border-[#333] p-2 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="text-[10px] text-muted uppercase tracking-tighter">project_terminal.v1.0</span>
          </div>
          
          <div className="p-6 overflow-y-auto scrollbar-terminal flex-1 leading-relaxed">
            {selectedProject ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6 opacity-80">
                  <p className="text-white/40 mb-1">$ cat metadata.json</p>
                  <pre className="text-blue-400 whitespace-pre-wrap">
                    {JSON.stringify({
                      title: selectedProject.title,
                      field: selectedProject.field || 'N/A',
                      tenor: selectedProject.tenor || 'N/A',
                      mode: selectedProject.mode || 'N/A',
                      tags: Array.isArray(selectedProject.tags) ? selectedProject.tags : []
                    }, null, 2)}
                  </pre>
                </div>

                <div className="mb-6">
                  <p className="text-white/40 mb-1">$ read summary.md</p>
                  <div className="font-prose text-green-400/90 text-base">
                    {selectedProject.summary}
                  </div>
                </div>

                {selectedProject.thumbnail && (
                  <div className="mb-6">
                    <p className="text-white/40 mb-2">$ open preview.png</p>
                    <div className="border border-green-900 overflow-hidden aspect-video relative group">
                      <img 
                        src={selectedProject.thumbnail} 
                        alt={selectedProject.title}
                        className="w-full h-full object-cover grayscale opacity-50 contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-green-500/10 pointer-events-none mix-blend-overlay"></div>
                    </div>
                  </div>
                ) || (
                   <div className="mb-6">
                    <p className="text-white/40 mb-2">$ open preview.png</p>
                    <div className="border border-green-900 border-dashed aspect-video flex items-center justify-center text-green-900">
                      NULL_ASSET
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <a 
                    href={selectedProject.url}
                    className="inline-block border border-green-500 px-6 py-2 hover:bg-green-500 hover:text-black transition-all font-bold"
                  >
                    RUN PROJECT --INIT
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-green-900 opacity-50 space-y-4">
                <div className="text-4xl animate-pulse">_</div>
                <p className="uppercase tracking-widest text-xs">Waiting for selection...</p>
              </div>
            )}
          </div>
          
          <div className="bg-[#1e1e1e] border-t border-[#333] p-1.5 px-3 flex items-center justify-between text-[10px] text-muted">
            <div className="flex gap-4">
              <span>UTF-8</span>
              <span>LF</span>
              <span>TYPESCRIPT</span>
            </div>
            <span>MASTER*</span>
          </div>
        </div>
      </div>
    </div>
  );
}
