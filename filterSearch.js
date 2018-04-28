function search() {
    let filterVU = this.filterValue.toUpperCase()
    let list = this.mainPanelListShip
    let filList = []
    let exList = []
    let hfilList = []
    list.forEach(item => {
        let it = item.name ? item.name : item
        if (it.toUpperCase().includes(filterVU)) {
            filList.push(it)
        }
    })
    exList = _.xor(list, filList)
    filList = filList.sort()
    for (let i = 0; i < filList.length; i++) {
        filList[i] = filList[i].name ? filList[i].name : filList[i]
        let iUArr = filList[i].toUpperCase().split('')
        for (let j = 0; j < iUArr.length; j++) {
            if (iUArr[0] === filterVU) {
                hfilList.push(filList[i])
            }
        }
    }
    hfilList = _.uniq(hfilList)
    filList = _.xor(filList, hfilList)
    this.mainPanelListShip = _.concat(hfilList, filList, exList)
}