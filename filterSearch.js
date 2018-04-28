function search() {
    // let me = this
    // this.mainPanelListShip.sort(function (a,b) {
    //   a = a.name ? a.name : a
    //   b = b.name ? b.name : b
    //   let filterVU = me.filterValue.toUpperCase()
    //   let aUArr = a.toUpperCase().split('')
    //   let bUArr = b.toUpperCase().split('')
    //   for (let i = 0; i < aUArr.length; i++) {
    //     if (aUArr[i] === filterVU && !bUArr.includes(filterVU)) {
    //       return -(aUArr.length - i)
    //     }
    //   }
    //   for (let i = 0; i < bUArr.length; i++) {
    //     if (bUArr[i] === filterVU && !aUArr.includes(filterVU)) {
    //       return bUArr.length - i
    //     }
    //   }
    //   return 0
    // })
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