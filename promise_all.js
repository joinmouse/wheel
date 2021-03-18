// 实现PromiseAll
function myPromiseAll(array) {
    if(!Array.isArray(array)) {
        new Error("只接受数组作为参数")
    }
    let promise = new Promise((resolve, reject) => {
        let all = []
        let count = 0
        for(let i=0; i<array.length; i++) {
            Promise.resolve(array[i]).then(res => {
                all.push(res)
                count += 1
                if(count === array.length ) {
                    resolve(all)
                }
            }, err => {
                reject(err)
            })
        }
    })
    return promise
}

let array = [1, "jack", 3, 12, new Promise((resolve, reject) => {resolve("demo")})]
myPromiseAll(array).then(res => {
    console.log(res)
})
Promise.all(array).then(res => {
    console.log(res)
})