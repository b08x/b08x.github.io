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
      <div className="video-section bg-surface rounded-lg border border-border p-6 mb-6">
        <div className="aspect-video mb-4 bg-background rounded-lg overflow-hidden">
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
          <h3 className="text-lg font-semibold text-foreground">
            {videoTitle}
          </h3>
        )}
      </div>
    );
  };

  if (activeNote) {
    return (
      <div className="note-detail-view bg-surface rounded-lg border border-border p-8">
        <button
          onClick={() => setActiveNoteId(null)}
          className="mb-6 flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to notes
        </button>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">{activeNote.title}</h2>
          <p className="text-lg text-foreground/90 leading-relaxed">{activeNote.description}</p>
        </header>

        <div className="prose dark:prose-invert max-w-none text-foreground">
          {activeNote.content ? (
            <div dangerouslySetInnerHTML={{ __html: activeNote.content }} />
          ) : (
            <p className="text-foreground/50 italic">No content available for this note.</p>
          )}
        </div>

        {activeNote.citations && activeNote.citations > 0 && (
          <footer className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-foreground/60">
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
              className="p-5 rounded-lg border border-border bg-surface hover:border-accent/50 transition-all cursor-pointer group"
              onClick={() => setActiveNoteId(note.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                  {note.title}
                </h3>
                <svg className="w-5 h-5 text-foreground/30 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-foreground/75 mb-3 line-clamp-3">
                {note.description}
              </p>
              {note.citations && (
                <p className="text-xs text-foreground/50 font-mono">
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
