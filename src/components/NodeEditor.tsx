import React, { useState } from 'react';

interface NodeEditorProps {
  nodeId: string;
  content: string;
  onSave: (nodeId: string, newContent: string) => void;
  onCancel: () => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ nodeId, content, onSave, onCancel }) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(nodeId, editedContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd+Enter or Ctrl+Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSave();
    }
    // Escape to cancel
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="absolute inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-labelledby="node-editor-title"
    >
      <div
        className="bg-background border-2 border-accent p-6 max-w-2xl w-full font-mono shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="node-editor-title" className="text-accent text-sm uppercase mb-4 tracking-wider">
          Edit Node: {nodeId}
        </h3>

        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-64 bg-surface border border-border text-foreground p-3 font-mono text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 resize-none"
          placeholder="Enter node content (markdown supported)..."
          autoFocus
          aria-label="Node Content"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-accent text-background uppercase text-xs font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Save Changes"
          >
            Save (⌘↵)
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-surface border border-border text-muted uppercase text-xs hover:border-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Cancel Editing"
          >
            Cancel (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeEditor;
