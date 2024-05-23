<template>
  <div class="login">
    <!-- 登录 -->
    <div v-if="getPassword" class="loginBox">
      <div v-if="getPassword" class="topText">协作网运营平台</div>
      <div class="rightBox">
        <div class="tabTouch">
          <div
            v-for="(item, index) in activeList"
            :key="index"
            :class="[tabIndex != index ? 'touchOne' : 'touchTwo']"
            @click="touchTab(index)"
          >{{ item.name }}</div>
        </div>
        <!-- 账户密码登录 -->
        <div v-if="!tabIndex">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            label-position="left"
            label-width="0px"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                type="text"
                maxlength="11"
                auto-complete="off"
                placeholder="请输入账户"
                class="iptHeight"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                class="iptHeight"
                auto-complete="off"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <div class="boxBottom">
              <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">自动登录</el-checkbox>
              <div class="forgetPsd" @click="runForgetPassord">忘记密码</div>
            </div>

            <el-form-item style="width: 100%">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width: 100%; border-radius: 20px"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 找回密码 -->
    <div v-else class="loginBoxs">
      <div class="topback">找回密码</div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="margin-left: 25px">找回密码</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="
              {
                getPassword = true;
              }
            "
          >返回登录</el-button>
          <div class="cardBox">
            <el-form
              ref="forgotForm"
              :model="forgotPasswordForm"
              :rules="forgotPasswordRules"
              label-position="left"
              label-width="0px"
              class="login-form"
            >
              <el-form-item prop="phone">
                <el-input
                  v-model="forgotPasswordForm.phone"
                  type="text"
                  maxlength="11"
                  auto-complete="off"
                  placeholder="请输入手机号码"
                  class="iptHeight"
                />
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="forgotPasswordForm.code"
                  type="text"
                  class="iptHeight"
                  auto-complete="off"
                  style="width: 63%"
                  placeholder="请输入验证码"
                />
                <div class="login-code">
                  <el-button
                    class="codeBtn"
                    type="primary"
                    :loading="codeloading"
                    @click="getCode(forgotPasswordForm.phone)"
                  >
                    <span v-if="!codeloading">获取验证码</span>
                    <span v-else>{{ count }} s</span>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="forgotPasswordForm.password"
                  type="password"
                  maxlength="20"
                  auto-complete="off"
                  placeholder="请输入密码"
                  class="iptHeight"
                />
              </el-form-item>
              <el-form-item prop="newPassword">
                <el-input
                  v-model="forgotPasswordForm.newPassword"
                  type="password"
                  maxlength="20"
                  auto-complete="off"
                  placeholder="请再次输入密码"
                  class="iptHeight"
                />
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  style="width: 100%; border-radius: 20px"
                  @click.native.prevent="resetPassword"
                >
                  <span v-if="!loading">重 置 密 码</span>
                  <span v-else>重 置 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
    <!--  底部  -->
    <div class="login-footer">© 协作网</div>
  </div>
</template>

<script>
import { getCode } from '@/api/user'
const TIME_COUNT = 60 // 更改倒计时时间
export default {
  name: 'Login',
  data() {
    var validateNewPassword = (rule, value, callback) => {
      if (value !== this.forgotPasswordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      anthorForm: {
        username: '',
        code: '',
        rememberMe: false
      },
      forgotPasswordForm: {
        phone: '',
        code: '',
        password: '',
        newPassword: ''
      },
      tabIndex: 0,
      activeList: [
        // {
        //   name: '账户密码登录',
        //   id: 0
        // }
        // {
        //   name: '手机号码登录',
        //   id: 1
        // }
      ],
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ]
      },
      anthorRules: {
        username: [
          { required: true, trigger: 'blur', message: '手机号不能为空' }
        ],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      forgotPasswordRules: {
        phone: [
          { required: true, trigger: 'blur', message: '手机号不能为空' }
        ],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          {
            pattern: /^[~!@#$%^&*\-+=_.0-9a-zA-Z]{8,16}$/,
            message: '8-16密码数字英文混合'
          }
        ],
        newPassword: [
          { required: true, trigger: 'blur', message: '请再次输入密码' },
          { validator: validateNewPassword, trigger: 'blur' }
        ]
      },
      loading: false,
      codeloading: false,
      count: '',
      timer: null,
      redirect: undefined,
      getPassword: true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 点击tab
    touchTab(index) {
      console.log(index)
      this.tabIndex = index
    },
    // 获取验证码
    async getCode(phone) {
      console.log(phone)
      if (phone === '' || phone === undefined) {
        this.$message.error('请填写电话号码')
        return
      }
      if (/^1[34578]\d{9}$/.test(phone) === false) {
        this.$message.error('请填写正确手机号')
        return false
      }
      if (!this.timer) {
        this.codeloading = true
        this.count = TIME_COUNT
        this.show = false
        const res = await getCode({ phone })
        if (res.code === '') {
          this.$message({
            message: '发送成功，请注意查看手机短信',
            type: 'success'
          })
        }
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
            this.codeloading = false
          }
        }, 1000)
      }
    },
    // 忘记密码
    runForgetPassord() {
      this.getPassword = false
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 账户登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ name: 'businessList' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 手机号码
    anhandleLogin() {
      console.log(this.anthorForm)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.anthorForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetPassword() {
      this.$refs.forgotForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/resetPassword', this.forgotPasswordForm)
            .then(() => {
              this.$message({
                message: '重置成功',
                type: 'success'
              })
              this.getPassword = true
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.topText {
  font-size: 40px;
  font-weight: bold;
  color: #050505;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: -10%;
  // position: absolute;
  // top: -70px;
  // left: 40px;
}
.login {
  // height: 100%;
  // background-size: 1550px, 650px;
  height: 100vh; /* 设置容器高度为视口高度 */
  width: 100vw; /* 设置容器宽度为视口宽度 */
  background-size: cover; /* 图片等比例缩放以填充容器 */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../../assets/images/bk1.jpg');
}
.loginBox {
  width: 360px !important;
  height: 280px;
  background: #ffffff;
  border-radius: 10px;
  position: absolute;
  top: 40%;
  left: 78%;
  transform: translate(-50%, -50%);
  padding-top: 70px;
}
.topback {
  width: 1000px;
  height: 100px;
  background: #3a68f2;
  border-radius: 10px 10px 0px 0px;
  font-size: 30px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginBoxs {
  width: 1000px;
  height: 600px;
}
.rightBox {
  // top: 10%;
  margin: auto;
  h2 {
    text-align: center;
    // font-size: 40px;
    font-weight: bold;
    color: #ffffff;
  }
}
.tabTouch {
  top: 30px;
  display: flex;
  justify-content: space-around;
  align-content: center;
  width: 360px;
  margin-left: 8px;
}
.touchOne {
  color: #666666;
  padding: 20px;
}
.touchTwo {
  border-bottom: 1px solid #1890ff;
  padding: 20px;
  color: #1890ff;
}
.boxBottom {
  display: flex;
  justify-content: space-between;
  .forgetPsd {
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.iptHeight {
  height: 54px !important;
  input {
    height: 54px !important;
  }
  span {
    display: flex;
    align-items: center;
  }
  .input-icon {
    width: 20px;
    height: 20px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  float: right;
  .codeBtn {
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    background: #eeeeee;
    color: #666666;
    border: none;
  }
  img {
    vertical-align: middle;
  }
}
.box-card {
  width: 100%;
  height: 100%;
  .clearfix {
    width: 50%;
    margin: 10% auto;
  }
}
.login-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
}
</style>
