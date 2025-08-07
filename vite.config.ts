import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    root: ".",
    base: "/front_6th_chapter2-2/",
    build: {
      rollupOptions: {
        input: "./index.advanced.html",
      },
      outDir: "dist",
      copyPublicDir: true,
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);

// import { defineConfig } from 'vitest/config';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   root: '.',
//   base: '/front_6th_chapter2-1/',
//   build: {
//     rollupOptions: {
//       input: './index.html',
//     },
//     outDir: 'dist',
//     copyPublicDir: true,
//   },
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: 'src/setupTests.js',
//   },
// });
