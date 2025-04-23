import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [details, setDetails] = useState(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "Users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setDetails(docSnap.data());
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            } else {
                navigate("/login");
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, [navigate]);
    

    async function handleLogOut() {
        try {
            await signOut(auth);
            navigate("/login");
            console.log("User logged out successfully!");
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    }

    return (
        <div>
            {details? 
            <>
                <h1>{details.name}</h1>
                <img src={details.photo} alt="" />
                <h2>{details.email}</h2>
            </> : <p>loading..</p>}
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    );
};

export default Profile;
