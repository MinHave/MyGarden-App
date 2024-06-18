export const RegEx = {
  email:
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{1,})$/i,
};

export const validEmail = (data: string) => {
  if (data == '') return false;
  else if (!RegEx.email.test(data)) return false;
  else return true;
};
