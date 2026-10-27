import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { Lesson } from '../../../types/kodigo.types';
import { soundService } from '../../../services/sound.service';
import { PythoMascot } from '../../mascot/components/PythoMascot.component';

interface LessonModalProps {
  lesson: Lesson;
  unitTitle: string;
  onClose: () => void;
  onComplete: (xpEarned: number) => void;
  onLoseHeart: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  unitTitle,
  onClose,
  onComplete,
  onLoseHeart
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'answering' | 'correct' | 'incorrect'>('answering');
  const [showHint, setShowHint] = useState(false);

  const challenge = lesson.challenges[currentIdx];
  const progressPercent = ((currentIdx + 1) / lesson.challenges.length) * 100;

  const handleSelectOption = (option: string) => {
    if (status !== 'answering') return;
    soundService.playClick();
    setSelectedOption(option);
  };

  const handleVerify = () => {
    if (!selectedOption || !challenge) return;

    if (selectedOption === challenge.correctAnswer) {
      soundService.playCorrect();
      setStatus('correct');
    } else {
      soundService.playIncorrect();
      setStatus('incorrect');
      onLoseHeart();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < lesson.challenges.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setStatus('answering');
      setShowHint(false);
    } else {
      soundService.playStreakFanfare();
      onComplete(lesson.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header with Progress Bar */}
        <div className="px-6 py-4 border-b border-duo-border flex items-center gap-4">
          <button onClick={onClose} className="text-duo-gray hover:text-duo-charcoal p-1">
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
          <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-duo-green h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-black text-duo-gray">{unitTitle}</span>
        </div>

        {/* Challenge Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-duo-blue">
                Exercício {currentIdx + 1} de {lesson.challenges.length}
              </span>
              <h3 className="text-xl font-extrabold text-duo-charcoal mt-1">
                {challenge.prompt}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
              {challenge.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={status !== 'answering'}
                  className={`p-4 rounded-2xl border-2 text-left font-mono font-bold text-sm transition-all duration-150 ${
                    selectedOption === option
                      ? 'border-duo-blue bg-blue-50 text-duo-blue shadow-duo-blue'
                      : 'border-duo-border hover:bg-duo-bg-light text-duo-charcoal shadow-duo-gray'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Mascot & Hint */}
          <div className="flex items-center justify-between pt-4 border-t border-duo-border">
            <PythoMascot
              emotion={status === 'correct' ? 'happy' : status === 'incorrect' ? 'sad' : 'idle'}
              speechText={
                status === 'correct'
                  ? 'Sssssensacional! Você acertou em cheio!'
                  : status === 'incorrect'
                  ? 'Quase lá! Revise a sintaxe e tente de novo.'
                  : showHint
                  ? challenge.hint
                  : 'Selecione a resposta correta para avançar!'
              }
            />
            {!showHint && status === 'answering' && (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-duo-border text-xs font-bold text-duo-gray hover:text-duo-charcoal"
              >
                <Lightbulb className="w-4 h-4 text-duo-yellow" />
                <span>Dica</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Feedback Banner */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-t-2 ${
            status === 'correct'
              ? 'bg-green-100 border-green-300'
              : status === 'incorrect'
              ? 'bg-red-100 border-red-300'
              : 'bg-white border-duo-border'
          }`}
        >
          {status === 'correct' && (
            <div className="flex items-center gap-2 text-green-700 font-extrabold text-sm">
              <CheckCircle2 className="w-6 h-6 fill-green-600 text-white" />
              <span>Excelente! +{lesson.xpReward} XP adicionados</span>
            </div>
          )}
          {status === 'incorrect' && (
            <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm">
              <AlertCircle className="w-6 h-6 fill-red-600 text-white" />
              <span>Resposta correta: {String(challenge.correctAnswer)}</span>
            </div>
          )}
          {status === 'answering' && <div />}

          <button
            onClick={status === 'answering' ? handleVerify : handleNext}
            disabled={!selectedOption && status === 'answering'}
            className={`px-6 py-2.5 rounded-2xl font-black uppercase text-sm tracking-wider transition-all duration-150 ${
              !selectedOption && status === 'answering'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : status === 'correct'
                ? 'bg-duo-green text-white shadow-duo-green hover:brightness-105'
                : status === 'incorrect'
                ? 'bg-duo-red text-white shadow-duo-red hover:brightness-105'
                : 'bg-duo-green text-white shadow-duo-green hover:brightness-105'
            }`}
          >
            {status === 'answering' ? 'Verificar' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};
