import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const path = useLocation().pathname;
  return (
    <div className="flex items-center justify-end rounded-md p-2">
      <Link to={path === "/bookshelf" ? "/" : "/bookshelf"}>
        <button className="bg-green-300 hover:bg-green-400 text-sm p-2 rounded-md px-4">{path === "/bookshelf" ? "Home" : "Bookshelf"}</button>
      </Link>
    </div>
  );
}
