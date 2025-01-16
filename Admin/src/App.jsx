import {BrowserRouter as Router, Routes, Route} from 'react-router';
import CreateProducts from './pages/CreateProducts';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-products" element={<CreateProducts />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
