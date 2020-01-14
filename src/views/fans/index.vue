<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>粉丝统计</span>
    </div>
    <div id="main" ref="main2" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
// 导入echarts
import echarts from 'echarts'

export default {
  name: 'Fans',
  mounted () {
    // 绘制图表
    this.paintPic()
  },
  data () {
    return {
      myChart: null// 接收echarts图表信息
    }
  },
  methods: {
    // 绘制图表
    paintPic () {
      let dv = this.$refs.main2
      this.myChart = echarts.init(dv)

      // 饼型图的参数项目
      let option = {
        title: {// 标题
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {// 小提示
          trigger: 'item', // 数据提示小信息触发开关   item触发  none不触发  axis坐标轴触发
          formatter: '{a}<br/>{b}:{c}({d}%)'// 悬浮鼠标提示信息显示百分比
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '60%', // 饼图圆盘大小
            center: ['50%', '50%'], // 定位位置
            data: [// 假数据
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10, // 边框模糊度
                shadowOffsetX: 0, // 圆圈阴影
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            }
          }
        ]
      }
      // 绘制图表  内部实例化acharts对象并进行图像制作
      this.myChart.setOption(option)
      // 获取二次数据对图进行二次填充
      this.getFansStat()
    },
    // 获得对象的成员名称集合
    getkeys (obj) {
      var keys1 = []
      for (var p1 in obj) {
        if (obj.hasOwnProperty(p1)) { keys1.push(p1) }
      }
      return keys1
    },
    // 获得动态服务器真实粉丝数据
    getFansStat () {
      // axios发起请求(接口不稳定404,多试)
      let pro = this.$http({
        url: '/mp/v1_0/statistics/followers',
        method: 'get'
      })
      pro.then(result => {
        // 把粉丝数据封装为option的样子
        let keys = this.getkeys(result.data.data.age)// 把legend的data数据通过result组织
        let dataObj = []// 把series的data数据通过result组织
        let ages = result.data.data.age
        for (var k in ages) {
          // 把成员的key和value获得出来填充到dataObj里边
          dataObj.push({ value: ages[k], name: k })
        }
        let opt = {
          legend: {
            data: keys
          },
          series: [{ data: dataObj }]
        }
        // echarts图表对象调用setoption()
        this.myChart.setOption(opt)
      })
        .catch(err => {
          return this.$message.error('获得粉丝统计数据失败:' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
