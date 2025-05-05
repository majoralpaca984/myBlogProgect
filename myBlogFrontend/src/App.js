
import React, { useEffect } from "react";

import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  const fetcAuthors = async () => {
    const res = await fetch(process.env.REACT_APP_APIURL + "/authors",);
    const data = await res.json();
    console.log(data);
  }

  useEffect(() => {
    fetcAuthors();
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
