import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import store, { persistor } from "../src/redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer />
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
  </StrictMode>,
)
