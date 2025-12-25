import React from 'react';

const HelloGarden: React.FC<{ name?: string }> = ({ name = 'Gardener' }) => {
  return (
    <div className="p-4 border border-accent rounded-md bg-surface text-foreground font-mono">
      <p className="text-accent animate-pulse">_ system_status: ONLINE</p>
      <h1 className="text-xl font-bold">Hello, {name}</h1>
      <p className="text-sm mt-2 text-muted">This is a React Island running inside Jekyll.</p>
    </div>
  );
};

export default HelloGarden;
