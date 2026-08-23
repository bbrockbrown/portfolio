import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { KeystrokeProvider } from '@/components/keystroke-provider';
import { ThemeProvider } from '@/components/theme-provider';
import About from '@/pages/About';
import Home from '@/pages/Home';
import Projects from '@/pages/Projects';
import Stats from '@/pages/Stats';

import NavMenu from './components/layout/NavMenu';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <KeystrokeProvider>
          <div className="relative">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='about' element={<About />} />
              <Route path='projects' element={<Projects />} />
              <Route path='stats' element={<Stats />} />
            </Routes>
            <NavMenu />
          </div>
        </KeystrokeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
