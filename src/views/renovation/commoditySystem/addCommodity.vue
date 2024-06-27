<template>
  <div>
    <el-card class="box-card" body-style="height: 50px; padding-top: 2px; padding-bottom: 2px;">
      <span class="addTitle">服务详情</span>
      <el-button type="success" class="btnList" @click="back">关闭</el-button>
    </el-card>
    <!-- <div class="box-card">
      <div></div>
    </div> -->
    <el-card class="box-card">
      <label>服务详情</label>
      <div class="GoodBox">
        <el-row class="detail-box">
          <el-col :span="12">
            <div class="row">
              <div class="label">服务名称：</div>
              {{ productItem.productName }}
            </div>
            <div class="row">
              <div class="label">服务简介：</div>
              {{ productItem.productBrief }}
            </div>
            <!-- <div >
              商品标签：
              <el-tag
                v-for="(item, index) in productItem.labels"
                :key="index"
                :color="item.color"
                style="margin-left: 2px; margin-right: 2px;"
              >
                <span style="color: azure;">{{ item.label }}</span>
              </el-tag>
            </div> -->
            <!-- <div>
              服务图片：
              <div>
                <img
                  class="proImage"
                  v-for="(item, index) in productItem.images"
                  :key="index"
                  :src="item.imgPath"
                  alt=""
                  @click="handlePictureCardPreview(item)"
                />
              </div>
            </div> -->
            <div class="row">
              <div class="label">服务类型：</div>
              {{ productItem.productType }}
            </div>
            <div class="row">
              <div class="label">服务大类：</div>
              {{ productItem.classifyParent }}
            </div>
            <div class="row">
              <div class="label">服务小类：</div>
              {{ productItem.classify }}
            </div>
            <!-- <el-form-item label="服务大类">
              <el-select v-model="productItem.classifyParentId" placeholder="请选择服务大类">
                <el-option
                  v-for="(item,index) in classifyList.find(item => item.categoryName === '养老服务')['childs']"
                  :key="index"
                  :label="item.categoryName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="服务小类">
              <el-select v-model="productItem.classifyId" placeholder="请选择服务小类" :disabled="!productItem.classifyParentId || productItem.classifyParentId === ''">
                <el-option
                  v-for="(item,index) in classifyList.find(item => item.categoryName === '养老服务')['childs'].find(item => item.id === productItem.classifyParentId) && classifyList.find(item => item.categoryName === '养老服务')['childs'].find(item => item.id === productItem.classifyParentId)['childs']"
                  :key="index"
                  :label="item.categoryName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <!-- <div>服务分类：{{ productItem.classifyName }}</div> -->
          </el-col>
          <el-col :span="12">
            <!-- <div>商家分组：{{ productItem.shopGroupName }}</div> -->
            <div class="row">
              <div class="label">服务提供商：</div>
              {{ productItem.shopName }}
            </div>
            <div class="row">
              <div class="label">是否推荐：</div>
              <el-radio-group v-model="productItem.isRecommended" :disabled="true">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
            <div class="row">
              <div class="label">物流：</div>
              <el-radio-group v-model="productItem.ifLogistics" :disabled="true">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
            <div class="row">
              <div class="label">服务状态：</div>
              <span v-if="productItem.shelveState == 0">已下架 </span>
              <span v-if="productItem.shelveState == 1">已上架</span>
              <span v-if="productItem.shelveState == 2">待审核</span>
              <span v-if="productItem.shelveState == 3">审核失败</span>
            </div>
            <div class="row">
              <div class="label">超卖：</div>
              <el-radio-group v-model="productItem.ifOversold" :disabled="true">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-box">
          <el-row v-show="productItem.additionalInfoFlag">
            <el-col :span="12">
              <div class="row">
                <div class="label">机构星级：</div>
                {{ productItem.starRating }}
              </div>
            </el-col>
            <el-col :span="12">
              <div class="row">
                <div class="label">机构面积：</div>
                {{ productItem.area }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <div style="overflow-wrap: break-word;">
              <div class="label">服务介绍：</div>
              <div style="background-color: whitesmoke; border-radius: 4px; margin-right: 20px; padding-left: 10px; padding-right: 10px;" v-html="productItem.productText" />
            </div>
            <div v-show="productItem.images.length !== 0">
              <div class="label">服务图片：</div>
              <div>
                <img
                  v-for="(item, index) in productItem.images"
                  :key="index"
                  class="proImage"
                  :src="item.imgPath"
                  alt=""
                  @click="handlePictureCardPreview(item)"
                >
              </div>
            </div>
          </el-row>
          <el-col :span="24">
            <div class="label">服务规格：</div>
            <el-table
              :data="productItem.skuList"
              style="width: 100%"
              :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            >
              <el-table-column
                v-for="(skuAttr, index) in skuAttrName"
                :key="index"
                :label="skuAttr.skuName"
              >
                <template slot-scope="scope">
                  <!-- {{
                    scope.row.skuAttrCodeDTOList &&
                    scope.row.skuAttrCodeDTOList[index]
                      | attrValueFilter(productItem.skuAttrList)
                  }} -->
                  <span>{{ scope.row.skuValue }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="售价">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.price"
                    type="number"
                    disabled
                    oninput="value=value.replace(/-/, '')"
                  />
                </template>
              </el-table-column>
              <el-table-column label="原价">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.originalPrice"
                    type="number"
                    disabled
                    oninput="value=value.replace(/-/, '')"
                  />
                </template>
              </el-table-column>
              <el-table-column label="库存">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.stockNumber"
                    type="number"
                    disabled
                    oninput="value=value.replace(/[^\d]/g,'')"
                  />
                </template>
              </el-table-column>
              <el-table-column label="重量(KG)">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.weight"
                    type="number"
                    disabled
                    oninput="value=value.replace(/-/, '')"
                  />
                </template>
              </el-table-column>
              <el-table-column label="SKU">
                <template slot-scope="scope">
                  <el-input disabled v-model="scope.row.sku" />
                </template>
              </el-table-column> -->
              <el-table-column label="服务价格">
                <template slot-scope="scope">
                  <span>{{ scope.row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column label="原价格">
                <template slot-scope="scope">
                  <span>{{ scope.row.originalPrice }}</span>
                </template>
              </el-table-column>
              <el-table-column label="成本价格">
                <template slot-scope="scope">
                  <span>{{ scope.row.stockNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column label="服务介绍">
                <template slot-scope="scope">
                  <span>{{ scope.row.sku }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- <el-card class="box-card">
      <label>服务简介</label>
      <Tinymce
        ref="content"
        v-model="productItem.productText"
        class="tinymce-wrap"
        :height="180"
      />
      <br/>
      <br/>
      <div v-html="productItem.productText"></div>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      class="check-image-dialog"
      title="查看图片"
      center="center"
    >
      <div class="img">
        <img width="80%" height="80%" :src="dialogImageUrl" alt />
      </div>
    </el-dialog> -->
  </div>
</template>

<script>

import Tinymce from '@/components/Tinymce'
import {
  getClassify,
  getProductById
} from '@/api/commodity'
// import { uploadUrl } from '@/utils/request'
import StyleInformation from './addComponent'
// import { selectCanvasCustomList } from '@/api/renovation'
export default {
  name: '',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Tinymce,
    // eslint-disable-next-line vue/no-unused-components
    StyleInformation
  },
  filters: {
    attrValueFilter(map, list) {
      const hasChilds =
        list &&
        list.filter((skuAttr) => {
          const hasChild = skuAttr.values.some((attr) => {
            return attr.skuValue
          })
          return skuAttr.skuName && hasChild
        })
      if (!map) {
        return ''
      }
      const { code, valueCode } = map
      let codeStr = ''
      hasChilds.map((item) => {
        const { values } = item
        values &&
          values.some((attr) => {
            const isSome = item.code === code && attr.valueCode === valueCode
            if (isSome) {
              codeStr = attr.skuValue
            }
            return isSome
          })
      })
      return codeStr
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      productItem: {},
      colorList: [
        '#F6C600',
        '#EF7F00',
        '#F29596',
        '#EC453C',
        '#8A43E1',
        '#87CB4C',
        '#43A79E',
        '#73B8EE',
        '#3C80E8',
        '#21317B'
      ],
      classifyList: []
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    },
    skuAttrName() {
      console.log('skuAttrList', this.productItem.skuAttrList)
      return this.productItem.skuAttrList
      // return (
      //   this.productItem.skuAttrList &&
      //   this.productItem.skuAttrList.filter((skuAttr) => {
      //     const hasChilds = skuAttr.values.some((attr) => {
      //       return attr.skuValue;
      //     });
      //     return skuAttr.skuName && hasChilds;
      //   })
      // );
    }
  },
  mounted() {
    this.selectList().then(() => {
      if (this.productId) {
        this.details()
      }
    })
  },
  methods: {
    handlePictureCardPreview(item) {
      this.dialogImageUrl = item.imgPath
      this.dialogVisible = true
    },

    // 返回
    back() {
      this.$router.go(-1)
    },
    // 获取详情
    async details() {
      const res = await getProductById({ productId: this.productId })
      console.log(res)
      this.productItem = res.data
      this.productItem.images = this.productItem.images.filter(item => item.imgPath !== '').map(item => {
        item.imgPath = item.imgPath.replace('http://58.59.92.190:17190', process.env.VUE_APP_DOMAIN_PREFIX).replace('local', 'file')
        return item
      })
      console.log(this.productItem)
      this.productItem.skuAttrList = res.data.names
      this.productItem.skuAttrList.forEach((item) => {
        var data = {}
        var arr = Object.keys(data)
        if (arr.length === 0) {
          item.needImg = false
        }
      })
      console.log(this.productItem.skuAttrList, 'skuAttrList')
      this.productItem.skuList = this.productItem.skus
      for (let i = 0; i < this.productItem.skuList.length; i++) {
        this.productItem.skuList[i]['skuValue'] = this.productItem.skuAttrList[0]['values'][i]['skuValue']
      }
      this.productItem.skuAttrList[0]['skuName'] = '服务规格'
      this.productItem.labels = this.productItem.productBrief === '' ? [] : this.productItem.productBrief.split(',').map(item => ({
        label: item,
        color: ''
      }))
      this.productItem.additionalInfoFlag = false
      for (const parentCatefory of this.classifyList) {
        for (const category of parentCatefory['childs']) {
          for (const subCategory of category['childs']) {
            if (subCategory['id'] === this.productItem.classifyId) {
              this.productItem.classifyParent = category['categoryName']
              this.productItem.classify = subCategory['categoryName']
              if (category['categoryName'] === '机构服务' || category['categoryName'] === '居家上门') {
                this.productItem.additionalInfoFlag = true
              }
            }
          }
        }
      }
      // for (const category of this.classifyList.find(item => item.categoryName === '养老服务')['childs']) {
      //   for (const subCategory of category["childs"]) {
      //     if (subCategory["id"] === this.form.classifyId) {
      //       this.form.classifyParentId = category["id"];
      //     }
      //   }
      // }
      // 标签上色
      let index = Math.floor(Math.random() * this.colorList.length)
      for (const item of this.productItem.labels) {
        if (index === this.colorList.length) {
          index = 0
        }
        item.color = this.colorList[index++]
      }
    },
    async selectList() {
      const res = await getClassify()
      this.classifyList = res.data
    }
  }
}
</script>

<style scoped lang='scss'>
@import url("../../../styles/elDialog.scss");
.box-card {
  margin: 18px;
}
.btnList {
  float: right;
  padding: 3px 0;
  width: 100px;
  height: 36px;
  border-radius: 4px;
  margin-right: 30px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.addTitle {
  font-size: 20px;
  color: #333333;
  line-height: 50px;
}

.GoodBox {
  padding: 20px;
  .detail-box {
    div {
      line-height: 60px;
      .proImage {
        margin-right: 20px;
        width: 80px;
        height: 80px;
      }
    }
  }
}
.tinymce-wrap {
  margin-top: 10px;
}
.check-image-dialog {
  margin-top: -100px;
  text-align: center;
  .img {
    text-align: center;
  }
}
::v-deep .el-table .el-table__header-wrapper {
  padding-top: 0;
  padding-bottom: 0;
  height: 60px;
}

::v-deep .el-table .el-table__header-wrapper > table {
  padding-top: 0;
  padding-bottom: 0;
  height: 60px;
}

::v-deep .el-table .el-table__header-wrapper > table > thead > tr {
  padding-top: 0;
  padding-bottom: 0;
  height: 60px;
}

::v-deep .el-table .el-table__header-wrapper > table > thead > tr > th {
  padding-top: 0;
  padding-bottom: 0;
  height: 60px;
}

::v-deep .el-table .el-table__header-wrapper > table > colgroup > col {
  padding-top: 0;
  padding-bottom: 0;
  height: 60px;
}

.row {
  display: flex;
}

.label {
  margin-left: 20px;
  box-sizing: border-box;
  display: inline-block;
  text-align: left;
}
</style>
