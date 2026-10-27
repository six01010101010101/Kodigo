import React from 'react';
import { X, Check } from 'lucide-react';
import { CodeTrack } from '../../../types/kodigo.types';
import { soundService } from '../../../services/sound.service';

interface TracksModalProps {
  tracks: CodeTrack[];
  activeTrackId: string;
  onClose: () => void;
  onSelectTrack: (track: CodeTrack) => void;
}

export const TracksModal: React.FC<TracksModalProps> = ({
  tracks,
  activeTrackId,
  onClose,
  onSelectTrack
}) => {
  const handleSelect = (track: CodeTrack) => {
    soundService.playClick();
    onSelectTrack(track);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-duo-border dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-duo-gray hover:text-duo-charcoal dark:hover:text-white p-1"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h2 className="text-xl font-black text-duo-charcoal dark:text-white mb-1">
          Trilhas de Engenharia de Software
        </h2>
        <p className="text-xs text-duo-gray dark:text-slate-400 mb-6">
          Do básico ao pró: selecione a trilha para focar seus estudos:
        </p>

        <div className="space-y-3">
          {tracks.map((track) => {
            const isSelected = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                onClick={() => handleSelect(track)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'border-duo-green bg-green-50 dark:bg-emerald-950/40 shadow-duo-green'
                    : 'border-duo-border dark:border-slate-800 hover:bg-duo-bg-light dark:hover:bg-slate-800/60 shadow-duo-gray'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{track.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-duo-charcoal dark:text-white">
                      {track.name}
                    </h4>
                    <p className="text-xs text-duo-gray dark:text-slate-400 max-w-[280px]">
                      {track.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-7 h-7 rounded-full bg-duo-green flex items-center justify-center text-white">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
