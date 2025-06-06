export default {
  server: {
    proxy: {
      "/auth": "http://localhost:3010",
      "/api": "http://localhost:3010"
    }
  }
};
