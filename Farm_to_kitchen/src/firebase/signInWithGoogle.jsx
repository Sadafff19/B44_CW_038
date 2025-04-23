import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/google.css'
import { auth } from './firebase'
import { useNavigate } from 'react-router'
import { UserContext } from '../context/userContext';
import { useContext } from 'react';


const SignInWithGoogle=()=>{

    const nav=useNavigate()
    const {setIsLogged}=useContext(UserContext)

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (user) {
                await setDoc(doc(db, 'Users', user.uid), {
                    email: user.email,
                    name: user.displayName,
                    photo: user.photoURL
                });

                setIsLogged(true)
                nav('/profile'); 
            }
        } catch (err) {
            console.error("Google Sign-in failed:", err);
        }
    };
    

    return(
        <>
            <img onClick={googleLogin} src="https://onymos.com/wp-content/uploads/2020/10/google-signin-button-1024x260.png" alt="" className="google" />
        </>
    )
}
export default SignInWithGoogle