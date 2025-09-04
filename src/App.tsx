import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from '@/components/theme-provider';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Stats from '@/pages/Stats';
import NavMenu from './components/layout/NavMenu';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <div className="relative">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='projects' element={<Projects />} />
            <Route path='stats' element={<Stats />} />
          </Routes>
          <NavMenu />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
