// 参数合法性检查真是个老大难呢。。难怪用些什么flow ts

function sameChars(str, num) {
    if(typeof str !== 'string'){
        console.log("param error")
    }
    num = num.toString().split(".")[0]
    let reg ='/(.)\\1{'+num+',}/'
    reg = eval(reg)  
    if (reg.test(str)) {
        console.log("has "+(num-0+1)+" same chars")
    }
}