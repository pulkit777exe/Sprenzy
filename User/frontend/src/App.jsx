import { BrowserRouter as Router, Routes, Route } from "react-router"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Home from "./pages/Home"
import ErrorPage from "./pages/Error"
import ContactPage from "./pages/Contact"
import AboutPage from "./pages/About"
import ProductsPage from "./pages/Products"
import Cart from "./pages/Cart"
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';


function App() {

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path={"/"} element={<Home />} />
          <Route path={"/home"} element={<Home />} />
          <Route path={"/products"} element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>      
    </AuthProvider>
  )
}

export default App
