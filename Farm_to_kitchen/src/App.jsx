import { useContext } from 'react';
import './App.css';
import Navbar from './Components/navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/home';
import Login from './Components/login';
import Signup from './Components/signup';
import Profile from './Components/profile';
import Shop from './Components/shop';
import AboutUs from './Components/about';
import Contact from './Components/contact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DashboardLayout from './Components/dashboardLayout';
import Sidebar from './Components/sidebar'; // ✅ Make sure this import exists
import { UserContext } from './context/userContext';
import Cart from './Components/cart';
import Checkout from './Components/checkout';
import Orders from './Components/orders';
import Messages from './Components/messages';
import ProductDetails from './Components/productDetails';

// import UserManagement from './Components/admin/UserManagement';
// import ProductManagement from './Components/admin/ProductManagement';
// import Reports from './Components/admin/Reports';
// import Orders from './Components/common/Orders';
// import Products from './Components/farmer/Products';
// import AddProduct from './Components/farmer/AddProduct';
// import Weather from './Components/farmer/Weather';
// import AI from './Components/farmer/AI';
// import Messages from './Components/farmer/Messages';

function App() {
  const { isLogged, role, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>; // Optional loading state

  return (
    <div className="flex">
      { isLogged && (role === 'farmer' || role === 'admin') && <Sidebar />} 

      <div className="flex-1">
        <Navbar />
        <Routes>
          {/* Routes without sidebar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/orders' element={<Orders/>}/>
          <Route path='/messages' element={<Messages/>}/>
          <Route path='/productDetails' element={<ProductDetails/>}/>

          {/* Routes with sidebar */}
          <Route
            path="/dashboard/*"
            element={
              <DashboardLayout>
                <Routes>
                  {role === 'admin' && (
                    <>
                      {/* <Route path="user-management" element={<UserManagement />} />
                      <Route path="product-management" element={<ProductManagement />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="orders" element={<Orders />} /> */}
                    </>
                  )}

                  {role === 'farmer' && (
                    <>
                      {/* <Route path="products" element={<Products />} />
                      <Route path="add-product" element={<AddProduct />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="weather" element={<Weather />} />
                      <Route path="ai" element={<AI />} />
                      <Route path="messages" element={<Messages />} /> */}
                    </>
                  )}
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

