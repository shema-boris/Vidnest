import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'title', label: 'Title (A-Z)' },
];

const VideoSearch = ({
  query = '',
  tags = [],
  sort = 'newest',
  availableTags = [],
  onQueryChange = () => {},
  onTagsChange = () => {},
  onSortChange = () => {},
  onSubmit = () => {},
  onClear = () => {},
  className = '',
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tagQuery, setTagQuery] = useState('');

  const filteredTags = tagQuery === ''
    ? availableTags
    : availableTags.filter(tag => 
        tag.toLowerCase().includes(tagQuery.toLowerCase())
      );

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit();
  };

  const handleTagSelect = (tag) => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setTagQuery('');
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const clearAll = () => {
    onClear();
    setShowFilters(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:items-center p-4 space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search videos..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </div>
          
          {/* Sort Dropdown */}
          <div className="w-full md:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filter Toggle Button */}
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            Filters
            {tags.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                {tags.length}
              </span>
            )}
          </button>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Search
          </button>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 px-4 py-4 space-y-4">
            <div>
              <label htmlFor="tag-search" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Tags
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Combobox value={tagQuery} onChange={setTagQuery}>
                    <div className="relative">
                      <Combobox.Input
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Search or add tags..."
                        onChange={(e) => setTagQuery(e.target.value)}
                      />
                      {tagQuery && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-6 flex items-center pr-2"
                          onClick={() => setTagQuery('')}
                        >
                          <XMarkIcon className="h-5 w-5 text-gray-400" />
                        </button>
                      )}
                      {tagQuery && filteredTags.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {filteredTags.map((tag) => (
                            <Combobox.Option
                              key={tag}
                              value={tag}
                              className={({ active }) =>
                                `cursor-default select-none relative py-2 pl-3 pr-9 ${
                                  active ? 'text-white bg-primary-600' : 'text-gray-900'
                                }`
                              }
                              onClick={() => handleTagSelect(tag)}
                            >
                              {tag}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      )}
                    </div>
                  </Combobox>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => tagQuery && !tags.includes(tagQuery) && handleTagSelect(tagQuery)}
                >
                  Add
                </button>
              </div>
              
              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex items-center justify-center flex-shrink-0 h-4 w-4 text-primary-400 hover:text-primary-600"
                        onClick={() => removeTag(tag)}
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-2 border-t border-gray-200">
              <button
                type="button"
                className="text-sm font-medium text-gray-700 hover:text-gray-500 mr-4"
                onClick={clearAll}
              >
                Clear all
              </button>
              <button
                type="button"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
                onClick={() => setShowFilters(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default VideoSearch;
