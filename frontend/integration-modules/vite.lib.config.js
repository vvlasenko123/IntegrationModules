import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            formats: ["es", "cjs"],
            fileName: (format) => {
                if (format === "es") {
                    return "index.mjs";
                }

                return "index.cjs";
            }
        },
        rollupOptions: {
            external: ["react", "react-dom"]
        }
    }
});
