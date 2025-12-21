import Openai from 'openai';

const openai = new Openai({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default openai;
