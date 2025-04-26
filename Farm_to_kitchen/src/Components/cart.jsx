import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    const incomingProduct = location.state?.product;
    if (incomingProduct) {
      setCartItems((prevItems) => {
        const existing = prevItems.find(item => item.name === incomingProduct.name);
        let updatedCart;
        if (existing) {
          updatedCart = prevItems.map(item =>
            item.name === incomingProduct.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...prevItems, incomingProduct];
        }
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
  }, [location.state]);

  const updateQuantity = (name, delta) => {
    setCartItems((items) => {
      const updatedItems = items
        .map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleBuyNow = (item) => {
    navigate('/checkout', { state: { product: item } });
  };

  const handleConnect = (farmName) => {
    navigate('/messages', { state: { farmName } });
  };
  

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        cartItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 mb-4 border rounded shadow-sm">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">From {item.farm}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.name, -1)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >−</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.name, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >+</button>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2 ml-4">
              <button
                onClick={() => handleBuyNow(item)}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Checkout
              </button>
              <button
                onClick={() => handleConnect(item.farm)}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
              >
                Connect with {item.farm}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;



