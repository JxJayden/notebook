const localStorage = window.localStorage;

const read = key => localStorage.getItem(key);

const write = (key, data) => localStorage.setItem(key, data);

const remove = key => localStorage.removeItem(key);

const clear = () => localStorage.clear();

const isSupport = () => {
  try {
    if (!localStorage || !localStorage.setItem) {
      return false;
    }

    localStorage.setItem('__test', 1);
    localStorage.removeItem('__test');

    return true;
  } catch (error) {
    return false;
  }
};

export default { read, write, remove, clear, isSupport };
