export default {
  server: {
    proxy: {
      "/auth": "http://localhost:3010"
    }
  }
};