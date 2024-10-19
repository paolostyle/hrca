import daisyui, { type Config as DaisyUiConfig } from 'daisyui';
import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['winter'],
  },
} satisfies Config & { daisyui?: DaisyUiConfig };
