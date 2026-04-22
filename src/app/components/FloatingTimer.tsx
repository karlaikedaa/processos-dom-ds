import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, X, Minimize2, Maximize2 } from 'lucide-react';
import { useTimer } from '../contexts/TimerContext';
import { formatDuration } from '../utils/time';

export function FloatingTimer() {
  const {
    timerState,
    tempoAtual,
    pauseTimer,
    resumeTimer,
    stopTimer,
    discardTimer,
    updateTimerPosition,
    toggleMinimized,
    isMinimized
  } = useTimer();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);

  // Handle drag functionality - must be before early return per Rules of Hooks
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Limitar às bordas da tela
      const maxX = window.innerWidth - (isMinimized ? 180 : 340);
      const maxY = window.innerHeight - (isMinimized ? 80 : 160);

      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      updateTimerPosition(boundedX, boundedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMinimized, updateTimerPosition]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Space: pause/resume (only if timer exists and focus is not on input)
      if (e.code === 'Space' && e.target === document.body && timerState) {
        e.preventDefault();
        if (timerState.rodando) {
          pauseTimer();
        } else {
          resumeTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timerState, pauseTimer, resumeTimer]);

  // Não renderizar se não há timer ativo
  if (!timerState) return null;

  const tempoFormatado = formatDuration(tempoAtual);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      // Não iniciar drag se clicou em botão
      return;
    }

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - timerState.posicao.x,
      y: e.clientY - timerState.posicao.y
    });
  };

  // Minimized view
  if (isMinimized) {
    return (
      <div
        ref={timerRef}
        onMouseDown={handleMouseDown}
        onClick={toggleMinimized}
        style={{
          position: 'fixed',
          left: `${timerState.posicao.x}px`,
          top: `${timerState.posicao.y}px`,
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        className="bg-card border-2 border-primary rounded-lg shadow-2xl p-3 flex items-center gap-2 animate-in zoom-in-95 fade-in duration-200"
      >
        <div className="text-2xl font-mono font-bold text-primary">
          {tempoFormatado}
        </div>
        {timerState.rodando ? (
          <Pause className="text-primary" size={20} />
        ) : (
          <Play className="text-muted-foreground" size={20} />
        )}
      </div>
    );
  }

  // Expanded view
  return (
    <div
      ref={timerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${timerState.posicao.x}px`,
        top: `${timerState.posicao.y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: timerState.rodando ? 1 : 0.9
      }}
      className="bg-card border-2 border-primary rounded-lg shadow-2xl w-80 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Header com título e fechar */}
      <div className="flex items-start justify-between p-3 border-b">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate text-foreground">
            {timerState.tarefaNome}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {timerState.clienteNome}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            discardTimer();
          }}
          className="shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Timer display and controls */}
      <div className="p-4 flex flex-col items-center">
        <div className="text-4xl font-mono font-bold text-primary mb-4">
          {tempoFormatado}
        </div>

        {/* Control buttons */}
        <div className="flex gap-2">
          {timerState.rodando ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                pauseTimer();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              <Pause size={16} />
              <span className="text-sm">Pausar</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resumeTimer();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
            >
              <Play size={16} />
              <span className="text-sm">Retomar</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              stopTimer();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-chart-1 hover:bg-chart-1/90 text-white rounded-md transition-colors"
          >
            <Square size={16} />
            <span className="text-sm">Parar</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimized();
            }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
