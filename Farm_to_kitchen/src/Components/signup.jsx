import { NavLink, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { CircleCheckBig } from "lucide-react"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase/firebase'
import { setDoc, doc } from "firebase/firestore";
import { UserContext } from "../context/userContext"

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [status, setStatus] = useState('')

    const { role, setRole } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()

        if (!email || !pass || !name || !role) {
            alert('Each field is required! Please fill all inputs')
            return
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass)
            const user = userCredential.user

            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                name: name,
                role: role,
                photo: ''
            })

            setStatus('User registered successfully! Redirecting to login...')
            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
            }}
        >
            <div className="form-container w-full max-w-md relative bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
                {status && (
                    <div className="success-message absolute top-4 left-0 right-0 mx-auto w-max bg-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2 animate-fadeIn">
                        <i className="fas fa-check-circle text-green-600"></i>
                        <span className="text-green-800 font-medium">{status}</span>
                    </div>
                )}

                <div className="p-8">
                    <h1 className="logo-text text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-800 to-lime-500 bg-clip-text text-transparent shadow-sm">
                        FARM TO KITCHEN
                    </h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                                className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your password</label>
                            <input
                                type="password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="Password"
                                className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all"
                            />
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all"
                        >
                            <option value="">Select role</option>
                            <option value="Consumer">Consumer</option>
                            <option value="Farmer">Farmer</option>
                        </select>
                        </div>


                        <button
                            onClick={handleSignup}
                            className="signup-btn w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-green-800 to-lime-500 hover:-translate-y-1 hover:shadow-lg transition-all"
                        >
                            Sign Up
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Already registered?
                            <NavLink
                                to="/login"
                                className="register-link font-medium ml-1 text-lime-500 hover:text-green-800 hover:underline"
                            >
                                Log In
                            </NavLink>
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

export default Signup;

