import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Check } from 'lucide-react';
import { Tag } from '@/types';
import { useAppData } from '@/contexts/AppDataContext';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  label?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  label = 'Tags',
}) => {
  const { data, addTag } = useAppData();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter tags based on input
  const filteredTags = data.tags.filter(tag =>
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTags.includes(tag.name)
  );

  const exactMatch = data.tags.find(
    tag => tag.name.toLowerCase() === inputValue.toLowerCase()
  );

  const showCreateOption = inputValue.trim() && !exactMatch;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const addSelectedTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName));
  };

  const handleCreateTag = () => {
    if (inputValue.trim() && !exactMatch) {
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      addTag({ name: inputValue.trim(), color });
      addSelectedTag(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalOptions = filteredTags.length + (showCreateOption ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < totalOptions - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filteredTags.length) {
        addSelectedTag(filteredTags[focusedIndex].name);
      } else if (focusedIndex === filteredTags.length && showCreateOption) {
        handleCreateTag();
      } else if (inputValue.trim() && exactMatch) {
        addSelectedTag(exactMatch.name);
      } else if (showCreateOption) {
        handleCreateTag();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tagName) => {
          const tag = data.tags.find(t => t.name === tagName);
          return (
            <Badge
              key={tagName}
              variant="secondary"
              className="gap-1 pr-1"
              style={
                tag
                  ? { backgroundColor: tag.color + '20', color: tag.color }
                  : undefined
              }
            >
              {tag && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
              )}
              {tagName}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tagName);
                }}
                className="ml-1 rounded-sm hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>

      {/* Input with typeahead */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Type to search or create tags..."
          className="w-full"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && (inputValue || filteredTags.length > 0) && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {filteredTags.map((tag, index) => (
              <div
                key={tag.id}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted ${
                  focusedIndex === index ? 'bg-muted' : ''
                }`}
                onClick={() => addSelectedTag(tag.name)}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1">{tag.name}</span>
                {selectedTags.includes(tag.name) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}

            {showCreateOption && (
              <div
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted border-t border-border ${
                  focusedIndex === filteredTags.length ? 'bg-muted' : ''
                }`}
                onClick={handleCreateTag}
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">
                  Create tag "<strong>{inputValue}</strong>"
                </span>
              </div>
            )}

            {!filteredTags.length && !showCreateOption && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No tags found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
