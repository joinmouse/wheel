class EventBus {
    constructor(){
        this.map = new Map()
    }
    on(type, callback) {
        if(this.map.has(type)) {
            let oldCallbackQueue = this.map.get(type)
            this.map.set(type, [...oldCallbackQueue, callback])
        }else {
            this.map.set(type, [callback])
        }
    }
    emit(type) {
        if(this.map.has(type)) {
            let callbackQueue = this.map.get(type)
            callbackQueue.forEach(item => {
                item()
            })
        }else {
            console.error("soory is no on~~~")
        }
    }
    off(type) {
        this.map.delete(type)
    }
}
// 实现的API
let eventBus = new EventBus()
eventBus.on('click', function() {
    console.log(1)
})
eventBus.on('click', function() {
    console.log(2)
})
// 触发
eventBus.off('click')
eventBus.emit('click')