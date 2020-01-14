<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>素材管理</span>
       <el-upload
        style="float: right; padding: 3px 0"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="setToken"
        name="image"
        :show-file-list="false"
        :on-success="onSuccess"
        >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <!-- 应用el-upload的默认上传行为
      action：配置上传图片服务器端的完整路径名
      headers：配置请求头信息，即token
        :headers="{Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1Ni……'}"
      name:设置上传图片字段名称
      :show-file-list="false" 不要通过列表形式呈现
      on-success: 成功上传回调
      -->
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <ul>
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt />
          <div class="image-bot">
            <el-button type="success" icon="el-icon-star-off" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </div>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Material',
  computed: {
    // 在computed计算属性中给上传ajax设置token
    setToken () {
      return { Authorization: 'Bearer ' + JSON.parse(window.sessionStorage.getItem('userinfo')).token }
    }
  },
  data () {
    return {
      querycdt: {
        // 获得素材团片的条件
        collect: false, // 非收藏的
        page: 1, // 页码
        per_page: 20 // 条数
      },
      imageList: [] // 已有素材图片列表信息
    }
  },
  created () {
    this.getImageList() // 获得素材图片列表
  },
  methods: {
    // 素材上传完毕的回调处理
    onSuccess (response, file, fileList) {
      // response响应信息  file当前上传好的图片对象   filelist图片列表
      this.$message.success('图片上传成功!')
      this.getImageList()// 刷新图片
    },
    // 获得图片列表
    getImageList () {
      let pro = this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
      pro
        .then(result => {
          console.log(result)
          // imagelist接收素材图片
          this.imageList = result.data.data.results
        })
        .catch(err => {
          return this.$message.error('获得图片失败:' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 素材图片列表样式
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>
