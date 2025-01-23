import multi from '@rollup/plugin-multi-entry';
import copy from 'rollup-plugin-copy';
import html from "rollup-plugin-html";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [{
  input: ['src/public/js/main.js'],
  output: {
    dir: 'dist/public/js',
  },
  plugins: [
    nodeResolve({ browser: true, preferBuiltins: false }),
    {
      name: 'knockout-fixed',
      resolveId(source) {
        if (source === 'knockout') {
          return 'knockout-fixed';
        }
        return null;
      },
      load(id) {
        if (id === 'knockout-fixed') {
          return `
            import ko from '@tko/build.reference';
            export default ko;
          `;
        }
      }
    },
    commonjs({
      requireReturnsDefault: 'auto'
    }),
    html({
      include: "**/*.html"
    }),
    multi({
      entryFileName: 'default.bundle.js'
    }),
    json(),
    copy({
      targets: [
        { src: ['src/app.js', 'src/config', 'src/models', 'src/routers', 'src/views', 'src/public'], dest: 'dist' }
      ],
      flatten: false
    })
  ],
  strictDeprecations: true
}];