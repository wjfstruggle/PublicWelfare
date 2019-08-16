Component({
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    total: { // 星星总数
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 1 // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    num: { // 点亮的星星个数
      type: Number,
      value: 1,
      observer: function (val) { // 重要！！ 数据改变时调用的方法
        this.setData({
          Anum1: new Array(val > this.properties.total ? this.properties.total : val),
          Anum2: new Array(this.properties.total - val >= 0 ? this.properties.total - val : 0)
        })
      }
    }
  },

  /**
   * 组件的初始数据
   * 可用于模版渲染
   */
  data: {
    Anum1: null,
    Anum2: null
  },

  ready: function () {
    this.setData({
      Anum1: new Array(this.properties.num),
      Anum2: new Array(this.properties.total - this.properties.num)
    })
  }

})
