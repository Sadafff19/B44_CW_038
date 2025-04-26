import { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const deleteAllOrders = () => {
    localStorage.removeItem('orders');
    setOrders([]);
  };

  const deleteOrder = (indexToRemove) => {
    const updatedOrders = orders.filter((_, index) => index !== indexToRemove);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {orders.length > 0 && (
        <button
          onClick={deleteAllOrders}
          className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete All Orders
        </button>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders placed.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="border rounded mb-4 p-4 flex gap-4 items-center">
            <img src={order.image} alt={order.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Date:</strong> {order.date}</p>
              <p><strong>Time:</strong> {order.time}</p>
            </div>
            <button
              onClick={() => deleteOrder(index)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Delete This Order
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;


