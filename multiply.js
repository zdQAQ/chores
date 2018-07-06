// eg: multiply(1)(2)() = 1*2 = 2
// multiply(1)(2)...(n)() = 1*2*...*n
// multiply(2)(3)(7)() = 2*3*7 = 42

function multi(){
	let item = arguments[0]
	let result = item
	return function line(){
		let next = arguments[0]
		if(next === undefined){
			return result
		}else {
			result = result * next
			return line
		}
	}
}