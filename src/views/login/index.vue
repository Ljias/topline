<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 绘制登录form表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt />

        <!-- prop使得校验规则可以找到当前目录进行匹配校验，值 就是当前项目的名称 -->
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
            <i slot="prefix" class="iconfont icon-iconfontshouji"></i>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码">
            <i slot="prefix" class="iconfont icon-yanzhengma"></i>
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:left;" prop="xieyi">
          <!-- 复选框，单个复选框直接设置v-model即可，接收true/false的信息，表示是否选中 -->
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>
        <el-form-item>
          <!-- 登录按钮 -->
          <el-button
           style="width:100%;"
           :loading="isLoading"
           :disabled="isLoading"
           type="primary"
           @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入iconfont的css文件
import '@/assets/iconfont/iconfont.css'
import './gt.js'// 导入极验的gt.js
// gt.js文件本身没有导出动作,直接导入即可,此时系统会增加一个全局变量,名为initGeeTest
export default {
  name: 'Login',
  // 注意：属性绑定、双向数据绑定的值需要通过data做支持
  data () {
    // 自定义协议 声明局部函数,实现校验 校验方法要在return前边
    var xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请遵守协议！'))
    }
    return {
      capObj: null, // 用来接收  极验(窗口)对象
      isLoading: false, // 设置按钮是否处于等待或禁用效果
      loginForm: {
        mobile: '13911118888', // 手机号码
        code: '246810', // 校验码
        xieyi: true // 协议复选框
      },
      // 表单校验
      loginFormRules: {
        mobile: [
          // 必填
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        // 验证码
        code: [
          // 必填
          { required: true, message: '验证码必填' }
        ],
        // 协议
        xieyi: [
          // {validator:函数名字} // 自定义校验
          { validator: xieyiTest }
        ]
      }
    }
  },
  // 登录系统
  methods: {

    login () {
      // 表单验证
      // el-form表单对象.validate()
      console.log(this)
      // this.$refs.loginFormRef 获得elform的组件对象  validata(回调函数)
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) { return false }
        // 判断有缓存好的极验对象可以直接使用(在重复单击登录窗口时使用缓存好的极验对象)
        if (this.capObj) {
          return this.capObj.verify()
        }
        // 设置登录按钮等待,禁用状态(登录按钮放在判断之后,可以使用缓存的极验对象,速度快)
        this.isLoading = true

        // 人机交互验证  A:axios获得极验的密钥信息
        let pro = this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'get'
        })
        pro
          .then(result => {
            console.log(result)// 极验的密钥信息
            let{ data } = result.data// 从result里边解构下面的data对象出来(对象结构赋值)
            window.initGeetest({// 检测dta的数结构,确保data.ge,data.challenge,data.success有值
              gt: data.gt, // 配置参数来自服务端SDK
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind'// 设置验证窗口的样式
            },
            captchaObj => { // 调用验证实例
              captchaObj.onReady(() => { // 验证码ready后才能调用verify方法显示验证码
                captchaObj.verify()// 显示验证码窗口
                // 设置登录按钮恢复状态
                this.isLoading = false// 按钮等待
                // 接收极验对象
                this.capObj = captchaObj
              }).onSuccess(() => {
                // 行为校验正确的处理
                //    B:验证账号,登录系统
                this.loginAct()
              }).onError(() => {
                // 行为错误的处理
              })
            })
          })
          .catch(err => {
            return this.$message.error('获取极验密钥失败' + err)
          })
      })
    },

    loginAct () {
      // 服务端账号真实校验
      let pro = this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'POST',
        data: this.loginForm
      })
      pro
        .then(result => {
          console.log(result)
          // 客户端浏览器把服务器端返回的密钥相关信息通过sessionstorage做记录表明登录状态
          window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
          // 进入后台系统
          // 路由编程式导航  路由地址 '/home'
          // this.$router.push('/home')
          this.$router.push({ name: 'home' })// name属性实现编程式导航
        })
        .catch(err => {
          // 通过弹出框把错误显示出来
          console.log('手机号或验证码错误')
          this.$message.error('手机号码或验证码错误:' + err)
          // this.$message({type:'error',message:'手机号会验证错误:'+err,duration:1000`})
        })
    }
  }
}

</script>

<style lang="less" scoped>
.login-container {
  background-color: gray;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  .login-box {
    width: 410px;
    height: 340px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 75%;
      text-align: center;
      img {
        width: 60%;
        margin: 20px auto;
      }
    }
  }
}
</style>
