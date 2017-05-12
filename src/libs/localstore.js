import config from './config'
const isSupport = () => {
    if (config.isServer) {
        return false
    }
    let _t = !(typeof window.localStorage === 'undefined');
    return _t;
}

const localStorage = (isSupport()) ? window.localStorage : null
let options = {
    max: 50,
    lifeTime: 1 * 60 // 1 min cache 
}

let ConfigArray = null
const getMemQueue = () => {
    if (ConfigArray !== null) {
        return ConfigArray
    }

    ConfigArray = {
        keys: {},
        objs: []
    }
    if (!isSupport()) {
        return ConfigArray
    }
    //  let key = config.projectName + '_LRUConfig'

    let key = 'QueueMemory'
    let jsonStr = getByKey(key)
        // let jsonStr = localStorage.getItem(key);
    if (jsonStr) {
        ConfigArray = JSON.parse(jsonStr)
        if (typeof ConfigArray.objs == 'undefined' || typeof ConfigArray.keys == 'undefined') {
            ConfigArray = {
                keys: {},
                objs: []
            }
        }
    }

    return ConfigArray

}

const saveByKey = (key, v, encode = false) => {
    if (!isSupport()) {
        return
    }
    key = config.projectName + '_' + key
    if (encode) {
        v = JSON.stringify(v)
    }
    localStorage.setItem(key, v);
}

const removeByKey = (key) => {
    if (!isSupport()) {
        return
    }
    key = config.projectName + '_' + key
    localStorage.removeItem(key);
}

const getByKey = (key) => {

    if (!isSupport()) {
        return null
    }
    key = config.projectName + '_' + key
    return localStorage[key];


}

const getNewMem = () => {
    let mem = getMemQueue()
    let nowTime = (new Date()).getTime();
    let max = options.max
    let theOldestOne = null
    let newObj = {
        keys: {},
        objs: []
    }
    let _o = mem.objs;
    for (let i = 0, len = _o.length; i < len; i++) {
        let item = _o[i]
        if (item.life >= nowTime) {
            let o = {
                key: item.key,
                time: item.time,
                life: item.life
            }
            newObj.keys[item.key] = o
            newObj.objs.push(o)
        }
    }
    newObj.objs.sort((a, b) => { a.time > b.time }) // small to big
    let needCutOne = (newObj.objs.length >= max)

    // console.log('--- before --', newObj)

    if (needCutOne) {
        let first = newObj.objs[0]
        delete newObj.keys[first.key]
        newObj.objs.shift()
    }

    return newObj

}


export const getLocalCacheByKey = (setKey) => {

    let mem = getNewMem()
    let key = config.projectName + '_' + setKey
    let found = false
    if (key in mem.keys) {
        let item = mem.keys[key]
        let nowTime = (new Date()).getTime()
        // console.log('now', nowTime, ' --- ', item.life, item.life - nowTime)
        if (nowTime <= item.life) {
            found = true
        }
    }
    // console.log(mem, ' ------- get---------', found)
    if (found) {
        return getByKey(setKey)
    }
    return null
}

export const setLocalCacheByKey = (setKey, v) => {
    let key = config.projectName + '_' + setKey
    let mem = getNewMem()
    let _o = mem.objs;
    let newObj = mem
        // if (key in mem.keys) {
        // remove first //
    newObj = {
        keys: {},
        objs: []
    }
    for (let i = 0, len = _o.length; i < len; i++) {
        let item = _o[i]
        if (item.key !== key) {
            let o = {
                key: item.key,
                time: item.time,
                life: item.life
            }
            newObj.keys[item.key] = o
            newObj.objs.push(o)
        }
    }
    // }
    let nowTime = (new Date()).getTime();
    let lifeTime = nowTime + (options.lifeTime * 1000)
    let n = {
        key: key,
        time: nowTime,
        life: lifeTime
    }
    newObj.keys[key] = n
    newObj.objs.push(n)
    newObj.objs.sort((a, b) => { a.time > b.time })

    saveByKey('QueueMemory', newObj, true)
    saveByKey(setKey, v)

}
