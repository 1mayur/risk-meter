import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";

const extensions = [".js", ".ts", ".tsx"];

export default {
  input: "src/risk-meter.tsx",
  output: {
    file: "lib/index.js",
    format: "cjs"
  },
  plugins: [
    resolve({ extensions }),
    cjs(),
    babel({
      exclude: ["**/*.test.*", "node_modules/**"],
      extensions
    })
  ],

  external: id => /^react|styled-components/.test(id)
};
