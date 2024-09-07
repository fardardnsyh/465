import { useEffect, useState } from "react";
import axios from "axios";

const useOpenLibrary = (query) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await axios.get(
          `https://openlibrary.org/search.json?q=${query}&limit=10&page=1`
        );
        setData(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
};

export { useOpenLibrary };
