import React, { useState } from 'react';

interface Note {
  id: string;
  title: string;
  description: string;
  citations?: number;
  items?: string[];
}

interface NotesGridProps {
  notes: Note[];
}

const NotesGrid: React.FC<NotesGridProps> = ({ notes }) => {
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [showAddNote, setShowAddNote] = useState(false);

  const toggleNote = (id: string) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotes(newSelected);
  };

  const selectAll = () => {
    if (selectedNotes.size === notes.length) {
      setSelectedNotes(new Set());
    } else {
      setSelectedNotes(new Set(notes.map(n => n.id)));
    }
  };

  return (
    <div className="notes-grid-container">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowAddNote(!showAddNote)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add note
        </button>
        <button
          onClick={selectAll}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          {selectedNotes.size === notes.length ? 'Deselect all' : 'Select all'}
        </button>
        {selectedNotes.size > 0 && (
          <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
            {selectedNotes.size} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`
              p-5 rounded-lg border transition-all cursor-pointer
              ${selectedNotes.has(note.id)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
              }
            `}
            onClick={() => toggleNote(note.id)}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {note.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {note.description}
            </p>
            {note.items && note.items.length > 0 && (
              <ul className="text-sm text-gray-700 dark:text-gray-300 mb-3 space-y-1 list-disc list-inside">
                {note.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
            {note.citations && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {note.citations} citations
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesGrid;
