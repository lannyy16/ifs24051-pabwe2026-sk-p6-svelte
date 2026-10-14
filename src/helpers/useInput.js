export function useInput(initialValue = '') {
  let value = initialValue;
  let error = '';

  return {
    get value() {
      return value;
    },

    set value(newValue) {
      value = newValue;
    },

    get error() {
      return error;
    },

    set error(newError) {
      error = newError;
    },

    reset() {
      value = initialValue;
      error = '';
    },
  };
}