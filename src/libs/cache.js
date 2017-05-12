import config from './config'
import LRUCache from 'lru-cache'

let cache = null
let options = {
    max: 1000,
    maxAge: 1000 * 60 // 1 min cache 
}

export const getCacheByKey = (k) => {
    if (config.isServer) {
        return null
    }
    if (cache === null) {
        cache = LRUCache(options)
    }
    return cache.get(k)
}

export const setCacheByKey = (k, v, seconds = null) => {
    if (config.isServer) {
        return
    }
    let o = {
        max: options.max,
        maxAge: options.maxAge
    }
    if (seconds !== null) {
        o.maxAge = 1000 * seconds
    }
    if (cache === null) {
        cache = LRUCache(o)
    }
    cache.set(k, v)
}

export const delCacheByKey = (k) => {
    if (config.isServer) {
        return null
    }
    if (cache === null) {
        cache = LRUCache(options)
    }
    cache.del(k)
}
