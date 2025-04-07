import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // If using React

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Set your fixed port here
    strictPort: true // Prevents Vite from switching to a different port if 3000 is in use
  }
});