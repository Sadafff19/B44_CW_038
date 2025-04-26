import { createContext, useState, useEffect } from "react";
import { auth, db } from '../firebase/firebase'
import { setDoc, doc, getDoc } from "firebase/firestore";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [role, setRole] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setIsLogged(!!user);
    
            if (user) {
                try {
                    const userRef = doc(db, 'Users', user.uid);
                    const userSnap = await getDoc(userRef);
    
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setRole(userData.role || ''); // ✅ Set the role here
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            } else {
                setRole('');
            }
    
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    

    return (
        <UserContext.Provider value={{ isLogged, setIsLogged, role, setRole, loading }}>
            {!loading && children}
        </UserContext.Provider>
    );
};
