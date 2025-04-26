import React from "react";
import '../styles/about.css'

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800">

      <section
        className="relative bg-green-100 py-20 text-center text-white h-[400px]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1638215640640-c51055587778?q=80&w=1453&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        id="hero-pattern"
      >
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col justify-center h-full px-4">
        <h2 className="text-4xl font-bold text-white">Our Story</h2>
        <p className="mt-4 text-lg">
          From farm to your kitchen, we ensure every step is sustainable, transparent, and
          community-focused.
        </p>
      </div>
    </section>

      <section className="py-20 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-green-700">Our Mission</h3>
            <p className="mt-4 text-gray-700">
              To bridge the gap between local farmers and conscious consumers by offering the freshest produce directly to your table.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-green-700">Our Vision</h3>
            <p className="mt-4 text-gray-700">
              A world where sustainable farming is the norm and every household supports their local agricultural community.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-green-50 py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-10">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            { name: "Sadaf Ara", role: "", image: "/Sadaf.jpg" },
            { name: "Rufus Bright", role: "", image: "/Rufus.jpg" },
            { name: "Vikram Yadav", role: "", image: "https://randomuser.me/api/portraits/women/65.jpg" }
          ].map((member, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <img
                loading="lazy"
                src={member.image}
                alt={`Portrait of ${member.name}`}
                className="w-36 h-36 mx-auto rounded-full mb-4 object-cover object-center"
              />
              <h4 className="text-xl font-semibold text-green-700">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-10">What People Are Saying</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              quote: "Farm to Kitchen has transformed how we eat. The produce is incredibly fresh and we love supporting local farmers!",
              name: "Jane D.",
              image: "https://randomuser.me/api/portraits/women/12.jpg"
            },
            {
              quote: "Knowing where our food comes from gives us peace of mind. Amazing service!",
              name: "Mike B.",
              image: "https://randomuser.me/api/portraits/men/45.jpg"
            },
            {
              quote: "A wonderful initiative that brings the community together through food. Highly recommended!",
              name: "Laura P.",
              image: "https://randomuser.me/api/portraits/women/22.jpg"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-green-50 p-6 rounded-lg shadow-md text-center">
              <img
                loading="lazy"
                src={testimonial.image}
                alt={`Photo of ${testimonial.name}`}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-700 italic">“{testimonial.quote}”</p>
              <h4 className="mt-4 font-semibold text-green-700">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white text-gray-800">
      <header className="bg-green-700 text-white py-6 px-4 text-center">
        <p className="mt-2">Connecting local farmers with your kitchen</p>
      </header>

      <section className="py-10 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-6">
          At FarmFresh, our mission is to empower local farmers by providing them with a platform to sell their fresh, organic produce directly to consumers. We believe in sustainable farming, supporting local economies, and delivering the freshest food possible.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
        <p className="mb-6">
          We are a team of passionate individuals committed to bridging the gap between farms and kitchens. Our team includes agricultural experts, technologists, and food lovers who all share a common goal: making farm-fresh produce accessible to everyone.
        </p>

        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
        <ul className="list-disc list-inside mb-6">
          <li>Fresh fruits and vegetables directly from farmers</li>
          <li>Subscription boxes tailored to your needs</li>
          <li>Transparent sourcing and ethical farming</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
        <p>
          Become a part of the FarmFresh family and enjoy the benefits of healthy, locally sourced food. Whether you're a consumer looking for better produce or a farmer wanting to expand your reach, FarmFresh is here for you.
        </p>
      </section>
    </div>

      <footer className="bg-green-700 text-white py-10 px-6 md:px-20 mt-10">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="text-xl font-bold">Farm to Kitchen</h3>
            <p className="text-gray-300 mt-2">Bringing freshness to your doorstep while supporting local farmers.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <h4 className="font-bold text-lg mb-2">Quick Links</h4>
            <ul className="text-gray-300 space-y-1">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Products</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-sm text-center text-gray-400">&copy; 2025 Farm to Kitchen. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
