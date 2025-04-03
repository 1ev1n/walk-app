<template>
  <div class="route-edit">
    <h2>Создать маршрут</h2>
    <form @submit.prevent="saveRoute">
      <label>
        Название маршрута:
        <input v-model="route.name" type="text" required />
      </label>

      <label>
        Описание:
        <textarea v-model="route.description" required></textarea>
      </label>

      <label>
        Тип прогулки:
        <select v-model="route.type" required>
          <option value="пешая">Пешая</option>
          <option value="велосипедная">Велосипедная</option>
          <option value="авто">Авто</option>
        </select>
      </label>

      <label>
        Превью (URL):
        <input v-model="route.image_url" type="url" required />
      </label>

      <button type="submit">Сохранить</button>
      <button type="button" @click="$emit('close')">Отмена</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      route: {
        name: "",
        description: "",
        type: "",
        image_url: "",
      },
    };
  },
  methods: {
    saveRoute() {
      console.log("Сохранение маршрута:", this.route);
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.route-edit {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%; /* Задаем высоту примерно 3/5 */
  max-height: 60%; /* Максимальная высота */
  background: white;
  padding: 20px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Добавляем скроллинг, если контент не помещается */
}

h2 {
  margin-top: 0;
}

form {
  display: flex;
  flex-direction: column;
  height: 100%; /* Формируем форму по всей высоте */
  justify-content: space-between; /* Разделяем элементы по высоте */
}

input,
textarea,
select {
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 10px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

button:last-child {
  background: #d9534f;
}

button:last-child:hover {
  background: #c9302c;
}
</style>
