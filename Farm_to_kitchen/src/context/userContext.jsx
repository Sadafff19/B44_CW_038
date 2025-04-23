import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [role, setRole] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsLogged(!!user); 
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
