<template>
  <li class="dropdown user user-menu">
    <a >
      <!-- The user image in the navbar-->
      <img :src="user.avatar" class="user-image" alt="User Image">
      <!-- hidden-xs hides the username on small devices so only the image appears. -->
      <span class="hidden-xs">{{user.displayName}}</span>
    </a>

  </li>
</template>

<script>
export default {
  name: 'UserMenu',
  props: ['user']
}
</script>
