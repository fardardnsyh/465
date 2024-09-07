import React from "react";
import { FaBookmark } from "react-icons/fa";

const BookCard = ({ doc, onToggleBookmark, isBookmarked }) => {
  const [added, setAdded] = React.useState(isBookmarked);

  React.useEffect(() => {
    setAdded(isBookmarked);
  }, [isBookmarked]);

  const handleAddToBookshelf = () => {
    onToggleBookmark(doc.key);
    setAdded(!added);
  };

  return (
    <div className="p-2 border bg-white rounded-lg overflow-hidden shadow-md decoration-none">
      { doc.coverUrl && doc.coverUrl.length > 0 && (
      <img
        src={doc.coverUrl || "/default-cover.jpg"}
        alt={doc.title}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      )}
      <h2 className="text-lg font-bold">{doc.title}</h2>
      {doc.author_name && doc.author_name.length > 0 && (
        <p className="text-sm text-gray-600">
          {doc.author_name.length > 1 ? "Authors" : "Author"}: {doc.author_name.join(", ")}
        </p>
      )}
      {doc.publish_year && doc.publish_year.length > 0 && (
        <p className="text-sm text-gray-600">
          First Published: {doc.publish_year[0]}
        </p>
      )}
      {doc.edition_count && (
        <p className="text-sm text-gray-600">
          Total Editions: {doc.edition_count}
        </p>
      )}
      <button
        className={`flex items-center text-sm text-white px-3 py-1 rounded mt-2 ${
          added ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 hover:bg-gray-400"
        }`}
        onClick={handleAddToBookshelf}
      >
        <FaBookmark className="mr-1" />
        {added ? "Added" : "Add to Bookshelf"}
      </button>
    </div>
  );
};

export default BookCard;
