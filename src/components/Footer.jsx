// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 py-6 px-4 border-t dark:border-gray-800">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Vote Analysis. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
