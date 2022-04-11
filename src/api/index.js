const DEFAULT_ERR_MSG = 'Что-то пошло не так...';

export default {
  async get(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      return new Error(DEFAULT_ERR_MSG);
    } catch (err) {
      return new Error(err);
    }
  },
};
