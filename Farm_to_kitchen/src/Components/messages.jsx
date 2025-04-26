import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const farmersData = {
  1: { name: 'Green Acres', specialty: 'Vegetables', img: 'https://via.placeholder.com/100' },
  2: { name: 'Sunny Farm', specialty: 'Fruits', img: 'https://via.placeholder.com/100' },
  3: { name: 'Fresh Fields', specialty: 'Dairy', img: 'https://via.placeholder.com/100' },
};

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const incomingFarmName = location.state?.farmName;
    if (incomingFarmName) {
      const matchedId = Object.entries(farmersData).find(
        ([, farmer]) => farmer.name.toLowerCase() === incomingFarmName.toLowerCase()
      )?.[0];
      if (matchedId) setSelectedFarmerId(matchedId);
    }
  }, [location.state]);

  const selectedFarmer = selectedFarmerId ? farmersData[selectedFarmerId] : null;

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory(prev => [...prev, { text: message, fromUser: true }]);
      setMessage('');
    }
  };

  const handleSelectFarmer = (farmerId) => {
    setSelectedFarmerId(farmerId);
    setChatHistory([]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {selectedFarmer ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Messaging with {selectedFarmer.name}</h2>
          <div className="border rounded-lg shadow-md p-4 mb-6">
            <div className="h-40 bg-gray-100 overflow-y-auto p-2 rounded mb-2">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-1 text-sm ${msg.fromUser ? 'text-right text-blue-700' : 'text-left text-gray-700'}`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>
            <div className="flex space-x-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                type="text"
                placeholder="Type your message..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-lg mb-6">Select a farmer to start chatting.</p>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-3">Connect with other farmers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(farmersData)
            .filter(([id]) => id !== selectedFarmerId)
            .map(([id, farmer]) => (
              <div
                key={id}
                className="flex items-center border rounded p-3 shadow hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectFarmer(id)}
              >
                <img src={farmer.img} alt={farmer.name} className="w-16 h-16 rounded-full mr-4" />
                <div>
                  <p className="font-semibold">{farmer.name}</p>
                  <p className="text-sm text-gray-600">{farmer.specialty}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
