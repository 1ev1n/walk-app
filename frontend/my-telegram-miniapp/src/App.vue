<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

header {
  background-color: #000;
  color: #fff;
  padding: 10px;
  text-align: center;
}

main {
  flex: 1;
  padding: 20px;
}
</style>
