import _ from 'lodash'
import moment from 'moment'
export const objectAssign = (def = {}, obj = {}) => {
    if (_.isEmpty(def)) {
        return {}
    }

    let ret = {}
    _.forEach(def, (item, key) => {
        if (_.has(obj, key)) {
            if (_.isObject(obj[key])) {
                ret[key] = _.cloneDeep(obj[key])
            } else {
                ret[key] = obj[key]
            }
        } else {
            ret[key] = def[key]
        }
    })
    return ret
}
export const readURL = (url) => {
    return new Promise((resolve, reject) => {
        if (typeof FileReader !== null) {
            let reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result)
            }
            reader.readAsDataURL(url);
        } else {
            reject('no FileReader')
        }
    })
}


export const getMonthDayArray = () => {

    let a = []
    let map = {}
    let ret = {}
    let monthD = {
        '01': 31,
        '02': 29,
        '03': 31,
        '04': 30,
        '05': 31,
        '06': 30,
        '07': 31,
        '08': 31,
        '09': 30,
        '10': 31,
        '11': 30,
        '12': 31
    }
    for (var i = 1; i <= 12; i++) {
        let str = '' + i
        if (i < 10) {
            str = '0' + i
        }
        a.push({
            label: str,
            value: str
        })
        let d = monthD[str]
        let days = []
        for (var k = 1; k <= d; k++) {
            let ss = '' + k
            if (k < 10) {
                ss = '0' + k
            }
            days.push({
                label: ss,
                value: ss
            })
        }
        map[str] = days
    }
    ret['month'] = a
    ret['day'] = map

    return ret
}


export const getPaginatorArray = (total = 0, current = 1, per = 20, display = 3) => {
    let ret = []
    if (current < 1) {
        current = 1
    }
    let pages = Math.ceil(total / per)
    if (pages <= 1) {
        return ret
    }

    if (current > pages) {
        current = pages
    }


    if (display < 1) {
        display = 1
    }
    let middle = current
    let start_page = middle - display
    let end_page = middle + display

    if (start_page < 1) {
        start_page = 1
        end_page = 1 + (display * 2)
    }


    if (end_page > pages) {
        end_page = pages
    }

    for (var i = start_page; i <= end_page; i++) {
        let active = i === current
        ret.push({
            active: active,
            value: i
        })

    }
    return ret

    // console.log(start_page, end_page, ' current :', current)

}
