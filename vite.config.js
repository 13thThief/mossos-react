import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

const path = require('path');
const root = path.resolve(__dirname, 'src');

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@components': path.join(root, 'components/'),
      '@hooks': path.join(root, 'hooks/'),
      '@utils': path.join(root, 'utils/'),
    }
  }
})
