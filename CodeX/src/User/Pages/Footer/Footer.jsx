import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className=" text-white py-16 px-4 relative z-10">
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
            <p className="mb-4 text-green-500 ml-8">Фингром</p>

            <div className="flex space-x-4 mt-4 ml-8">
              <a href="#" className="text-white hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.53.02C13.84 0 15.14.01 16.44.02c1.3 0 2.61.01 3.91.02.82.01 1.63.04 2.44.11.56.05 1.1.14 1.63.28.71.18 1.37.45 1.99.82.63.36 1.2.82 1.69 1.35.5.5.96 1.06 1.32 1.68.36.61.64 1.26.82 1.97.14.53.22 1.08.27 1.63.08.82.1 1.64.11 2.46.01 1.3.02 2.6.02 3.9v.59c0 1.3-.01 2.6-.02 3.9-.01.82-.04 1.64-.11 2.46-.05.55-.14 1.1-.28 1.63-.18.71-.45 1.36-.82 1.97-.36.63-.82 1.19-1.35 1.69-.5.49-1.06.95-1.68 1.31-.61.36-1.27.64-1.98.82-.53.14-1.08.22-1.63.27-.82.08-1.64.1-2.46.11-1.3.01-2.61.02-3.91.02-1.3 0-2.61-.01-3.91-.02-.82-.01-1.64-.04-2.46-.11-.55-.05-1.1-.14-1.63-.28-.7-.18-1.36-.45-1.97-.82-.63-.36-1.2-.82-1.69-1.35-.5-.5-.96-1.06-1.32-1.69-.36-.61-.64-1.26-.82-1.97-.14-.53-.22-1.08-.27-1.63-.08-.82-.1-1.64-.11-2.46-.01-1.3-.02-2.6-.02-3.9v-.6c0-1.3.01-2.6.02-3.9.01-.82.04-1.64.11-2.46.05-.55.14-1.1.28-1.63.18-.71.45-1.36.82-1.97.36-.63.82-1.2 1.35-1.69.5-.5 1.06-.96 1.68-1.32.61-.36 1.27-.64 1.98-.82.53-.14 1.08-.22 1.63-.27.82-.08 1.64-.1 2.46-.11zm.74 5.7c-3.44 0-6.22 2.78-6.22 6.22 0 3.44 2.78 6.22 6.22 6.22 3.44 0 6.22-2.78 6.22-6.22 0-3.44-2.78-6.22-6.22-6.22zm0 2.22c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-green-500">Славные</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Инфо
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Състояние
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-green-500">За нас</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Работни места
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Брандиране
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Ножинарско студио
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-green-500">Колеж</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Поддържка
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Безопасност
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Блог
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-medium mb-4 text-green-500 ">Условия</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Поверителност
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Настройки за бисквитки
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Насоки
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Благодарности
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
