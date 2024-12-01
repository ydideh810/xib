import React, { useState, useEffect } from 'react';
import { Mic, Square, Send, X } from 'lucide-react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

interface VoiceRecorderProps {
  onSendVoiceNote: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onSendVoiceNote }: VoiceRecorderProps) {
  const { isRecording, audioChunks, error, startRecording, stopRecording, clearRecording } = useVoiceRecorder();
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (audioChunks.length > 0) {
      onSendVoiceNote(audioChunks[0]);
      clearRecording();
      setRecordingTime(0);
    }
  };

  const handleCancel = () => {
    clearRecording();
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <p className="text-red-500 terminal-text text-[8px] md:text-[10px]">{error}</p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isRecording && !audioChunks.length ? (
        <button
          onClick={startRecording}
          className="terminal-button p-2"
          aria-label="Start recording"
        >
          <Mic className="h-4 w-4" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {isRecording ? (
            <>
              <span className="terminal-text text-[10px] text-[#00ff9d] animate-pulse">
                {formatTime(recordingTime)}
              </span>
              <button
                onClick={stopRecording}
                className="terminal-button p-2 bg-red-500/20 hover:bg-red-500/30"
                aria-label="Stop recording"
              >
                <Square className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSend}
                className="terminal-button p-2 bg-[#00ff9d]/20 hover:bg-[#00ff9d]/30"
                aria-label="Send voice note"
              >
                <Send className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="terminal-button p-2"
                aria-label="Cancel recording"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}