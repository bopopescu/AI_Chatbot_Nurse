<template>
  <header class="main-header">
    <span class="logo-mini">
      <a href="/"><img src="/static/img/logo.png" style="width:80px; height: 55px; margin-left: 70px; background-color: #202d33 !important;" alt="Logo" class="img-responsive center-block logo"></a>
    </span>
    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">

      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <notifications-menu></notifications-menu>
          <user-menu :user="user"></user-menu>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import NotificationsMenu from './NotificationsMenu'
import UserMenu from './UserMenu'

export default {
  name: 'DashHeader',
  components: {
    NotificationsMenu,
    UserMenu
  },
  props: ['user'],
  computed: {
    ...mapState([
      'userInfo'
    ])
  }
}
</script>
