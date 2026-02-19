import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DynamicPage from './pages/DynamicPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { fetchGlobalSettings } from './utils/api';

function App() {
  const [pageSections, setPageSections] = useState([]);
  const [globalSettings, setGlobalSettings] = useState(null);

  useEffect(() => {
    const loadGlobalSettings = async () => {
      const data = await fetchGlobalSettings();
      setGlobalSettings(data);
    };

    loadGlobalSettings();
  }, []);

  return (
    <div className="app">
      <Header sections={pageSections} globalSettings={globalSettings} />
      <Routes>
        <Route path="/" element={<DynamicPage slug="home" onSectionsLoad={setPageSections} />} />
        <Route path="/:slug" element={<DynamicPage onSectionsLoad={setPageSections} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
