import axios from 'axios'
// import qs from 'qs'
import { setCacheByKey, getCacheByKey } from './cache'
import config from './config'
import md5 from 'md5'
import _ from 'lodash'
let getBaseUrl = () => {
    let baseUrl = ''
    if (config.isServer) {
        baseUrl = config.serverProxy
    } else {
        baseUrl = config.clientProxy
    }
    return baseUrl
}

let ajaxConfig = {
    baseURL: '',
    timeout: 20000,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
}
let ajaxCall = null
let getHttpCall = () => {
    if (ajaxCall !== null) {
        return ajaxCall
    }
    ajaxConfig.baseURL = getBaseUrl()
    return ajaxCall = axios.create(ajaxConfig)
}

let getAxios = (processFn) => {
    ajaxConfig.baseURL = getBaseUrl()
    ajaxConfig.onUploadProgress = processFn
    return axios.create(ajaxConfig)
}

export const post = (url, param, cached = false, seconds = 5, process = false) => {
    let key
    let data = param || {}
    if (cached) {
        key = md5(url + JSON.stringify(data))
        let ret = getCacheByKey(key)
        if (ret) {
            return new Promise((resolve) => {
                resolve(ret)
            })
        }
    }
    let _axios
    if (process) {
        _axios = getAxios(process)
    } else {
        _axios = getHttpCall()
    }

    return _axios({
        method: 'post',
        url: url,
        data: data,
    }).then(res => {
        if (_.has(res, 'data')) {
            if (!_.has(res.data, 'success')) {
                res.data.success = false
            } else if (cached) {
                setCacheByKey(key, res.data, seconds)
            }
          if (_.has(res.data, 'code') && res.data.code === -1) {
                alert('Time out, Browser Reload')
                location.reload()
                return
            }
            return res.data
        } else {
            return { success: false, msg: 'Format Error', connectError: false }
        }
    }).catch(err => {
        let ret = { success: false, msg: 'Connection Error', connectError: true }
        return ret
    })

}

export const put = (url, param, process = false) => {
    let _axios
    if (process) {
        _axios = getAxios(process)
    } else {
        _axios = getHttpCall()
    }
    let data = param || {}
    return _axios({
        method: 'put',
        url: url,
        data: data,
    }).then(res => {
        if (_.has(res, 'data')) {
            if (!_.has(res.data, 'success')) {
                res.data.success = false
            }
          if (_.has(res.data, 'code') && res.data.code === -1) {
                alert('Time out, Browser Reload')
                location.reload()
                return
            }
            return res.data
        } else {
            return { success: false, msg: 'Format Error', connectError: false }
        }
    }).catch(err => {
        let ret = { success: false, msg: 'Connection Error', connectError: true }
        return ret
    })

}
export const get = (url, param, cached = false) => {
    let key
    let data = param || {}
    if (cached) {
        key = md5(url + JSON.stringify(data))
        let ret = getCacheByKey(key)
        if (ret) {
            console.log('[debug] cached value : ', key)
            return new Promise((resolve) => {
                resolve(ret)
            })
        }
    }
    let _axios = getHttpCall()

    return _axios({
        method: 'get',
        url: url,
        params: data,
    }).then(res => {
        if (_.has(res, 'data')) {
            if (!_.has(res.data, 'success')) {
                res.data.success = false
            } else if (cached) {
                setCacheByKey(key, res.data)
            }
            if (_.has(res.data, 'code') && res.data.code === -1) {
                alert('Time out, Browser Reload')
                location.reload()
                return
            }
            return res.data
        } else {

            return { success: false, msg: 'Format Error', connectError: false }
        }
    }).catch(err => {
        let ret = { success: false, msg: 'Connection Error', connectError: true }
        return ret
    })



}
