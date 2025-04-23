import { NavLink, useNavigate } from "react-router-dom"
// import '../styles/login.css'
import { useContext, useState } from "react"
import { UserContext } from "../context/userContext"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
// import SignInWithGoogle from "../firebase/signInWithGoogle"
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [status, setStatus] = useState('');
  
    const { setIsLogged } = useContext(UserContext);
    const navigate = useNavigate();
  
    const handleEmailSignIn = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        setStatus('User Logged in Successfully!!');
        setIsLogged(true);
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } catch (err) {
        console.error('Email Sign-in Error:', err.message);
      }
    };
  
    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        setStatus('Google Sign-in successful!');
        setIsLogged(true);
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } catch (err) {
        console.error('Google Sign-in Error:', err.message);
        }
    }    

    function handleRegister(e){
        e.preventDefault()
        navigate('/signup')
    }

    return (
     <div
       className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
       style={{
         backgroundImage:
           "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
       }}
     >
       <div className="form-container w-full max-w-md relative bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
         {status && (
           <div className="success-message absolute top-4 left-0 right-0 mx-auto w-max bg-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2 animate-fadeIn">
             <i className="fas fa-check-circle text-green-600"></i>
             <span className="text-green-800 font-medium">Login successful!</span>
           </div>
         )}

         <div className="p-8">
           <h1 className="logo-text text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-800 to-lime-500 bg-clip-text text-transparent shadow-sm">
             FARM TO KITCHEN
           </h1>

           <div className="space-y-4">
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                 Your email
               </label>
               <input
                 type="email"
                 id="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Enter email"
                 className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all"
               />
             </div>

             <div>
               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                 Your password
               </label>
               <input
                 type="password"
                 id="password"
                 value={pass}
                 onChange={(e) => setPass(e.target.value)}
                 placeholder="Password"
                 className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all"
               />
             </div>

             <button onClick={handleEmailSignIn} className="login-btn w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-green-800 to-lime-500 hover:-translate-y-1 hover:shadow-lg transition-all">
              Login</button>


             <div className="relative my-4">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-300"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
               </div>
             </div>

             <button
               onClick={handleGoogleSignIn}
               className="google-btn w-full py-3 rounded-lg bg-white flex items-center justify-center space-x-2 border border-gray-200 hover:bg-gray-100 hover:-translate-y-1 transition-all"
             >
               <img
                 src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                 alt="Google logo"
                 className="h-5"
               />
               <span>Sign in with Google</span>
             </button>

             <p className="text-center text-sm text-gray-600 mt-4">
               New user?
               <a href="#" onClick={handleRegister} className="register-link font-medium ml-1 text-lime-500 hover:text-green-800 hover:underline">
                 Register
               </a>
             </p>
           </div>
         </div>

         <div className="border-t border-gray-200 px-8 py-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
           <a href="#" className="footer-link text-xs text-gray-600 hover:text-green-800">Privacy Policy</a>
           <a href="#" className="footer-link text-xs text-gray-600 hover:text-green-800">Terms and Conditions</a>
           <p className="text-xs text-gray-500">@2025 by Farm to Kitchen</p>
         </div>
       </div>
     </div>
    );
};

export default LoginPage
