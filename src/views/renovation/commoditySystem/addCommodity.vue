<template>
  <div>
    <el-card class="box-card">
      <span class="addTitle">商品详情</span>
      <el-button type="success" class="btnList" @click="back">关闭</el-button>
    </el-card>
    <el-card class="box-card">
      <label>商品详情</label>
      <div class="GoodBox">
        <el-row class="detail-box">
          <el-col :span="12">
            <div>商品名称：{{ productItem.productName }}</div>
            <div>商品卖点：{{ productItem.productBrief }}</div>
            <div>
              商品图片：
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
            </div>
            <div>商品款式：</div>
          </el-col>
          <el-col :span="12">
            <div>官方分类：{{ productItem.classifyName }}</div>
            <div>商家分组：{{ productItem.shopGroupName }}</div>
            <div>商家名称：{{ productItem.shopName }}</div>
            <div>
              商品状态：
              <span v-if="productItem.shelveState == 0">已下架 </span>
              <span v-if="productItem.shelveState == 1">已上架</span>
              <span v-if="productItem.shelveState == 2">待审核</span>
              <span v-if="productItem.shelveState == 3">审核失败</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-box">
          <el-col :span="24">
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
                  {{
                    scope.row.skuAttrCodeDTOList &&
                    scope.row.skuAttrCodeDTOList[index]
                      | attrValueFilter(productItem.skuAttrList)
                  }}
                </template>
              </el-table-column>
              <el-table-column label="售价">
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
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card">
      <label>商品简介</label>
      <!-- <Tinymce
        ref="content"
        v-model="productItem.productText"
        class="tinymce-wrap"
        :height="180"
      /> -->
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
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { getProductById } from "@/api/commodity";
import { uploadUrl } from "@/utils/request";
import StyleInformation from "./addComponent";
export default {
  name: "",
  components: {
    Tinymce,
    StyleInformation,
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      productItem: {},
    };
  },
  filters: {
    attrValueFilter(map, list) {
      const hasChilds =
        list &&
        list.filter((skuAttr) => {
          const hasChild = skuAttr.values.some((attr) => {
            return attr.skuValue;
          });
          return skuAttr.skuName && hasChild;
        });
      if (!map) {
        return "";
      }
      const { code, valueCode } = map;
      let codeStr = "";
      hasChilds.map((item) => {
        const { values } = item;
        values &&
          values.some((attr) => {
            const isSome = item.code === code && attr.valueCode === valueCode;
            if (isSome) {
              codeStr = attr.skuValue;
            }
            return isSome;
          });
      });
      return codeStr;
    },
  },
  computed: {
    productId() {
      return this.$route.params.productId;
    },
    skuAttrName() {
      return (
        this.productItem.skuAttrList &&
        this.productItem.skuAttrList.filter((skuAttr) => {
          const hasChilds = skuAttr.values.some((attr) => {
            return attr.skuValue;
          });
          return skuAttr.skuName && hasChilds;
        })
      );
    },
  },
  mounted() {
    if (this.productId) {
      this.details();
    }
  },
  methods: {
    handlePictureCardPreview(item) {
      this.dialogImageUrl = item.imgPath;
      this.dialogVisible = true;
    },

    // 返回
    back() {
      this.$router.go(-1);
    },
    // 获取详情
    async details() {
      const res = await getProductById({ productId: this.productId });
      console.log(res);
      this.productItem = res.data;
      this.productItem.skuAttrList = res.data.names;
      this.productItem.skuAttrList.forEach((item) => {
        var data = {};
        var arr = Object.keys(data);
        if (arr.length === 0) {
          item.needImg = false;
        }
      });
      console.log(this.productItem.skuAttrList, "skuAttrList");
      this.productItem.skuList = this.productItem.skus;
    },
  },
};
</script>

<style scoped lang='scss'>
@import url("../../../styles/elDialog.scss");
.box-card {
  margin: 20px;
}
.btnList {
  float: right;
  padding: 3px 0;
  width: 100px;
  height: 48px;
  border-radius: 4px;
  margin-right: 30px;
}
.addTitle {
  font-size: 24px;
  color: #333333;
  line-height: 50px;
}

.GoodBox {
  padding: 40px;
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
</style>
