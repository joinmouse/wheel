class DeepClone {
    constructor() {
        this.cache = new Map()
    }
    // clone
    clone(source) {
        if(this.isObject(source)) {
            // 1、首先判断是否缓存命中
            let cacheDist = this.findCache(source)
            if(cacheDist) {
                return cacheDist
            }
            // 2、开始判断对象的各个项目
            let dist
            if(Array.isArray(source)) {
                dist = new Array()
            }else if(source instanceof Function) {
                dist = function() {
                    source.apply(this, [...arguments])
                }
            }else if(source instanceof RegExp) {
                dist = new RegExp(source)
            }else if(source instanceof Date) {
                dist = new Date(source)
            }else {
                dist = new Object()
            }
            this.cache.set(source, dist)
            // 遍历source的属性，不考虑原型链上的属性
            for(let key in source) {
                if(source.hasOwnProperty(key)) {
                    dist[key] = this.clone(source[key])
                }
            }
            return dist
        }
        // 不是对象就直接返回
        return source
    }
    isObject(source) {
        if(typeof source === 'object' && source !== null) {
            return true
        }else {
            return false
        }
    }
    findCache(source) {
        if(this.cache.has(source)) {
            return this.cache.get(source)
        }
    }
}

let obj = {
    a: 1,
    b: function () {
        console.log(1)
    },
    c: new Date(),
    d: /test/,
    h: Symbol(),
    m: {
        demo: {
            x: 12
        }
    }
}
let deepClone = new DeepClone()
let copy = deepClone.clone(obj)
console.log(copy)