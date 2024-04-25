<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="isCollapse" :collapse="isCollapse" />
    <logo v-else :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="touchSidbar"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          class="tabLink"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { adminBuild } from '@/api/user'
import { getUserId, getToken } from '@/utils/auth'
export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      routes: []
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    // routes() {
    //   // return this.$router.options.routes;
    //   return JSON.parse(localStorage.getItem("permissionList"));
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    adminBuild({ platformUserId: getUserId() }).then(res => {
      this.routes = res.data
      // 添加画布菜单
      this.routes.forEach(item => {
        if (item.path.indexOf('canvas-config') !== -1) {
          item.path = item.path + getToken()
        }
      })
    })
  },
  methods: {
    touchSidbar(arr) {
      let res = []
      this.routes.forEach(element => {
        const t = element
        if (element.path === arr) {
          res = element
        } else {
          t.children.forEach(e => {
            if (e.path === arr) {
              res = e
            }
          })
        }
      })
    }
  }
}
</script>
