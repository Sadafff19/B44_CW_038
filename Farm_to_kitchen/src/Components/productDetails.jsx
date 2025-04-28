import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">No product details available.</p>
      </div>
    );
  }

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: { product: { ...product, quantity: 1 } },
    });
  };

  const handleAddToCart = () => {
    navigate('/cart', {
      state: { product: { ...product, quantity: 1 } },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden ">
        <img src={product.image} alt={product.name} className="w-full h-70 object-cover " />
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 text-sm mb-4">From {product.farm}</p>
          <div className="flex items-center mb-4">
            {[...Array(Math.floor(product.rating))].map((_, i) => (
              <i key={i} className="fas fa-star text-yellow-400 mr-1"></i>
            ))}
            {product.rating % 1 !== 0 && (
              <i className="fas fa-star-half-alt text-yellow-400"></i>
            )}
            <span className="ml-2 text-gray-600">{product.rating} stars</span>
          </div>
          <p className="text-green-700 text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full mr-2">
              {product.category}
            </span>
            {product.organic && (
              <span className="inline-block bg-green-400 text-white px-3 py-1 rounded-full mr-2">
                Organic
              </span>
            )}
            {product.local && (
              <span className="inline-block bg-yellow-400 text-white px-3 py-1 rounded-full">
                Locally Grown
              </span>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-700 text-white py-3 rounded hover:bg-green-800 transition"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
