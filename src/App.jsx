import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Editor from './pages/Editor';
import PublicationDetail from './pages/PublicationDetail';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/publicacion/:id" element={<PublicationDetail />} />
      </Routes>
      <Footer />
    </>
  );
}
