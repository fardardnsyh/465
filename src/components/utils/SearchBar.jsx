import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ onSearch, onFocus, onBlur }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setShowSuggestions(true);
    const fetchSuggestionsDelay = setTimeout(() => {
      if (inputValue.trim().length > 6) {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 300); 
    return () => clearTimeout(fetchSuggestionsDelay);
  }, [inputValue]);
  

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${query}&limit=5`
      );
      setSuggestions(response.data.docs.map((doc) => doc.title));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
      setShowSuggestions(false);
      setInputValue("");
    }
    setShowSuggestions(false);
    e.target.querySelector('input[type="search"]').blur();
  };
  

  const handleSuggestionClick = (title) => {
    setInputValue(title);
    setShowSuggestions(false);
    handleChange({ target: { value: title } });
  };

  const handleBlur = () => {
    setShowSuggestions(false);
    onBlur();
  };

  return (
    <div>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-400 rounded-lg bg-gray-50  focus:border-green-500"
            placeholder="Search Books by Book Name"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => {
              setShowSuggestions(true);
              onFocus(); 
            }}
            onBlur={handleBlur}
            required
          />
          <button
            type="submit"
            className="absolute end-2.5 bottom-2.5 bg-green-300 hover:bg-green-400 text-sm focus:outline-none rounded-lg px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="max-w-md mx-auto mt-2 bg-white border border-gray-400 rounded-lg shadow-lg z-50">
          <ul className="list-none">
            {suggestions.map((title, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onMouseDown={() => handleSuggestionClick(title)}
              >
                {title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { SearchBar };
