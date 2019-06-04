function getXPath(domNode, root = document) {
	if (!domNode) {
		return;
	}
	const children = root.children;
	const childrenAmounts = children.length;
	for (var i = 0; i < childrenAmounts; i++) {
		if (children[i] == domNode) {
			const isBodyNode = domNode.tagName.toLowerCase() === 'body'
			return childrenAmounts > 1 ?  domNode.tagName.toLowerCase() + (!isBodyNode ?`[${i}]`:'') : domNode.tagName.toLowerCase()
		}
	}

	const multiSiblings = childrenAmounts > 1 && children[i - 1].tagName.toLowerCase() !== 'body'
	return children[i - 1].tagName.toLowerCase() + (multiSiblings ? `[${i - 1}]` : '') + '>' + getXPath(domNode, children[i - 1])

}

function factorial(x) {
    if (x <= 0) {
        return 1;
    } else {
        return x * factorial(x-1); // (A)
    }
}

function factorial1(n) {
    return facRec(n, 1);
}
function facRec(x, acc) {
    if (x <= 1) {
        return acc;
    } else {
        return facRec(x-1, x*acc); // (A)
    }
}