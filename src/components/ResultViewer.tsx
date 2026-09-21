"use client";

import React from 'react';

const isImageUrl = (val: any) => {
  if (typeof val !== 'string') return false;
  return val.match(/\.(jpeg|jpg|gif|png)$/) != null || val.startsWith('data:image') || val.includes('url=');
};

const formatKey = (key: string) => {
  // Convert camelCase or snake_case to Title Case
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export default function ResultViewer({ data }: { data: any }) {
  if (data === null || data === undefined) return <span className="text-gray-400 italic">null</span>;

  if (typeof data !== 'object') {
    if (isImageUrl(data)) {
      return (
        <div className="mt-2 mb-2">
          <img src={data} alt="Result" className="max-w-full md:max-w-md h-auto rounded-lg border border-gray-200 shadow-sm" />
        </div>
      );
    }
    
    // For boolean
    if (typeof data === 'boolean') {
      return <span className={`font-medium ${data ? 'text-green-600' : 'text-red-500'}`}>{data ? 'Yes / True' : 'No / False'}</span>;
    }

    return <span className="text-gray-900 font-medium">{String(data)}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-gray-500 italic">Kosong (Empty Array)</span>;
    
    return (
      <div className="space-y-3 mt-1">
        {data.map((item, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
            <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider border-b border-gray-200 pb-1">
              Item {i + 1}
            </div>
            <ResultViewer data={item} />
          </div>
        ))}
      </div>
    );
  }

  // It's an object
  const entries = Object.entries(data);
  if (entries.length === 0) return <span className="text-gray-500 italic">Kosong (Empty Object)</span>;

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => {
        // Skip certain noisy keys if needed
        if (key === 'success' && typeof value === 'boolean') return null;
        if (key === 'tokens_deducted' || key === 'tokens_remaining') return null;

        return (
          <div key={key} className="flex flex-col sm:flex-row sm:items-start py-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span className="font-semibold text-gray-500 sm:w-1/3 shrink-0 capitalize text-sm pt-0.5">
              {formatKey(key)}
            </span>
            <div className="sm:w-2/3 mt-1 sm:mt-0 break-words text-sm">
              <ResultViewer data={value} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
