import React, { useState } from 'react';
import { Send, Camera, Video, Mic } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { MediaUpload } from './MediaUpload';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  onSendMedia: (file: File, type: 'image' | 'video') => void;
  onSendVoiceNote: (audioBlob: Blob) => void;
  recipientName: string;
}

export function MessageComposer({
  onSendMessage,
  onSendMedia,
  onSendVoiceNote,
  recipientName
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [showMediaButtons, setShowMediaButtons] = useState(false);
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-black border-t border-[#333333] p-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMediaButtons(!showMediaButtons)}
          className="terminal-button p-2"
        >
          <Camera className="h-5 w-5" />
        </button>
        
        {showMediaButtons && (
          <>
            <MediaUpload
              type="image"
              onFileSelect={(file) => onSendMedia(file, 'image')}
              onClear={() => {}}
              selectedFile={null}
            />
            <MediaUpload
              type="video"
              onFileSelect={(file) => onSendMedia(file, 'video')}
              onClear={() => {}}
              selectedFile={null}
            />
          </>
        )}

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message"
          className="flex-1 bg-[#1a1a1a] text-white rounded-full px-4 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#00ff9d]"
        />

        {message.trim() ? (
          <button
            onClick={handleSend}
            className="terminal-button p-2"
          >
            <Send className="h-5 w-5" />
          </button>
        ) : (
          <VoiceRecorder onSendVoiceNote={onSendVoiceNote} />
        )}
      </div>
    </div>
  );
}
