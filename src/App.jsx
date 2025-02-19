import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import useVoteStore from "./store/useVoteStore";

const App = () => {
  const initializeData = useVoteStore((state) => state.initializeData);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Toaster position="bottom-center" />
        <Navbar />
        <main className="container mt-12 mx-auto px-4 py-8">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
