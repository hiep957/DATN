import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search"; // optional MUI icon
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // Assuming you're using react-router-dom for navigation
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const searchParams = useQuery();
  console.log("searchParams", searchParams.get("keyword"));
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Tìm kiếm:", query);
    // Redirect to search page with query

    // Alternatively, you can use a router like react-router-dom
    navigate(`/search?keyword=${query.trim()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm"
    >
      <SearchIcon className="text-gray-500 mr-2" />
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
      />
      <button
        onClick={handleSearch}
        type="submit"
        className="ml-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Tìm
      </button>
    </form>
  );
};

export default SearchBar;
