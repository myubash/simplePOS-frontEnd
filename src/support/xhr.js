import axios from 'axios'
import Swal from 'sweetalert2'

// import { getUser } from 'utils'
// import { landing_page_url, api_url } from 'constant'

function baseAxios(options) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'max-age': 0,
  }

  const url = 'http://localhost:2000/api'
  
  const token = localStorage.getItem('token')
  axios.defaults.headers.common.Authorization = token

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  }
  
  return axios.create({
    baseURL: `${url}`,
    timeout: options.timeout || 30000,
    headers,
  })
}

function executeRequest(method, pathname, data, options = {}) {
  const body = method === 'get' || !data ? {} : { data }
  const reqObj = {
    url: pathname,
    method,
    params: options.query,
    ...body,
  }
  // console.log(pathname, options)
  const baseAxiosRequest = baseAxios(options)
  const xhr = new Promise((resolve, reject) => {
    baseAxiosRequest
      .request(reqObj)
      .then(res => {
        // if(process.env.NODE_ENV === 'development'){
        //   console.log(`response logger, ${res.config.url} status ${res.status}`)
        //   console.log('DATA: ', res.data)
        // }
        // if(res?.data?.refreshToken) {
        //   const account = getUser()
        //   if(!account.parent) localStorage.setItem('token', res.data.refreshToken)
        // }
        resolve(res.data)
      })
      .catch( async (error) => {
        const res = error.response
        const status = res ? res.status : ''
        if (res && 
            res.data &&
            res.data.message)
        {
          error = res.data
        }
        console.log('HTTP ERROR: ', `msg: ${error.message}, code: ${status}`)
        let err = error.message === "$geoNear requires a 2d or 2dsphere index, but none were found" ? "Tidak terdapat truk terdekat" : error.message; 
        if (!options.isBackground) await Swal.fire('ERROR', `${status} : ${err}`, 'error')
        
        // if (res &&
        //     status &&
        //     status === 401){
        //   localStorage.setItem('token', '')
        //   window.location.href = `${landing_page_url}?logout=true`
        // }
	      reject(error)
      })
  })

  return xhr
}

export const xhr = {
  async get(pathname, options) {
    return executeRequest('get', pathname, null, options)
  },

  async post(pathname, data, options) {
    return executeRequest('post', pathname, data, options)
  },

  async put(pathname, data, options) {
    return executeRequest('put', pathname, data, options)
  },

  async delete(pathname, data, options) {
    return executeRequest('delete', pathname, data, options)
  },

  all(promises) {
    return Promise.all(promises)
  },
}
