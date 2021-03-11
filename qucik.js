function quick(array) {
    if(array.length < 2) return array
    let [first, ...rest] = array
    let left = rest.filter(item => item < first)
    let right = rest.filter(item => item > first)
    return [...quick(left), first, ...quick(right)]
}

console.log(quick([10, 2, 4, 5, 11]))
console.log(quick([10, 2, 9, 5, 8]))
console.log(quick([2, 1]))

// 空: nlog(n)
// 时: nlog(n)