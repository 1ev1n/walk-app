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
    font-family: 'Montserrat', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 38px;
    line-height: 45px;
    color: white;
    text-decoration: none;
    text-align: center;
    background: linear-gradient(to right, #F35B04, #F18701, #F7B801);
    border: none;
    cursor: pointer;
    border-radius: 50px;
    padding: 15px 30px;
}
</style>
