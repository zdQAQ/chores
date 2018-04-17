//arr 只包含两个元素，顺序递增
function seqOne(arr) {
    if (!arr.push) {
        console.log("not an array!")
    }
    for (let i = arr.length - 1; i > 0; i--) {
        if (arr[i] - arr[i - 1] !== 1) {
            return false
        }
    }
    return true
}

//逆序
function revOne(arr) {
    if (!arr.push) {
        console.log("not an array!")
    }
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] - arr[i + 1] !== 1) {
            return false
        }
    }
    return true
}

function handler(arr, jlen) {
    //判断非法输入
    let illegalarr = (!arr.push) || arr.length < jlen || (arr.length === 1)
    let illegaljlen = (typeof jlen !== 'number') || jlen < 0 || (jlen === 1)
    if (illegalarr || illegaljlen) {
        console.log("params error!")
    }
    //取整数
    jlen = jlen.toString().split(".")[0]
    if (arr.length < jlen) {
        console.log("length error!")
    }
    for (let i = 0; i <= arr.length - jlen; i++) {
        let judgeArr = arr.slice(i, i + jlen)
        if (!seqOne(judgeArr)) {
            console.log("not seq consecutive!")
        }
        if (!revOne(judgeArr)) {
            console.log("not rev consecutive!")
        }
    }
    console.log("consecutive!")
}