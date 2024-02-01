import daisyUi from "daisyui";
import { defineConfig } from "vite";

export default defineConfig({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // Configure DaisyUI themes here
  daisyui: {
    themes: ["lemonade"],
  },

  plugins: [daisyUi],
});


