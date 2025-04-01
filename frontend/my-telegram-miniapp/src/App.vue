// frontend/src/App.vue
<script setup>
import { onMounted, provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios'; // Импортируем axios

const route = useRoute();
const tg = window.Telegram.WebApp;
const userData = ref(null); //  Для хранения данных пользователя

onMounted(async () => {
  tg.ready();

  // Получаем initData и hash
  const initData = tg.initData;
  const hash = new URLSearchParams(tg.initData).get('hash'); // Извлекаем hash

  console.log('initData:', initData);
  console.log('hash:', hash);

  //  Отправляем данные на backend для верификации
  try {
    const response = await api.post('/verify', {  //  Создайте endpoint /verify на бэкенде
        user: initData,
        hash: hash
    });

    if (response.status === 200) {
        userData.value = response.data.user;  //  Сохраняем данные пользователя после верификации
        console.log('Аутентификация успешна', userData.value);
    } else {
      console.error('Ошибка верификации:', response.status, response.data);
    }

  } catch (error) {
    console.error('Ошибка отправки данных для верификации:', error);
  }
});

provide('tg', tg); //  Предоставляем Telegram WebApp API всем компонентам
provide('userData', userData); // Предоставляем данные пользователя всем компонентам

</script>

<template>
  <router-view />
</template>