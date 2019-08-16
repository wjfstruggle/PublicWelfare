Page({
  data: {
    sortIdName: {}, // 垃圾分类id，垃圾名
    info: '',
    classify: [{
      color: "#664035",
      bgcolor: "#d6d5d4",
      name: "湿垃圾",
      imgURL: '../../../img/HouseholdfoodWaste.jpg',
      content: "日常生活垃圾产生的容易腐烂的生物质废弃物",
      action: ["纯流质的食物垃圾，如牛奶等，应直接倒进下水口", "有包装物的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的可回收物或干垃圾容器"],
    }, {
      color: "#2c2b27",
      bgcolor: "#e9e8e6",
      name: "干垃圾",
      imgURL: '../../../img/ResidualWaste.png',
      content: "除有害垃圾、湿垃圾、可回收物以外的其他生活废弃物",
      action: ["尽量沥干水分", "难以辨识类别的生活垃圾投入干垃圾容器内"],

    }, {
      color: "#e73322",
      bgcolor: "#c8e2f8",
      name: "有害垃圾",
      imgURL: '../../../img/HazardouAwaste.jpg',
      content: "对人体健康或者自然环境造成直接或潜在危害的废弃物",
      action: ["投放时请注意轻放", "易破损的请连带包装或包裹后轻放", "如易挥发，请密封后投放"],
    }, {
      color: "#014782",
      bgcolor: "#e9e8e6",
      imgURL: "../../../img/RecycleableWaste.jpg",
      name: "可回收物",
      content: "适宜回收利用和资源化利 用的，如：玻、金、塑、 纸、衣",
      action: ["轻投轻放", "清洁干燥，避免污染", "废纸尽量平整", "立体包装物请清空内容物，清洁后压扁投放", "有尖锐边角的，应包裹后投放"],
    }]
  },
  onLoad: function (options) {
    let sortIdName = JSON.parse(options.sortIdName)
    this.setData({
      sortIdName: sortIdName
    })
    switch (parseInt(sortIdName.sortId)) {
      case 1:
        this.data.info = this.data.classify[3] // 可回收垃圾
        break;
      case 2:
        this.data.info = this.data.classify[2] // 有害垃圾
        break;
      case 3:
        this.data.info = this.data.classify[0] // 可回收垃圾
        break;
      case 4:
        this.data.info = this.data.classify[1] // 可回收垃圾
        break
    }
    this.setData({
      info: this.data.info
    })
  },
  // 返回首页
  onGoHome() {
    wx.switchTab({
      url: '../../tabBar/index/index'
    })
  },
})