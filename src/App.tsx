import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import P5Sketch from '@/components/P5Sketch';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <P5Sketch />
        <Routes>
          <Route path='/' element={<Navbar />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
