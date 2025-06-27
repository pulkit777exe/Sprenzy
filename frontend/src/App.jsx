import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Home from "./pages/Home"
import ErrorPage from "./pages/Error"
import ContactPage from "./pages/Contact"
import AboutPage from "./pages/About"
import ProductsPage from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import CheckoutSuccess from "./pages/CheckoutSuccess"
import Profile from "./pages/Profile"
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CreateProducts from "./pages/CreateProducts"
import PayoneerCheckout from './pages/PayoneerCheckout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';

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
            <Route path={"/product/:productId"} element={<ProductDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/admin/products" element={<CreateProducts />} />
            <Route path="/checkout" element={<PayoneerCheckout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
          </Routes>
        </Router>      
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
