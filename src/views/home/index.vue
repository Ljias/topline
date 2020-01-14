<template>
  <el-container>

      <el-aside width="200px;">
        <el-menu background-color="#353B4E" text-color="#fff" active-text-color="#409EFF"
        :collapse="isCollapse" :collapse-transition="false" router>
        <!-- collapse控制折叠展开  collapse-transition禁用折叠动画  router配置左侧导航菜单的激活路由 -->
          <!-- 菜单背景色,文字色,子菜单选中的颜色 -->
          <el-menu-item index="/welcome" :style="{ width: isCollapse?'65px':'200px' }">
            <!-- menu-item表示么有子级菜单 -->
            <i class="el-icon-location"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="2" :style="{ width: isCollapse?'65px':'200px' }">
            <!-- submenu表示当前菜单拥有的子级菜单 -->
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/articleadd">发布文章</el-menu-item>
            <el-menu-item index="/article">文章列表</el-menu-item>
            <!--article 配置路由地址信息 -->
            <el-menu-item index="2-3">评论列表</el-menu-item>
            <el-menu-item index="/material">素材管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="/fans" :style="{ width: isCollapse?'65px':'200px' }">
            <i class="el-icon-location"></i>
            <span slot="title">粉丝管理</span>
          </el-menu-item>
          <el-menu-item index="/account" :style="{width:isCollapse?'65px':'200px'}">
            <i class="el-icon-location"></i>
            <span slot="title">账户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

    <el-container>
      <el-header>
        <div id="lt">
          <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" style="cursor:pointer;" @click="isCollapse=!isCollapse"></i>
          <!-- 图标设置点击事件,折叠展开显示不同的图标 (unfolt折叠  folt展开) -->
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>

        <div id="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width:300px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px;">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo" alt width="40" height="40" />
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>github地址</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
              <!-- @click是vue事件绑定  el-dropdown-item是一个组件(多个html集合体)(不知道给哪个标签使用)
              native(事件修饰符)使该事件作用到内部的html上-->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <!-- 给子组件设置占位符  (子路由嵌套)   -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import bus from '@/utils/bus.js'// 导入公共bus的vue对象

export default {
  // 计算属性应用
  computed: {

    // 获得账户名称
    name: function () { // 添加this.tmpname判断临时成员存在即用 ||
      return this.tmpname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    }, // 获得账户头像
    photo: function () {
      return this.tmpphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  data () {
    return {
      tmpname: '', // 临时账户名称  接收更新的账户信息 模拟响应式同步更新
      tmpphoto: '', // 临时账户头像
      isCollapse: false// false展开  true折叠  isCollapse控制菜单折叠展开
    }
  },
  created () {
    // 更新名称   通过$on声明事件方法upaccountname和upaccountphoto 让account的bus来调用进行数据更新
    bus.$on('upAccountName', nm => {
      console.log(nm)
      this.tmpname = nm// 把nm赋值给临时成员tmpname
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))// nm对sessionstorage数据做更新
      userinfo.name = nm// 对userinofo对象的单个项目做更新
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))// 把更新好的userinfo再回传存储到sessionstorage里边
    })
    // 更新头像
    bus.$on('upAccountPhoto', ph => {
      this.tmpphoto = ph// 把ph赋值给临时成员tmpphoto
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))// nm对sessionstorage数据做更新
      userinfo.name = ph// 对userinofo对象的单个项目做更新
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))// 把更新好的userinfo再回传存储到sessionstorage里边
    })
  },
  methods: {
    // 退出系统方法
    logout () {
      this.$confirm('确认要退出系统?', '退出窗口', {
        confirmButtonText: '确认', // confirm 确认
        cancelButtonText: '取消', // cancel 取消
        type: 'warning'
      }).then(() => {
        // 清空sessionStorage数据
        window.sessionStorage.clear()
        // 导航路由到登录页面
        this.$router.push({ name: 'login' })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    #lt {
      width: 40%;
      display: flex;
      align-items: center;
      font-size: 20px;
      color: rgb(44, 62, 80);
      i {
        margin-right: 10px;
        font-size: 25px;
      }
    }
    #rt {
      width: 60%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown {
        span {
          display: flex;
          align-items: center;
          img {
            margin-right: 10px;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .el-main {
    background-color: lightgray;
  }
}
</style>
