import React, { useState, useEffect } from "react";
import { SearchBar } from "../components/utils/SearchBar";
import { useOpenLibrary } from "../hooks/use-open-library";
import Loader from "../components/utils/Loader";
import BookCard from "../components/utils/BookCard";
import Header from "../components/Header";

const Home = () => {
  const [query, setQuery] = useState("");
  const { data, loading, error } = useOpenLibrary(query);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);

  useEffect(() => {
    const storedBooks = localStorage.getItem("bookmarkedBooks");
    if (storedBooks) {
      setBookmarkedBooks(JSON.parse(storedBooks));
    }
  }, []);

  useEffect(() => {
    if (data) {
      setResultsLoaded(true);
    }
  }, [data]);

  const toggleBookmark = (bookKey) => {
    const updatedBookmarks = [...bookmarkedBooks];
    if (updatedBookmarks.includes(bookKey)) {
      updatedBookmarks.splice(updatedBookmarks.indexOf(bookKey), 1);
    } else {
      updatedBookmarks.push(bookKey);
    }
    setBookmarkedBooks(updatedBookmarks);
    localStorage.setItem("bookmarkedBooks", JSON.stringify(updatedBookmarks));
  };

  return (
    <div className="w-full p-2">
      <Header/>
      <div className={`flex items-center justify-center`}>
        <img
          src="/Hero.png"
          alt="Hero"
          style={{
            width: `${
              searchBarActive && !resultsLoaded
                ? "40%"
                : resultsLoaded
                ? "20%"
                : "50%"
            }`,
            transition: "width 0.5s",
          }}
        />
      </div>
      <SearchBar
        onSearch={setQuery}
        onFocus={() => setSearchBarActive(true)}
        onBlur={() => setSearchBarActive(false)}
      />
      {loading && <div className="mt-5"> 
        <Loader />
        </div>}
      {error && <p>There was an error fetching data.</p>}
      {resultsLoaded && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data && (
            <>
              {data.numFound > 0 ? (
                data.docs.map((doc) => (
                  <BookCard
                    key={doc.key}
                    doc={doc}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={bookmarkedBooks.includes(doc.key)}
                  />
                ))
              ) : (
                <p>No results found for "{query}".</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
