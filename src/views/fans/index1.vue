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
  methods: {
    // 绘制图表
    paintPic () {
      let dv = this.$refs.main2
      var myChart = echarts.init(dv)
      // 饼型图的参数项目
      let option = {
        title: {// 标题
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {// 小提示
          trigger: 'item', // 触发
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
            radius: '60%', // 圆盘大小
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
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
