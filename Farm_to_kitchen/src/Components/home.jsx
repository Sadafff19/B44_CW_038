import '../styles/home.css'
import { MapPin , Mails} from 'lucide-react'
import { useContext, useEffect, useState } from 'react';
import {Link, NavLink} from 'react-router-dom'
import { UserContext } from '../context/userContext';
import Navbar from './navbar';

const Home=()=>{

    const [featuredProducts, setFeaturedProducts] = useState([
        { id: 1, name: 'Organic Tomatoes', farmer: 'Green Valley Farms', price: '$3.99/lb', image: 'https://images.unsplash.com/photo-1723477001907-7102c9166e07?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 2, name: 'Free-Range Eggs', farmer: 'Sunny Side Farm', price: '$5.99/dozen', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
        { id: 3, name: 'Artisanal Cheese', farmer: 'Happy Cow Dairy', price: '$8.99/lb', image: 'https://images.unsplash.com/photo-1654513547430-973fe7570159?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]);
    
    const [testimonials, setTestimonials] = useState([
        { id: 1, name: 'Sarah M.', quote: 'The freshest produce I\'ve ever had delivered to my door!', rating: 5 },
        { id: 2, name: 'James T.', quote: 'Supporting local farmers has never been easier or more delicious.', rating: 4 },
        { id: 3, name: 'Priya K.', quote: 'My family can taste the difference with FarmFresh products.', rating: 5 },
    ]);
    
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const {isLogged}=useContext(UserContext)

    return(
        <>
            <div className="nav2">
                <p>Get 100% organic products</p>
                <p>Fresh from the farms to your Kitchen</p>
                <p>Mumbai, 3349</p>
                <p>farmToKitchen@gmail.com</p>
            </div>
            <div className="min-h-screen flex flex-col">
                    {/* Hero Section */}
                    <div className="relative bg-farm-pattern">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-transparent opacity-75"></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                            <div className="md:w-1/2">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Fresh from the farm to your kitchen</h1>
                                <p className="text-xl text-gray-100 mb-8">Connecting you directly with local farmers for the freshest, most sustainable produce available.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <NavLink to="/shop" className="bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition duration-300">
                                        Shop Local Produce
                                    </NavLink>
                                    <NavLink to="/farmers" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition duration-300">
                                        Meet Our Farmers
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-white py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">How FarmFresh Works</h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">A simple three-step process to bring farm-fresh goodness to your table</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition duration-300">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                                        <i className="fas fa-search text-2xl"></i>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Browse Local Farms</h3>
                                    <p className="text-gray-600">Discover farmers in your area and see what they're harvesting this season.</p>
                                </div>
                                <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition duration-300">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                                        <i className="fas fa-shopping-basket text-2xl"></i>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Order Fresh Produce</h3>
                                    <p className="text-gray-600">Select exactly what you want, from seasonal vegetables to farm-fresh dairy.</p>
                                </div>
                                <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition duration-300">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                                        <i className="fas fa-truck text-2xl"></i>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Receive Your Delivery</h3>
                                    <p className="text-gray-600">Get your order delivered to your door or pick up at a local market.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Products */}
                    <div className="bg-gray-50 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">This Week's Fresh Picks</h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Direct from our partner farms to you</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                                        <div className="h-48 overflow-hidden">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                                            <p className="text-gray-600 mb-4">By {product.farmer}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-600 font-bold">{product.price}</span>
                                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300">
                                    View All Products
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="bg-white py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Hear from people who've experienced the FarmFresh difference</p>
                            </div>
                            <div className="relative max-w-3xl mx-auto">
                                {testimonials.map((testimonial, index) => (
                                    <div 
                                        key={testimonial.id} 
                                        className={`transition-opacity duration-500 ${index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'}`}
                                    >
                                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                                            <div className="flex justify-center mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <i 
                                                        key={i} 
                                                        className={`fas fa-star ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'} mx-1`}
                                                    ></i>
                                                ))}
                                            </div>
                                            <p className="text-lg text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center mt-6 space-x-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTestimonial(index)}
                                            className={`w-3 h-3 rounded-full ${index === activeTestimonial ? 'bg-green-600' : 'bg-gray-300'}`}
                                            aria-label={`Go to testimonial ${index + 1}`}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Farmer Spotlight */}
                    <div className="bg-green-800 text-white py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="md:flex items-center">
                                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                                    <h2 className="text-3xl font-bold mb-6">Farmer Spotlight</h2>
                                    <h3 className="text-2xl font-semibold mb-4">Meet the Johnson Family</h3>
                                    <p className="text-lg mb-6">For three generations, the Johnson family has been growing organic vegetables on their 50-acre farm in upstate New York. Now through FarmFresh, they can share their harvest directly with you.</p>
                                    <button className="bg-white text-green-800 hover:bg-gray-100 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition duration-300">
                                        Learn Their Story
                                    </button>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                                        <img 
                                            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                                            alt="Johnson Family Farm" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="bg-gray-50 py-16">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our FarmFresh Community</h2>
                            <p className="text-lg text-gray-600 mb-8">Sign up for our newsletter to get seasonal recipes, farmer stories, and exclusive offers.</p>
                            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                                <input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-gray-900 text-white pt-16 pb-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center">
                                        <i className="fas fa-leaf text-green-500 mr-2"></i>
                                        FarmFresh
                                    </h3>
                                    <p className="text-gray-400">Bridging the gap between farmers and consumers for a healthier, more sustainable future.</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                    <ul className="space-y-2">
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Shop</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Farmers</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Support</h4>
                                    <ul className="space-y-2">
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Returns</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
                                    <div className="flex space-x-4 mb-4">
                                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
                                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
                                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-pinterest"></i></a>
                                    </div>
                                    <p className="text-gray-400">
                                        <i className="fas fa-envelope mr-2"></i> hello@farmfresh.com
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        <i className="fas fa-phone mr-2"></i> (555) 123-4567
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                                <p>&copy; {new Date().getFullYear()} FarmFresh. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                </div>
        </>
    )
}

export default Home