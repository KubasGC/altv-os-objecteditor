import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/example/startup.ts",
  plugins: [typescript()],
  output: {
    file: "dist/client.js",
    format: "esm",
  },
  external: ["alt", "natives", "alt-client"],
};
