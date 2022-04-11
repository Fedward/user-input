const DEFAULT_ERR_MSG = 'Что-то пошло не так...';

export default {
  async getSuggests(query) {
    try {
      const response = await fetch(`https://habr.com/kek/v2/publication/suggest-mention?q=${query}`);

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
