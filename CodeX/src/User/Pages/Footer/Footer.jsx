import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="text-white py-16 px-4 relative z-10">
      <div className="container mx-auto">
        {/* Top border line */}
        <div className="border-t border-gray-700 mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 ml-8">

          {/* Logo and social icons column */}
          <div className="md:col-span-3 container ml-16">
            <h1
              onClick={() => navigate("/")}
              className="text-3xl md:text-4xl lg:text-5xl font-bold cursor-pointer group"
            >
              <span className="text-white transition-all duration-300 text-6xl">
                Code
              </span>
              <span className="text-green-500 transition-all duration-300 group-hover:text-white text-7xl">
                X
              </span>
            </h1>
            <p className="mb-4 text-green-500 ml-8">CodexLearning</p>

            {/* Social icons */}
            <div className="flex space-x-4 mt-4 ml-8">
              <a href="#" className="text-white hover:text-gray-300">
                {/* Twitter */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>

              <a href="#" className="text-white hover:text-gray-300">
                {/* Instagram */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0-4.865c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z"></path>
                </svg>
              </a>

              <a href="#" className="text-white hover:text-gray-300">
                {/* Facebook */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-green-500">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Live Classes</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-green-500">CodexLearning</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Become a Tutor</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-green-500">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Support</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-medium mb-4 text-green-500">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Cookies Settings</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
