import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/utils/BookCard";
import Header from "../components/Header";

const BookShelf = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem("bookmarkedBooks")) || [];
    if (storedBooks.length > 0) {
      fetchBookDetails(storedBooks);
    }
  }, []);

  const fetchBookDetails = async (bookKeys) => {
    try {
      const bookDetails = await Promise.all(
        bookKeys.map(async (key) => {
          try {
            const response = await axios.get(`https://openlibrary.org${key}.json`);
            const coverId = response.data.covers?.[0];
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;

            // Fetch authors if not present
            if (!response.data.authors && response.data.author_key) {
              const authorPromises = response.data.author_key.map(async (authorKey) => {
                const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
                return authorResponse.data.name;
              });
              const authors = await Promise.all(authorPromises);
              response.data.author_name = authors;
            }

            return { ...response.data, coverUrl };
          } catch (error) {
            console.error(`Error fetching details for ${key}:`, error);
            return null;
          }
        })
      );
      const validBooks = bookDetails.filter(book => book !== null);
      setBooks(validBooks);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const toggleBookmark = (bookKey) => {
    const updatedBookmarks = books.filter(book => book.key !== bookKey);
    if (updatedBookmarks.length === books.length) {
      const newBookKey = `/works/${bookKey}`;
      fetchBookDetails([newBookKey]).then(newBooks => {
        setBooks(prevBooks => [...prevBooks, ...newBooks]);
        localStorage.setItem(
          "bookmarkedBooks",
          JSON.stringify([...books.map(book => book.key), newBookKey])
        );
      });
    } else {
      setBooks(updatedBookmarks);
      localStorage.setItem(
        "bookmarkedBooks",
        JSON.stringify(updatedBookmarks.map(book => book.key))
      );
    }
  };

  return (
    <div className="w-full p-4">
      <Header/>
      <h1 className="text-2xl font-bold text-center mb-4">Your Bookshelf</h1>
      {books.length === 0 && (
        <div className="text-center text-gray-500">
          You have not added any books to your bookshelf yet.
        </div>
      )}
      <div className="mx-auto max-w-7xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard
            key={book.key}
            doc={book}
            onToggleBookmark={() => toggleBookmark(book.key)}
            isBookmarked={true}
          />
        ))}
      </div>
    </div>
  );
};

export default BookShelf;
