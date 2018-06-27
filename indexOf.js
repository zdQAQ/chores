Array.prototype.indexOf = function(value,fromindex){
	//首先判断函数参数数据类型（省题，全方位了解该函数所可能面对的环境）
	//然后考虑边界情况，特殊情况，特殊在js中考虑浏览器对具体使用到的函数的兼容性，向下兼容
    //再实现函数功能
    //可能面对的大部分算法不难，实现也不难，难在考虑全面，这时可引申出测试。
	if(!this.length) return -1;
	let arr = this.split('')
	if(fromindex&&fromindex<this.length) arr = arr.slice(fromindex)
	let nums = 0
	let valueArr = value.split('');
	let valueLength = valueArr.length;
	for(let i=0;i<arr.length;i++){
		if(arr[i]===valueArr[0]){
			for(let j=0;j<valueLength;j++){
				if(arr[i+j]===valueArr[j]){
					nums++
				}
			}
		}
		if(nums === valueLength){
			return i
		}
	}
	return -1
}