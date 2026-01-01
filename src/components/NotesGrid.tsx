import React, { useState } from 'react';

interface Note {
  id: string;
  title: string;
  description: string;
  citations?: number;
  items?: string[];
  url?: string;
  content?: string;
}

interface NotesGridProps {
  notes: Note[];
  videoUrl?: string;
  videoTitle?: string;
}

const NotesGrid: React.FC<NotesGridProps> = ({ notes = [], videoUrl, videoTitle }) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = notes?.find(n => n.id === activeNoteId);

  const renderVideo = () => {
    if (!videoUrl || activeNoteId) return null;

    let youtubeId = '';
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      if (videoUrl.includes('v=')) {
        youtubeId = videoUrl.split('v=')[1].split('&')[0];
      } else if (videoUrl.includes('.be/')) {
        youtubeId = videoUrl.split('.be/')[1].split('?')[0];
      }
    }

    return (
      <div className="video-section bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="aspect-video mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          {youtubeId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <video className="w-full h-full" controls>
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
        {videoTitle && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {videoTitle}
          </h3>
        )}
      </div>
    );
  };

  if (activeNote) {
    return (
      <div className="note-detail-view bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <button
          onClick={() => setActiveNoteId(null)}
          className="mb-6 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to notes
        </button>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{activeNote.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{activeNote.description}</p>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          {activeNote.content ? (
            <div dangerouslySetInnerHTML={{ __html: activeNote.content }} />
          ) : (
            <p className="text-gray-500 italic">No content available for this note.</p>
          )}
        </div>

        {activeNote.citations && activeNote.citations > 0 && (
          <footer className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeNote.citations} citations found in source transcript
            </p>
          </footer>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderVideo()}
      <div className="notes-grid-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setActiveNoteId(note.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {note.title}
                </h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                {note.description}
              </p>
              {note.citations && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {note.citations} citations
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesGrid;
