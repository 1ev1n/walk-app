<template>
  <div class="frame">
    <h1 class="title">Walky</h1>
    <button @click="goToProfile" class="login-button">Войти</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToProfile = () => {
  router.push('/profile');
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.frame {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-family: 'Cookie', cursive;
  font-style: normal;
  font-weight: 400;
  font-size: 68px;
  line-height: 75px;
  color: #000000;
}

.login-button {
  margin-top: 300px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 41px;
  color: #461818;
  text-decoration: none;
  text-align: center;
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>
