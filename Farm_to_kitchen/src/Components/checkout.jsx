import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialProduct = state?.product;

  const [product, setProduct] = useState(initialProduct);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const updateQuantity = (delta) => {
    setProduct((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleBuy = () => {
    const date = new Date();
    const newOrder = {
      ...product,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };

    const prevOrders = JSON.parse(localStorage.getItem('orders')) || [];
    localStorage.setItem('orders', JSON.stringify([...prevOrders, newOrder]));

    setOrderPlaced(true);
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  if (!product) return <p className="p-4">No product selected for checkout.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>

      <div className="flex items-center gap-2 my-2">
        <button
          onClick={() => updateQuantity(-1)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >−</button>
        <span>{product.quantity}</span>
        <button
          onClick={() => updateQuantity(1)}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >+</button>
      </div>

      <p><strong>Total:</strong> ${(product.price * product.quantity).toFixed(2)}</p>

      {!orderPlaced ? (
        <button
          onClick={handleBuy}
          className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          Buy {product.name}
        </button>
      ) : (
        <p className="text-sm text-gray-500 mt-4">Redirecting to orders...</p>
      )}
    </div>
  );
};

export default Checkout;
