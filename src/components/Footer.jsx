// src/components/layout/Footer.jsx
import React from "react";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 mt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} Vote Analysis. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/joesrilfahmi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
