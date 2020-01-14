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
  //   paintpic需要最早被调用以便显示图片效果,要在mounted中调用时页面容器已经编译渲染完成了
  mounted () {
    // 绘制图表
    this.paintPic()
  },
  methods: {
    // 绘制图表
    paintPic () {
      // 在vue中获得页面元素有俩种方法
      // dom方式  如document.getelementbyid('main')
      // ref方式  this.$ref.xxx||el-form ref="loginForm"||this.$refs.loginForm.validate()
      // ref既可以获得组件对象,还可以获得html标签对象与document.getelementbyid()表达意思同
      let dv = this.$refs.main2
      var myChart = echarts.init(dv)
      let option = {
        title: {
          text: 'ECharts入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '裤子', '袜子']
        },
        yAxis: {},
        series: [{
          naem: '销量',
          type: 'bar',
          data: [5, 2, 3, 7]
        }]
      }
      // 绘制图表
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
