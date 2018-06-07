import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"

import pkg from "./package.json"

export default {
  input: "./src/export.js",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    }
  ],
  external: [],
  plugins: [
    babel({
      exclude: ["node_modules/**"],
      plugins: ["external-helpers"]
    }),
    resolve(),
    commonjs()
  ]
}
