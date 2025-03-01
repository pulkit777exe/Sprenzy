import { BrowserRouter as Router, Routes, Route } from "react-router"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Home from "./pages/Home"
import ErrorPage from "./pages/Error"
import ContactPage from "./pages/Contact"
import AboutPage from "./pages/About"
import ProductsPage from "./pages/Products"
import Cart from "./pages/Cart"
import CheckoutSuccess from "./pages/CheckoutSuccess"
import Profile from "./pages/Profile"
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
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
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Router>      
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
