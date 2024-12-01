import React, { useRef } from 'react';
import { Image, Film, X } from 'lucide-react';

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  type: 'image' | 'video';
}

export function MediaUpload({ onFileSelect, onClear, selectedFile, type }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image' && !file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {selectedFile ? (
        <div className="flex items-center gap-2 p-2 border border-[#00ff9d] rounded">
          {type === 'image' ? (
            <Image className="h-4 w-4" />
          ) : (
            <Film className="h-4 w-4" />
          )}
          <span className="terminal-text text-[10px] truncate">
            {selectedFile.name}
          </span>
          <button
            onClick={onClear}
            className="terminal-button p-1"
            aria-label="Clear selection"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="terminal-button p-2 flex items-center gap-2"
        >
          {type === 'image' ? (
            <Image className="h-4 w-4" />
          ) : (
            <Film className="h-4 w-4" />
          )}
          <span className="terminal-text text-[10px]">
            {type === 'image' ? 'ADD IMAGE' : 'ADD VIDEO'}
          </span>
        </button>
      )}
    </div>
  );
}