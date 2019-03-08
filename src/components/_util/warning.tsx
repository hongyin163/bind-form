import warning from 'warning';

const warned: { [msg: string]: boolean } = {};
export default (valid: boolean, message: string): void => {
  if (!valid && !warned[message]) {
    warning();
    warned[message] = true;
  }
};
