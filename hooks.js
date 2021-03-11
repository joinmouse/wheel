let isMount = true
// 链表指针
let workInProgressHook = null

// current fiber
const fiber = {
    stateNode: App,
    // 保存函数组件上每一个hooks上数据(单向链表结构)
    memoizedState: null
}

function useState(initialState) {
    let hook
    // 首次渲染
    if(isMount) {
        hook = {
            memoizedState: initialState,
            next: null,
            queue: {
                pending: null
            }
        }
        if(!fiber.memoizedState) {
            fiber.memoizedState = hook
        }else {
            workInProgressHook.next = hook
        }
        workInProgressHook = hook
    }else {
        // update阶段, 已经存在链表
        hook = workInProgressHook
        workInProgressHook = workInProgressHook.next
    }

    // 剪开queue.pending的环状链表
    let baseState = hook.memoizedState
    if(hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next
        do {
            const action = firstUpdate.action
            baseState = action(baseState)
            firstUpdate = firstUpdate.next
        } while(firstUpdate !== hook.queue.pending.next)
        // 清空链表
        hook.queue.pending = null
    }
    hook.memoizedState = baseState
    return [baseState, dispathAction.bind(null, hook.queue)]
}

function dispathAction(queue, action) {
    // 单向环状链表(update有优先级)
    const update = {
        action,
        next: null
    }
    if(queue.pending === null) {
        update.next = update  // u0 -> u0 -> u0
    }else {
        // queue.pending保存的链表最后一项, queue.pending.next表示第一项
        update.next = queue.pending.next
        queue.pending.next = update
    }
    queue.pending = update // queue.pending指向链表最后一项
    schedule() //触发更新
}

// 调度
function schedule() {
    // workInProgressHook指向hooks链表第一个
    workInProgressHook = fiber.memoizedState
    // re-render组件
    let app = fiber.stateNode()
    isMount = false //下次进入就是update
    return app
}

function App() {
    const [num1, updateNum1] = useState(0)
    const [num2, updateNum2] = useState(10)

    console.log("isMount? ", isMount)
    console.log("num1", num1)
    console.log("num2", num2)
    return {
        click() {
            updateNum1(num => num + 1)
            updateNum1(num => num + 1)
            updateNum1(num => num + 1)
        },
        focus() {
            updateNum2(num => num + 10)
        }
    }
}

window.app = schedule()