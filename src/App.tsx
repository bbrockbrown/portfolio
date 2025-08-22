import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import Home from '@/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
