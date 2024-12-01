import React from 'react';
import { Message } from '../../types/message';
import { formatMessageTime } from '../../utils/messageUtils';
import { Check, CheckCheck } from 'lucide-react';
import { VoiceNotePlayer } from './VoiceNotePlayer';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  const renderMessageContent = (message: Message) => {
    if (message.type === 'voice') {
      return <VoiceNotePlayer audioUrl={message.content} />;
    }
    return (
      <p className="terminal-text text-[10px] md:text-xs whitespace-pre-wrap">
        {message.content}
      </p>
    );
  };

  return (
    <div className="space-y-3 overflow-y-auto h-[50vh] pr-2">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUserId;
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded border border-[#00ff9d] p-2
                ${isOwnMessage ? 'bg-[#00ff9d]/10' : ''}
              `}
            >
              {renderMessageContent(message)}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="terminal-text text-[8px] md:text-[10px] text-[#00ff9d]/70">
                  {formatMessageTime(message.timestamp)}
                </span>
                {isOwnMessage && (
                  message.status === 'read' ? (
                    <CheckCheck className="w-3 h-3 text-[#00ff9d]" />
                  ) : (
                    <Check className="w-3 h-3 text-[#00ff9d]/70" />
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