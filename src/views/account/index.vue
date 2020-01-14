<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item cardbody">
      <div id="lt">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          label-width="100px"
          :rules="accountFormRules"
        >
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="rt">
        <!-- http-request加入,action和on-success就可以回避,action是必须属性留空即可 -->
        <el-upload class="avator-uploader" action="" :show-file-list="false" :http-request="httpRequest">
        <!-- 判断是否有图像并展示,否则显示+号 -->
          <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" width="200" height="200">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
         <!-- <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"  // 接收附件的服务器端地址
          :show-file-list="false"  // 图片是否以列表形式展示
          :on-success="handleAvatarSuccess" // 图片上传成功后的回调处理methods
          :before-upload="beforeAvatarUpload" // 图片上传之前的回调处理methods
          :http-request="httpRequest" // 自定义上传行为
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar"> // 显示上传好图片
          <i v-else class="el-icon-plus avatar-uploader-icon"></i> // 大+号图片
        </el-upload> -->
      </div>
    </div>
  </el-card>
</template>
<script>
// 导入公共bus的vue对象
import bus from '@/utils/bus.js'

export default {
  name: 'Account',
  data () {
    return {
      // 表单校验
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          { min: 1, max: 7, message: '名字长度介于1-7个字符之间' }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      accountForm: {
        // 各个成员来自api参考【2.4 编辑用户资料】
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '' // 简介
      }
    }
  },
  created () {
    // 获取账户信息
    this.getAccountInfo()
  },
  methods: {
    // 更新上传用户头像
    // @resource被上传头像图片的文件资源信息
    httpRequest (resource) {
      console.log(resource)
      let pic = resource.file// 通过resource 获得被上传的图片对象
      let fd = new FormData()// 利用axios+formdata实现图片上传
      fd.append('photo', pic)// 把图片对象放到fd对象里边
      let pro = this.$http({// axios上场
        url: '/mp/v1_0/user/photo',
        method: 'patch',
        data: fd
      })
      pro.then(result => {
        bus.$emit('upAccountPhoto', result.data.data.photo)// bus要通过$emit调用对应的方法(home组件给bus声明的)同步实现给home页面显示更新
        console.log(result)
        this.$message.success('头像更新成功')// 成功提示
        this.accountForm.photo = result.data.data.photo// 更新显示新头像
      })
        .catch(err => {
          return this.$message.error('更新账户头像失败:' + err)
        })
    },

    // 更新账户信息
    editAccount () {
      // 校验表单
      // axios更新好的账号信息请求服务器端存储
      // get 请求字符串参数通过params传递获取url/post 添加 /put 对全部表单域项目修改 /delete删除  patch对部分表单项目修改
      // 其他请求方式传递的参数都是data
      this.$refs.accountFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        let pro = this.$http({
          url: '/mp/v1_0/user/profile',
          method: 'patch',
          data: this.accountForm
        })
        pro
          .then(result => {
            bus.$emit('upAccountName', this.accountForm.name)// bus要 通过$emit调用对应的方法(home组件给bus声明的)同步实现给home页面显示更新
            console.log(result)
            this.$message.success('更新成功!') // 成功提示
          })
          .catch(err => {
            return this.$message.error('更新账户信息失败:' + err)
          })
      })
    },
    // 获得账户的基本信息
    getAccountInfo () {
      let pro = this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'get'
      })
      pro
        .then(result => {
          console.log(result)
          // 把获得好的账号信息赋予给accountForm
          this.accountForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('获得账号信息失败:' + err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
// 给表单 和 头像区域做布局样式设计
.cardbody {
  display: flex;
  justify-content: space-between;
  #lt {
    width: 40%;
    background-color: pink;
  }
  #rt {
    width: 30%;
    background-color: lightgreen;
  }
}
</style>
