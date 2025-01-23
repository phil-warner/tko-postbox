import multi from '@rollup/plugin-multi-entry';
import copy from 'rollup-plugin-copy';
import html from "rollup-plugin-html";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';

export default [{
  input: ['src/public/js/main.js'],
  output: {
    dir: 'dist/public/js',
  },
  plugins: [
    nodeResolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    html({
      include: "**/*.html"
    }),
    multi({
      entryFileName: 'default.bundle.js'
    }),
    json(),
    alias({
      entries: [
        { find: 'knockout', replacement: '@tko/build.reference' }
      ]
    }),
    copy({
      targets: [
        { src: ['src/app.js', 'src/config', 'src/models', 'src/routers', 'src/views', 'src/public'], dest: 'dist' }
      ],
      flatten: false
    })
  ],
  strictDeprecations: true
}];
