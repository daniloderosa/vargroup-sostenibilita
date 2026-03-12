import adapterStatic from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

const preprocess = sveltePreprocess({
  postcss: { plugins: [autoprefixer] }
});

export default {
  compilerOptions: { runes: true },
  preprocess,
  kit: {
    adapter: adapterStatic({ strict: false }),
    paths: {
      base: '/vargroup-sostenibilita'
    },
    alias: {
      '$components': './src/components',
      '$data':       './src/lib/data',
      '$styles':     './src/lib/styles',
      '$utils':      './src/lib/utils'
    }
  }
};
