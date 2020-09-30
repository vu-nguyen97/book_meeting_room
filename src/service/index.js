import api from '../api'

const request = (method, url, params) => {
  if (method === 'post'){
    return api
      .post(url, params)
  } else if (method === 'get') {
    return api
      .get(url, { params })
  } else if (method === 'put') {
    return api
      .put(url, params)
  } else if (method === 'delete') {
    return api
      .delete(url, { params })
  }
}

export default request