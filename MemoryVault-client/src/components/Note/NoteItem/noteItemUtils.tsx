import React from 'react';

// Convert TipTap JSON body into plain jext
export const extractText = (note: any): string => {
    if (note.type === 'text') return note.text ?? '';
    if (!note.content) return '';
    return note.content.map(extractText).join(' ');
};

// Created this function using ChatGPT
export const getHighlightedSnippet = (body: any, keyword: string): React.ReactElement => {
  const plainText = extractText(body);
  const lowerText = plainText.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  //Find index of where the keyword appears
  const index = lowerText.indexOf(lowerKeyword);

  // If not keyword or not found, return the first 100 characters
  if (!keyword || index === -1) {
    return <>{plainText.slice(0, 100)}{plainText.length > 100 ? '...' : ''}</>;
  }

  // Define the window of text to show around the match 
  // (20 characters before and after)
  const start = Math.max(index - 20, 0);
  const end = Math.min(index + keyword.length + 20, plainText.length);

  // Split the the snippet into 3 parts: 
  // before match, match, after match
  const before = plainText.slice(start, index);
  const match = plainText.slice(index, index + keyword.length);
  const after = plainText.slice(index + keyword.length, end);

  return (
    <>
      {start > 0 && '...'}
      {before}
      <mark>{match}</mark>
      {after}
      {end < plainText.length && '...'}
    </>
  );
};