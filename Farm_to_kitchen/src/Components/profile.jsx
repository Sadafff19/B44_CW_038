import { useEffect, useState, useContext } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { UserContext } from '../context/userContext';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { setIsLogged } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'Users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
            setIsLogged(true);
          } else {
            console.log('No such user document!');
          }
        } catch (err) {
          console.error('Error fetching user data:', err.message);
        }
      } else {
        navigate('/login')
      }
    });

    return () => unsubscribe()
  }, []);

  async function handleLogOut() {
    try {
        await signOut(auth);
        navigate("/login");
        console.log("User logged out successfully!");
    } catch (error) {
        console.error("Logout error:", error.message);
            }
        }

  if (!userData) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-800">Your Profile</h1>

        <div className="space-y-4 text-gray-700">
        <div>
            {userData.photo ? (
              <img 
                src={userData.photo} 
                alt="User Photo" 
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  borderRadius: '50%', 
                  objectFit: 'cover'
                }} 
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1725866546799-4cc16f6cba23?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Default Photo" 
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }} 
              />
            )}
        </div>
          <div><strong>Name:</strong> {userData.name}</div>
          <div><strong>Email:</strong> {userData.email}</div>
          <div><strong>Role:</strong> {userData.role}</div>

          <button
            onClick={handleLogOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
          >
          Log Out
          </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;
