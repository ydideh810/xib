import React from 'react';
import { Message } from '../../types/message';
import { formatMessageTime } from '../../utils/messageUtils';
import { Check, CheckCheck } from 'lucide-react';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { MediaPreview } from './MediaPreview';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  const renderMessageContent = (message: Message) => {
    if (message.type === 'voice') {
      return <VoiceNotePlayer audioUrl={message.content} />;
    } else if (message.type === 'image' || message.type === 'video') {
      return <MediaPreview type={message.type} url={message.content} />;
    }
    return (
      <p className="terminal-text text-[14px] leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
    );
  };

  return (
    <div className="space-y-3 overflow-y-auto h-[calc(100vh-240px)] px-2">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUserId;
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] rounded-2xl p-3
                ${isOwnMessage ? 'bg-[#1a1a1a]' : 'bg-[#262626]'}
              `}
            >
              {renderMessageContent(message)}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="terminal-text text-[10px] text-[#666666]">
                  {formatMessageTime(message.timestamp)}
                </span>
                {isOwnMessage && (
                  message.status === 'read' ? (
                    <CheckCheck className="w-3 h-3 text-[#00ff9d]" />
                  ) : (
                    <Check className="w-3 h-3 text-[#666666]" />
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
