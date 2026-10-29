import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { KeystrokeProvider } from '@/components/keystroke-provider';
import { ScopeBackground } from '@/components/scope/ScopeBackground';
import { ScopeProvider } from '@/components/scope/ScopeProvider';
import { ThemeProvider } from '@/components/theme-provider';
import About from '@/pages/About';
import Experience from '@/pages/Experience';
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
          <ScopeProvider>
            <div className='relative'>
              {/* Mounted once, outside Routes, so the spectrogram and any playing
                audio carry across page changes. */}
              <ScopeBackground />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='about' element={<About />} />
                <Route path='projects' element={<Projects />} />
                <Route path='experience' element={<Experience />} />
                <Route path='stats' element={<Stats />} />
              </Routes>
              <NavMenu />
            </div>
          </ScopeProvider>
        </KeystrokeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
