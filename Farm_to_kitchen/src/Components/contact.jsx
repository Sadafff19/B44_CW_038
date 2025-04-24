import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faEnvelope, faMapMarkerAlt, faBars } from '@fortawesome/free-solid-svg-icons';

function Contact() {
  return (
    <div className="bg-farm-light font-sans text-farm-dark"> 

      {/* Hero Section */}
      <section className="relative bg-green-300 text-black">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
            <p className="text-xl mb-8">We'd love to hear from you! Whether you have questions about our farm, products, or want to place an order, our team is here to help.</p>
            <a href="#contact-form" className="bg-white text-farm-green font-bold py-3 px-6 rounded-full hover:bg-farm-light transition duration-300 inline-block">Send us a message</a>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="contact-card bg-green-200 p-8 rounded-lg text-center hover:shadow-xl transition duration-300">
              <div className="contact-icon bg-farm-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faPhoneAlt} className="text-2xl" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Call Us</h3>
              <p className="mb-4">Available Monday to Friday, 9am to 5pm</p>
              <a href="tel:+18005551234" className="text-farm-green font-bold hover:underline">+1 (800) 555-1234</a>
            </div>

            {/* Email */}
            <div className="contact-card bg-green-200 p-8 rounded-lg text-center hover:shadow-xl transition duration-300">
              <div className="contact-icon bg-farm-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Email Us</h3>
              <p className="mb-4">We typically respond within 24 hours</p>
              <a href="mailto:hello@farmtokitchen.com" className="text-farm-green font-bold hover:underline">hello@farmtokitchen.com</a>
            </div>

            {/* Visit */}
            <div className="contact-card bg-green-200 p-8 rounded-lg text-center hover:shadow-xl transition duration-300">
              <div className="contact-icon bg-farm-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Visit Us</h3>
              <p className="mb-4">Farm tours by appointment</p>
              <address className="not-italic">123 Orchard Lane<br/>Green Valley, CA 90210</address>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-16 bg-farm-light">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div id="contact-form">
              <h2 className="font-serif text-3xl font-bold mb-6">Send Us a Message</h2>
              <form className="contact-form space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Your Name*</label>
                    <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:border-farm-green"/>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Email Address*</label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:border-farm-green"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium">Subject</label>
                  <input type="text" id="subject" name="subject" className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:border-farm-green"/>
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Your Message*</label>
                  <textarea id="message" name="message" rows="6" required className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:border-farm-green"></textarea>
                </div>
                <button type="submit" className="bg-green-300 text-black font-bold py-3 px-6 rounded-full hover:bg-green-500 transition duration-300">Send Message</button>
              </form>
            </div>

            {/* Map and Hours */}
            <div>
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold mb-6">Our Location</h2>
                <div className="map-container rounded-lg shadow-lg overflow-hidden h-64">
                  <iframe className="w-full h-full" src="https://www.google.com/maps/embed?pb=..." allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl font-bold mb-6">Farm Stand Hours</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b pb-2">
                      <span className="font-medium">Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="font-medium">Saturday</span>
                      <span>8:00 AM - 5:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">*Hours may vary seasonally. Check our social media for updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {/* FAQ Item */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="faq-toggle w-full text-left p-5 bg-green-100 hover:bg-green-200 transition duration-300 flex justify-between items-center">
                <span className="font-medium">How do I place an order for farm-fresh produce?</span>
                <i className="fas fa-chevron-down transition-transform duration-300"></i>
              </button>
              <div className="faq-content  p-5 border-t border-gray-200">
                <p>You can place orders through our online store...</p>
              </div>
            </div>

            {/* Other FAQ Items */}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-farm-green to-green-700 text-black py-16">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold mb-6 text-center">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-6 text-center">Stay updated on farm news, fresh produce, and seasonal recipes!</p>
          <form className="flex justify-center">
            <input type="email" placeholder="Enter your email" className="w-full md:w-1/3 px-4 py-3 rounded-l-lg  bg-black text-white"/>
            <button type="submit" className="bg-green-100 text-farm-green font-bold py-3 px-6 rounded-r-lg hover:bg-green-300 transition duration-300">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-farm-dark text-black py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Farm to Kitchen. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Contact;

