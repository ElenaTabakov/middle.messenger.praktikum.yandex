import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    root: resolve(__dirname, 'src'),//
    publicDir: resolve(__dirname, 'static'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            input: {
              main: resolve(__dirname, 'src/index.html'),
              login: resolve(__dirname, 'src/login.html'),
              register: resolve(__dirname, 'src/register.html'),
              chat: resolve(__dirname, 'src/chat.html'),
              user: resolve(__dirname, 'src/user.html'),
              404:resolve(__dirname, 'src/404.html'),
              500:resolve(__dirname, 'src/500.html'),
            }
          }
    },
    plugins: [handlebars({
        partialDirectory: resolve(__dirname, 'src/partials'),
        context:{
            path: resolve(__dirname, 'src'),
        }
    })]
});
