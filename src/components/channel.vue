<template>
<!--C: v-model直接绑定model -->
     <el-select v-model="nowid" placeholder="请选择" clearable>
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
</template>

<script> // 频道下拉列表的独立组件
export default {
  name: 'Channel',

  // B:修改文章应用中,由于默认显示要显示一个频道,故要通过props接收父组件传过来默认选中频道的信息chid,并通过watch监听器进一步传给nowid,默认频道显示
  // props:['chid'],
  props: {// 参数名称:{成员属性},成员属性可以修饰被传递过来的参数信息
  // 接收父组件传递过来的频道id
    chid: {
      default: ''// default设置默认值
    }
  },

  watch: {
  // A:需要把选中的频道(变化后的nowid)传递给父组件,故声明watch监听器来实现功能
    nowid (newV) {
      this.$emit('slt', newV)// 选中的频道传给父组件
    },
    // 监听chid,并把变化后的chid赋予给nowid,使得下拉列表有默认选中的项目显示(设置默认显示)
    chid (newV) {
      this.nowid = newV
    }
  },

  data () {
    return {
      channelList: [], // 频道列表
      nowid: ''// 频道下拉列表双向绑定的id  当前选中的频道id
    }
  },
  created () {
    this.getChannelList() // 获得频道信息  在created中调用getchannellist()方法
  },
  methods: {// 获得真实频道数据
    getChannelList () {
      // getchannellist方法将axios获取的数据赋予channellist里边
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        method: 'get'
      })
      pro
        .then(result => {
          console.log(result)
          //   data接收频道数据
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败:' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
