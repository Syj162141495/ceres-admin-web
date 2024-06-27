<!--  -->
<template>
  <div>
    <div class="pending">
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="服务机构名称">
            <el-input v-model="formInline.shopName" placeholder="请输入服务机构名称" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="formInline.chargePersonName" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="医疗联合">
            <el-select v-model="formInline.medicalcollaboration" placeholder="请选择医疗联合类型">
              <el-option label="无" value="无" />
              <el-option label="医联体" value="医联体" />
              <el-option label="医共体" value="医共体" />
            </el-select>
          </el-form-item>
          <el-form-item label="大类">
            <el-select v-model="formInline.classifyParentId" placeholder="请选择服务商大类" @change="changeParentClassadd">
              <el-option
                v-for="(item,index) in parentClasses"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="小类">
            <el-select v-model="formInline.classifyId" placeholder="请先选择服务商大类后再选择服务商小类" style="width: 310px;">
              <el-option
                v-for="(item,index) in classes"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="onSubmit">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
            <el-button type="success" plain @click="addbuss">新建服务商</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          v-fit-columns
          :data="tableData"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333'}"
          tooltip-effect="dark"
          style="width: 100%"
          size="mini"
        >
          <el-table-column prop="shopId" label="序号">
            <template slot-scope="scope">
              {{ indexMethod(scope.$index) }}
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="医疗服务商名称" />
          <el-table-column prop="serviceClassify" label="类型" />
          <el-table-column prop="institutionalGrade" label="机构等级" />
          <el-table-column prop="medicalcollaboration" label="医疗联合" />
          <el-table-column prop="providersMajor" label="大类" />
          <el-table-column prop="providersSubclass" label="小类" />
          <el-table-column prop="institutionalClassify" label="注册" />
          <el-table-column prop="chargePersonName" label="联系人" />
          <el-table-column prop="chargePersonPhone" label="电话" />
          <!-- <el-table-column prop="area" label="地址" /> -->
          <!-- <el-table-column prop="city" label="城市" /> -->
          <!-- <el-table-column prop="serviceClassify" label="服务类型" /> -->
          <!-- <el-table-column prop="address" label="机构地址" width="200" /> -->
          <!-- <el-table-column prop="reditCode" label="社会信用码" /> -->
          <!-- <el-table-column prop="coordinateX" label="经度" />
                <el-table-column prop="coordinateY" label="纬度" /> -->
          <!-- <el-table-column prop="introduction" label="机构简介" /> -->
          <el-table-column label="操作" fixed="right" width="150px" align="center">
            <template slot-scope="scope">
              <div class="btnList">
                <el-button type="text" @click="seeMore(scope.row)">详情</el-button>
                <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.state == 1" type="text" @click="del(scope.row)">禁用</el-button>
                <el-button v-else type="text" @click="del(scope.row)">启用</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <!-- ******************************************************弹框开始****************************************************** -->
      <!-- 新建服务商弹框 -->
      <el-dialog
        :title="
          userState === 0
            ? '新增服务商'
            : userState === 1
              ? '修改服务商'
              : '查看服务商'
        "
        :visible.sync="dialogVisible"
        width="900px"
        top="10px"
        center
        :close-on-click-modal="false"
        @close="handleDialogClose"
      >
        <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="授权信息" name="first">
              <div class="two-column-tabs">
                <el-form ref="ruleFormInfo" :model="ruleForm" :rules="rulesInfo" label-width="110px">
                  <div class="tab-content-column1">
                    <el-form-item label="服务商名称：" prop="shopName" class="form-item" :disabled="isSelectDisabled">
                      <el-input v-model="ruleForm.shopName" />
                    </el-form-item>
                    <el-form-item label="机构等级：" prop="institutionalGrade" class="form-item">
                      <el-input v-model="ruleForm.institutionalGrade" :disabled="disabled" />
                    </el-form-item>
                    <el-form-item label="服务商大类：" prop="providersMajor" class="form-item">
                      <el-select v-model="ruleForm.classifyParentId" placeholder="请选择服务商大类" style="width: 240px;" :disabled="isSelectDisabled" @change="changeParentClass">
                        <el-option
                          v-for="(item,index) in parentClasses"
                          :key="index"
                          :label="item.categoryName"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="注册类型：" prop="institutionalClassify" class="form-item">
                      <el-input v-model="ruleForm.institutionalClassify" :disabled="disabled" />
                    </el-form-item>
                    <el-form-item label="联系人：" prop="chargePersonName" class="form-item">
                      <el-input v-model="ruleForm.chargePersonName" :disabled="disabled" />
                    </el-form-item>
                  </div>
                  <div class="tab-content-column2">
                    <el-form-item label="服务商类型：" prop="serviceClassify" class="form-item">
                      <el-input v-model="ruleForm.serviceClassify" :disabled="disabled" />
                    </el-form-item>
                    <el-form-item label="医疗联合：" prop="medicalcollaboration" class="form-item">
                      <el-select v-model="ruleForm.medicalcollaboration" placeholder="请选择医疗联合类型" style="width: 240px;" :disabled="isSelectDisabled">
                        <el-option label="无" value="无" />
                        <el-option label="医联体" value="医联体" />
                        <el-option label="医共体" value="医共体" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="服务商小类：" prop="providersSubclass" class="form-item">
                      <el-select v-model="ruleForm.classifyId" placeholder="请先选择服务商大类后再选择服务商小类" style="width: 240px;" :disabled="isSelectDisabled">
                        <el-option
                          v-for="(item,index) in classes"
                          :key="index"
                          :label="item.categoryName"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="社会信用代码：" prop="reditCode" class="form-item">
                      <el-input v-model="ruleForm.reditCode" :disabled="disabled" />
                    </el-form-item>
                    <el-form-item label="联系方式：" prop="chargePersonPhone" class="form-item">
                      <el-input v-model="ruleForm.chargePersonPhone" :disabled="disabled" />
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="机构介绍：" prop="introduction" class="form-item">
                      <el-input
                        v-model="ruleForm.introduction"
                        type="textarea"
                        class="form-item-sub"
                        :disabled="disabled"
                        :autosize="{ minRows: 2, maxRows: 3 }"
                        style="width: 690px;"
                      />
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="省/市/区县：" prop="area" class="form-item">
                      <el-input v-model="ruleForm.area" :disabled="disabled" style="width: 690px;" />
                    </el-form-item>
                    <el-form-item label="机构位置：" prop="coordinate" class="form-item">
                      <div style="width: 690px;">
                        <baidu-map
                          id="allmap"
                          style="display:flex;flex-direction: column-reverse;"
                          :scroll-wheel-zoom="true"
                          @ready="mapReady"
                          @click="getLocation"
                        >
                          <div style="display:flex;justify-content:center;margin:15px">
                            <label>纬度：<input v-model="this.ruleForm.coordinateY" :disabled="isSelectDisabled" style="width: 150px;"></label>
                            <label>经度：<input v-model="this.ruleForm.coordinateX" :disabled="isSelectDisabled" style="width: 150px;"></label>
                            <bm-auto-complete v-model="searchJingwei" :sug-style="{zIndex: 999999}">
                              <el-input v-model="searchJingwei" style="width:300px;margin-right:15px" placeholder="输入地址" :disabled="isSelectDisabled" />
                            </bm-auto-complete>
                            <el-button type="primary" style="height: 40px;" @click="getBaiduMapPoint">搜索</el-button>
                          </div>
                          <bm-marker v-if="infoWindowShow" :position="{lng: this.ruleForm.coordinateX, lat: this.ruleForm.coordinateY}">
                            <bm-label content="" :v-if="infoWindowShow" :label-style="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}" />
                          </bm-marker>
                          <bm-info-window :position="{lng: this.ruleForm.coordinateX, lat: this.ruleForm.coordinateY}" :show="infoWindowShow" @clickclose="infoWindowClose">
                            <p>纬度:{{ this.ruleForm.coordinateY }}</p>
                            <p>经度:{{ this.ruleForm.coordinateX }}</p>
                          </bm-info-window>
                        </baidu-map>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="客户信息" name="second">
              <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="账号" prop="shopPhone">
                  <el-input v-model="ruleForm.shopPhone" :disabled="disabled" maxlength="20" style="width: 650px;" />
                </el-form-item>
                <el-form-item label="密码" prop="shopPassword">
                  <el-input v-model="ruleForm.shopPassword" type="password" :disabled="disabled" maxlength="20" style="width: 650px;" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeFn">取 消</el-button>
          <el-button v-if="activeName == 'first'" type="primary" @click="next">下一步</el-button>
          <el-button v-else type="primary" @click="addCheck('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import Vue from 'vue'
import Plugin from 'v-fit-columns'
import {
  getGroupSelect,
  getserverClassify
} from '@/api/commodity'
Vue.use(Plugin)
import {
  businessListGetAll,
  businessListSave,
  businessListGetById,
  businessListUpdate,
  businessListStart
} from '@/api/business'
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      // 新建服务商弹框
      dialogVisible: false,
      activeName: 'first',
      formInline: {
        shopName: '', // 服务商名称
        // shopCode: '', // 服务商编码
        chargePersonName: '', // 服务商负责人
        providersMajor: '',
        providersSubclass: '',
        serviceClassify: '',
        // classifyId: 0,
        classifyParentId: '',
        classifyId: '', // 分类id
        // contractState: '', // 合同状态 1-有效 0-无效
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      },
      disabled: false,
      ruleForm: {
        // providersType: '',
        // providersMajor: '',
        // providersSubclass: '',
        shopName: '', // 服务商名称
        // city: '',
        area: '',
        serviceClassify: '医疗服务',
        institutionalClassify: '',
        institutionalGrade: '',
        medicalcollaboration: '',
        // address: '',
        reditCode: '',
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        coordinateX: '',
        coordinateY: '',
        introduction: '',
        shopPhone: '', // 账号
        shopPassword: '', // 密码
        classifyParentId: '',
        classifyId: '' // 分类id
      },
      rulesInfo: {
        shopName: [
          { required: true, message: '请输入服务商名称', trigger: 'blur' }
        ],
        chargePersonPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ]
      },
      rules: {
        shopPhone: [
          { required: true, message: '请输入账号', trigger: 'blur' }
          // {
          //   pattern: /^1[34578]\d{9}$/,
          //   message: '目前只支持中国大陆的手机号码'
          // }
        ],
        shopPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }

          // {
          //   pattern: /^[~!@#$%^&*\-+=_.0-9a-zA-Z]{8,16}$/,
          //   message: '8-16密码数字英文混合'
          // }
        ]
      },
      total: 1,
      serviceList: [],
      tableData: [],
      currentPage: 1,
      userState: 1,
      shopId: 0,
      searchJingwei: '',
      infoWindowShow: true,
      point: '',
      classifyList: [],
      parentClasses: [],
      classes: []
    }
  },
  // 监听属性 类似于data概念
  computed: {
    indexMethod() {
      return (index) => {
        return (this.formInline.page - 1) * this.formInline.pageSize + index + 1
      }
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.selectList()
    this.getAll(this.formInline)
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  async mounted() {
    await this.selectList()
    this.getAll(this.formInline)
    // await this.mapReady({ BMap, map })
    this.parentClasses = this.classifyList.find(item => item.categoryName === '医疗服务')['childs']
    this.classes = this.parentClasses.find(item => item.id === this.ruleForm.classifyParentId) && this.parentClasses.find(item => item.id === this.ruleForm.classifyParentId)['childs']
    await this.mapReady({ BMap, map })
  },
  // 方法集合
  methods: {
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleDialogClose() {
      // this.infoWindowShow = false; // 隐藏信息窗口
      this.map.centerAndZoom(this.point, 12) // 将地图视图恢复到初始状态
      this.ruleForm.coordinateX = '' // 清空坐标信息
      this.ruleForm.coordinateY = ''
      this.searchJingwei = ''
    },
    onSubmit() {
      this.getAll(this.formInline)
    },
    // 地图初始化
    mapReady({ BMap, map }) {
      // 选择一个经纬度作为中心点
      if (this.userState === 0) {
        this.point = new BMap.Point(116.3925, 39.9075)
        map.centerAndZoom(this.point, 12)
      } else {
        map.centerAndZoom(new BMap.Point(this.ruleForm.coordinateX, this.ruleForm.coordinateY), 12)
      }
      this.BMap = BMap
      this.map = map
    },
    // 点击获取经纬度
    getLocation(e) {
      this.ruleForm.coordinateX = e.point.lng
      this.ruleForm.coordinateY = e.point.lat
      this.infoWindowShow = true
    },
    getBaiduMapPoint() {
      const that = this
      const myGeo = new this.BMap.Geocoder()
      myGeo.getPoint(this.searchJingwei, function(point) {
        if (point) {
          that.map.centerAndZoom(point, 15)
          that.ruleForm.coordinateY = point.lat
          that.ruleForm.coordinateX = point.lng
          that.infoWindowShow = true
        }
      })
    },
    // 信息窗口关闭
    infoWindowClose() {
      this.ruleForm.coordinateY = ''
      this.ruleForm.coordinateX = ''
      this.infoWindowShow = false
    },
    // 新建服务商
    addbuss() {
      this.userState = 0
      this.disabled = false
      this.isSelectDisabled = false
      this.ruleForm = {
        providersMajor: '',
        providersSubclass: '',
        medicalcollaboration: '',
        shopName: '', // 服务商名称
        city: '',
        area: '',
        serviceClassify: '医疗服务',
        institutionalClassify: '',
        institutionalGrade: '',
        address: '',
        reditCode: '',
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        coordinateX: '',
        coordinateY: '',
        introduction: '',
        // shopAdress: '', // 地址
        // classify: '', //大类
        // coordinate: '', //坐标
        // service: '', //提供服务
        // effectiveDate: '', // 生效日期
        // effectiveYear: '', // 生效年限
        // contractState: 1, // 合同状态 1-有效 0-无效
        shopPhone: '', // 账号
        shopPassword: '', // 密码
        classifyParentId: '',
        classifyId: '' // 分类id
      }
      this.dialogVisible = true
      console.log(this.userState)
    },
    next() {
      this.activeName = 'second'
    },
    closeFn() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
        this.$refs['ruleFormInfo'].clearValidate()
        this.searchJingwei = ''
        this.infoWindowShow = false
        this.dialogVisible = false
      })
    },
    // 新建服务商确定
    addCheck(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          console.log(this.userState)
          console.log(this.ruleForm)
          if (this.ruleForm.shopName === '') {
            this.$message.error('请输入服务商名称')
            return
          }
          if (this.ruleForm.chargePersonPhone === '') {
            this.$message.error('请输入联系电话')
            return
          }
          if (!this.userState) {
            this.ruleForm.serviceClassify = '医疗服务'
            if (this.ruleForm.classifyId && this.ruleForm.classifyId !== '') {
              for (const category of this.classifyList.find(item => item.categoryName === '医疗服务')['childs']) {
                for (const subCategory of category['childs']) {
                  if (parseInt(subCategory['id']) === parseInt(this.ruleForm.classifyId)) {
                    this.ruleForm.providersMajor = category['categoryName']
                    this.ruleForm.providersSubclass = subCategory['categoryName']
                  }
                }
              }
            }
            businessListSave(this.ruleForm).then(res => {
              if (res.code === '') {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              }
              this.getAll(this.formInline)
              this.dialogVisible = false
              this.$refs.ruleForm.clearValidate()
            })
          } else {
            if (this.ruleForm.classifyId && this.ruleForm.classifyId !== '') {
              for (const category of this.classifyList.find(item => item.categoryName === '医疗服务')['childs']) {
                for (const subCategory of category['childs']) {
                  if (parseInt(subCategory['id']) === parseInt(this.ruleForm.classifyId)) {
                    this.ruleForm.providersMajor = subCategory['categoryName']
                    this.ruleForm.providersSubclass = category['categoryName']
                    this.ruleForm.classifyId = subCategory['id']
                  }
                }
              }
            }
            businessListUpdate(this.ruleForm).then(res => {
              if (res.code === '') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$refs.ruleForm.clearValidate()
              }
              this.getAll(this.formInline)
              this.dialogVisible = false
            })
          }
        } else {
          console.log('error submit!!')
          this.$message.error('请输入完整信息')
          return false
        }
      })
    },
    // 清除
    clear() {
      this.formInline = {
        shopName: '', // 服务商名称
        chargePersonName: '', // 服务商负责人
        providersMajor: '',
        providersSubclass: '',
        serviceClassify: '',
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      },
      this.searchJingwei = ''
      this.getAll(this.formInline)
    },
    // 查看
    async seeMore(row) {
      this.isSelectDisabled = true
      const res = await businessListGetById({ shopId: row.shopId })
      this.ruleForm = {
        providersMajor: '',
        providersSubclass: '',
        medicalcollaboration: '',
        shopName: '', // 服务商名称
        city: '',
        area: '',
        serviceClassify: '医疗服务',
        institutionalClassify: '',
        institutionalGrade: '',
        address: '',
        reditCode: '',
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        coordinateX: '',
        coordinateY: '',
        introduction: '',
        shopPhone: '', // 账号
        shopPassword: '', // 密码
        classifyParentId: '',
        classifyId: '' // 分类id
      }
      this.dialogVisible = true
      if (res.code === '') {
        this.userState = 3
        this.disabled = true
        this.ruleForm = res.data
        this.infoWindowShow = true
        if (this.ruleForm.classifyId && this.ruleForm.classifyId !== '') {
          for (const category of this.classifyList.find(item => item.categoryName === '医疗服务')['childs']) {
            for (const subCategory of category['childs']) {
              if (parseInt(subCategory['id']) === parseInt(this.ruleForm.classifyId)) {
                this.ruleForm.classifyId = subCategory['categoryName']
                this.ruleForm.classifyParentId = category['categoryName']
              }
            }
          }
        }
        this.mapReady({ BMap: this.BMap, map: this.map })
      }
    },
    // 编辑
    async edit(row) {
      this.userState = 1
      this.disabled = false
      this.isSelectDisabled = false
      const res = await businessListGetById({ shopId: row.shopId })
      this.dialogVisible = true
      this.ruleForm = {
        providersMajor: '',
        providersSubclass: '',
        medicalcollaboration: '',
        shopName: '', // 服务商名称
        city: '',
        area: '',
        serviceClassify: '医疗服务',
        institutionalClassify: '',
        institutionalGrade: '',
        address: '',
        reditCode: '',
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        coordinateX: '',
        coordinateY: '',
        introduction: '',
        shopPhone: '', // 账号
        shopPassword: '', // 密码
        classifyParentId: '',
        classifyId: '' // 分类id
      }
      if (res.code === '') {
        this.ruleForm = res.data
        this.infoWindowShow = true
        if (this.ruleForm.classifyId && this.ruleForm.classifyId !== '') {
          for (const category of this.classifyList.find(item => item.categoryName === '医疗服务')['childs']) {
            for (const subCategory of category['childs']) {
              if (parseInt(subCategory['id']) === parseInt(this.ruleForm.classifyId)) {
                this.ruleForm.classifyId = subCategory['categoryName']
                this.ruleForm.classifyParentId = category['categoryName']
              }
            }
          }
        }
        this.mapReady({ BMap: this.BMap, map: this.map })
      }
    },
    // 删除
    async del(row) {
      console.log(row)
      if (row.state === 1) {
        const res = await businessListStart({
          shopName: row.shopName,
          state: 0,
          shopId: row.shopId
        })
        if (res.code === '') {
          this.$message({
            message: '停用成功',
            type: 'success'
          })
          this.getAll(this.formInline)
        }
      } else {
        const res = await businessListStart({
          shopName: row.shopName,
          state: 1,
          shopId: row.shopId
        })
        if (res.code === '') {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
          this.getAll(this.formInline)
        }
      }
    },
    // businessListGetAll
    // 初始化查询所有数据
    async getAll(formInline) {
      this.formInline.serviceClassify = '医疗服务'
      const res = await businessListGetAll(formInline)
      this.total = res.data.total
      this.tableData = res.data.list
      if (res.code === '') {
        this.ruleForm = res.data
        if (this.ruleForm.classifyId && this.ruleForm.classifyId !== '') {
          for (const category of this.classifyList.find(item => item.categoryName === '医疗服务')['childs']) {
            for (const subCategory of category['childs']) {
              if (parseInt(subCategory['id']) === parseInt(this.ruleForm.classifyId)) {
                this.ruleForm.classifyId = subCategory['categoryName']
                this.ruleForm.classifyParentId = category['categoryName']
                this.tableData.providersMajor = category['categoryName']
                this.tableData.providersSubclass = subCategory['categoryName']
              }
            }
          }
        }
      }
    },

    // 获取服务分组
    async groups() {
      const res = await getGroupSelect({
      })
      this.groupList = res.data
    },
    async selectList() {
      const res = await getserverClassify()
      this.classifyList = res.data
    },
    changeParentClass() {
      this.classes = this.parentClasses.find(item => item.id === this.ruleForm.classifyParentId) && this.parentClasses.find(item => item.id === this.ruleForm.classifyParentId)['childs']
      this.ruleForm.classifyId = this.classes[0].id
    },
    changeParentClassadd() {
      this.classes = this.parentClasses.find(item => item.id === this.formInline.classifyParentId) && this.parentClasses.find(item => item.id === this.formInline.classifyParentId)['childs']
      this.formInline.classifyId = this.classes[0].id
      console.log('this.classes', this.classes)
      console.log('this.formInline.classifyId',this.formInline.classifyId)
    }
  }
}
</script>
<style lang='scss' scoped>
#allmap{
  height: 450px;
  width: 100%;
  margin: 10px 0;
}
.map {
  width: 100%;
  height: 300px;
}

::v-deep .location .el-input__inner {
  height: 200px !important;
}

::v-deep .form-item-sub .el-input__inner {
  display: inline-block;
  text-align: left;
}

::v-deep .form-item .el-form-item__label {
  width: 110px !important;
  /* 设置标签的宽度 */
  display: inline-block;
  text-align: left;
}

::v-deep .el-input__inner{
  height: 30px;
}
::v-deep .el-form-item{
    margin-bottom: 5px;
}

.tableBox {
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing:border-box;
  margin-top: 10px;
}

.two-column-tabs {
  display: flex;
  justify-content: space-between;
  /* 根据需要调整内容间距 */
  width: 1150px;
  // background-color: aqua;
  /* 根据实际情况可能需要设置最大宽度、溢出处理等 */
}

.tab-content-column1 {
  display: inline-block;
  vertical-align: top;
  /* 确保垂直对齐 */
  width: 350px;
  /* 各占一半宽度 */
  box-sizing: border-box;
  /* 包括padding和border在内计算宽度 */
  font-size: 16px;
  margin-right: 100px;
  /* 重置字体大小 */
  // background-color: rgb(203, 121, 14);
}

.tab-content-column2 {
  display: inline-block;
  vertical-align: top;
  /* 确保垂直对齐 */
  width: 350px;
  /* 各占一半宽度 */
  box-sizing: border-box;
  /* 包括padding和border在内计算宽度 */
  font-size: 16px;
  /* 重置字体大小 */
  // background-color: azure;
  /* 其他样式，如 padding、margin、border 等 */
}

.map-location-selection {
  position: relative;
  height: 300px;
}

.map-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.map-info span {
  display: block;
  margin-bottom: 5px;
}

@import url("../../../styles/elDialog.scss");

.pending {
  padding: 30px;
}

.fenye {
  margin-top: 20px;
}

.elipt {
  width: 50%;
}

.elspan {
  margin-left: 10px;
}
</style>
