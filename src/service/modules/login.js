import request from '../index'

const validateEmail = email => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default {
  login(fieldValue, password) {
    const isEmail = validateEmail(fieldValue)
    let fieldName = 'email'
    
    if (!isEmail) {
      fieldName = 'username'
    }

    return request('post', '/login', {
      [fieldName]: fieldValue,
      password,
    })
  },
}