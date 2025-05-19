const express = require("express");
const cors = require("cors");

const app = express();

// Настройка CORS (разрешаем подключения из фронтенда)
app.use(cors());

// Статика (если нужно, например, для тестовой HTML-страницы)
app.use(express.static("public"));

// Пример HTTP-ендпоинта
app.get("/healthcheck", (req, res) => {
  res.status(200).send("Сервер работает!");
});

module.exports = app;