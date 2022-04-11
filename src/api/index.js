const DEFAULT_ERR_MSG = 'Что-то пошло не так...';

export default {
  async get(url, options = {}) {
    try {
      const response = await fetch(url, options);
      const { data, message } = await response.json();

      if (response.ok) {
        return data;
      }

      return new Error(message || DEFAULT_ERR_MSG);
    } catch (err) {
      return new Error(err.message);
    }
  },
};
