<template>
  <div>
    <!-- 搜索区 -->
    <el-card class="box-card">
      <!-- 命名插槽头部内容 -->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- 匿名插槽内容主体 -->
      <div class="text item">
        <!-- el-form 搜索表单区域 -->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
            <!-- label：用于设置当前单选按钮的value值情况 -->
          </el-form-item>
          <el-form-item label="频道列表">
            <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
              <!-- <el-option label="html5" value="101"></el-option>
              <el-option label="css3" value="102"></el-option>
              <el-option label="JS高级" value="103"></el-option>-->
              <!-- 1. v-model: 双向绑定，获取选中的项目  或 设置哪个项目选中
                    2. clearable：可以清除选中的项目
                 3. label  设置每个项目对外提示的名称
              4. value 设置每个项目真实起作用的value值-->
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <!--v-model ：双向绑定，获取设置好的时间信息，或设置哪个时间显示
                 1. type="daterange" : 类型设置，daterange表示是日期范围选取的，还有其他可选 year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
            2. value-format  设置接收到时间格式，例如 yyyy-MM-dd-->
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <el-table :data="articleList" style="width:100%" border>
        <!-- <el-table-column label="表格头信息" prop="被显示数据字段名称" width="列宽度(100)"></el-table-column> -->
        <el-table-column label="图标" prop="cover.images[0]">
          <!-- 体现img图片标签效果  作用域插槽调用row-->
          <!-- stData.row.cover.images[0]：代表当前被遍历出来的每条记录的图标信息 -->
          <img
            :src="stData.row.cover.images[0]"
            slot-scope="stData"
            width="150"
            height="100"
            alt="没有图标"
          />
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status===0">草稿</el-tag>
            <el-tag v-else-if="stData.row.status===1" type="success">审核</el-tag>
            <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
            <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
            <!-- el-tag通过type属性体现不同的效果的组件标签
            获取当前文章对象的status状态数据,进行判断显示对应的内容效果-->
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">已删除</el-button>
          <!-- 修改.删除不属于数据部分,是普通的按钮可以不用设置prop,对应的内容可以通过el-tabel-column标签"内容区域"体现  size:medium/small/mini-->
        </el-table-column>
      </el-table>
      <!-- 分页原理 -->
      <!-- select * from article limit 偏移量,长度偏移量=(当前页码-1)*每页条数
           select * from article limit 0,7  // 获得第1页数据
           select * from article limit 7,7  // 获得第2页数据-->
      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="  [10, 20, 30, 40]  "
        :page-size="searchForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
      <!-- <el-pagination
        @size-change="handleSizeChange" // 事件，每页条数变化的回调处理
        @current-change="handleCurrentChange" // 事件，当前页码变化的回调处理
        :current-page="currentPage4" // 属性绑定，默认当前页码，默认第1页
        :page-sizes="  [100, 200, 300, 400]  " // 属性绑定，下拉列表，设定每页显示条数
        :page-size="100"  // 属性绑定，设置默认每页显示条数的
        layout="total, sizes, prev, pager, next, jumper" // 分页布局元素构成
        :total="400" // 属性绑定，设置记录总条数
      ></el-pagination>-->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleList', // name属性值是为了通过devtools调式工具进行精准查找
  // 监听器设置
  watch: {
    searchForm: {// 对sarchform做深度监听
      handler: function (newV, oldV) {
        console.log(newV)// 根据变化后的各个筛选条件重新获得文章列表
        this.getArticleList()
      },
      deep: true
    },

    // 被检测的成员function(newv,oldv){newv:数据变化后的样子  oldv:数据变化前样子}
    // 被检测成员一般就是data成员  名称保持一致
    timetotime: function (newV) {
      // 把接收到的时间信息一分为二给到begin_pubdate和end_pubdate
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  data () {
    return {
      articleList: [], // 文章列表
      tot: 0, // 文章总条数
      channelList: [], // 真实频道列表成员
      timetotime: '', // 临时接收时间范围信息成员
      // 搜索表单数对象
      searchForm: {
        page: 1, // 当前数据记录页码 默认页码
        per_page: 10, // 分页数据记录条数(10~50)  每页显示条数
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        channel_id: '', // 频道id
        status: '' // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
      }
    }
  },
  created () {
    this.getChannelList() // 获得频道信息  在created中调用getchannellist()方法
    this.getArticleList() // 获得文章信息
  },
  methods: {
    // 分页相关
    handleSizeChange (val) { // 每条条数变化的回调处理
      console.log(val)// val变化后的每页条数
      this.searchForm.per_page = val// 更新每页条数
      // this.getArticleList()// 根据变化后的每页条数重新获得文章列表
    },
    handleCurrentChange (val) { // 页码变化的回调处理
      console.log(val)// val变化后的页码
      this.searchForm.page = val// 更新页码
      // this.getArticleList()// 根据变化后页码重新获得文章列表
      // 深度监听器代替做好了回调方法
    },
    // 获得真实文章列表数据
    getArticleList () {
      // 把searchForm内部为空的成员都过滤掉
      let searchData = {}
      for (var i in this.searchForm) { // i代表对象的成员属性名称,status,channel_id,begin_pudate等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          searchData[i] = this.searchForm[i]// 成员值非空
        }
      }
      let pro = this.$http({
        url: '/mp/v1_0/articles',
        method: 'get',
        params: searchData
      })
      pro
        .then(result => {
          console.log(result)
          // data接收文章数据
          this.articleList = result.data.data.results
          // 接收总条数
          this.tot = result.data.data.total_count
        })
        .catch(err => {
          return this.$message.error('获得文章失败：' + err)
        })
    },
    // 获得真实频道数据
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
// 给卡片区设置向下的外边距
.box-card {
  margin-bottom: 15px;
}
.el-pagination{
  margin-top: 15px
}
</style>
