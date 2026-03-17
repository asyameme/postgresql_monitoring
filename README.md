# PostgreSQL Monitoring Tutorial

Интерактивный туториал по мониторингу PostgreSQL, показывающий путь от базовых средств ОС до глубокой диагностики планов выполнения.

## 📋 О проекте

Это образовательное приложение, которое структурированно представляет 5 уровней мониторинга PostgreSQL — от системных утилит операционной системы до детального анализа планов выполнения запросов. Каждый уровень включает теорию, визуальные примеры, практические задания с SQL-кодом и викторину для самопроверки.

## 🚀 Live демо

**Посмотреть онлайн:** https://asyameme.github.io/postgresql_monitoring/

## 🛠️ Технологии

- **React 18** — UI библиотека с функциональными компонентами и хуками
- **TypeScript** — строгая типизация для надёжности кода
- **Vite** — быстрый сборщик и dev сервер
- **Tailwind CSS** — утилитарные CSS классы для стилизации

## 📁 Структура проекта

```
├── src/
│   ├── components/          # React компоненты
│   │   ├── ProgressRings.tsx    # Визуализация прогресса по уровням
│   │   └── QuizBlock.tsx         # Компонент викторины с пояснениями
│   ├── data/               # Данные уровней
│   │   └── levels.ts            # LEVELS и TABS — контент туториала
│   ├── types/              # TypeScript типы
│   │   └── index.ts             # Интерфейсы: Level, QuizOption, Tool, Metric
│   ├── styles/             # Стили
│   │   └── index.css            # Tailwind + кастомные анимации
│   ├── App.tsx             # Главный компонент приложения
│   ├── main.tsx            # Точка входа
│   └── vite-env.d.ts       # Типы для Vite и CSS модулей
├── .github/workflows/      # GitHub Actions
│   └── deploy.yml          # Автоматический деплой на GitHub Pages
├── index.html              # HTML шаблон для Vite
├── package.json            # Зависимости и скрипты
├── tsconfig.json           # Конфигурация TypeScript
├── vite.config.ts          # Конфигурация Vite
├── tailwind.config.js      # Конфигурация Tailwind CSS
└── eslint.config.js        # Конфигурация ESLint
```

## 📦 Установка и запуск

### Требования

- [Node.js](https://nodejs.org/) версии 18 или выше

### Локальный запуск

```bash
# Клонировать репозиторий
git clone https://github.com/asyameme/postgresql_monitoring.git
cd postgresql_monitoring

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в директории `dist/`

### Предпросмотр сборки

```bash
npm run preview
```

## 📚 Уровни мониторинга

Приложение состоит из 5 уровней:

| Уровень | Тема | Инструменты |
|--------|------|-------------|
| **1** | Средства мониторинга ОС | top, htop, vmstat, iostat, ss |
| **2** | Внешние системы мониторинга | Prometheus, Grafana, postgres_exporter |
| **3** | Встроенные средства PostgreSQL | pg_stat_activity, pg_stat_database, pg_locks |
| **4** | Расширения и плагины | pg_stat_statements, auto_explain, pg_buffercache |
| **5** | Внутренняя телеметрия | EXPLAIN, BUFFERS, WAL, wait events |

Каждый уровень содержит:
- 📖 **Теория** — описание уровня и его роли в диагностике
- 👁️ **Визуальный блок** — схемы, таблицы, примеры вывода команд
- 💻 **Практика** — SQL-запросы с объяснениями
- ✅ **Викторина** — вопросы для самопроверки с пояснениями к каждому варианту ответа

## 🌐 Деплой на GitHub Pages

Проект автоматически деплоится на GitHub Pages при каждом push в ветку `main`.

### Первичная настройка (один раз)

1. Открой репозиторий на GitHub
2. Перейди в **Settings** → **Pages**
3. В разделе **Build and deployment** → **Source** выбери **GitHub Actions**

### Деплой изменений

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Action автоматически соберёт и задеплоит проект.

**Ссылка на сайт:**
```
https://[username].github.io/postgresql_monitoring/
```

## 🧪 Скрипты package.json

```bash
npm run dev      # Режим разработки (localhost:5173)
npm run build    # Сборка для продакшена
npm run preview  # Предпросмотр сборки
npm run lint     # Проверка кода ESLint
```

## 📖 Что вы узнаете

После прохождения туториала вы сможете:

- 🔍 Диагностировать проблемы PostgreSQL на уровне ОС
- 📊 Настраивать Prometheus + Grafana для мониторинга
- 🔧 Использовать системные представления PostgreSQL
- 🔎 Анализировать статистику через pg_stat_statements
- 📈 Читать планы запросов (EXPLAIN) и находить узкие места

## 📝 Лицензия

MIT

## 👤 Автор

[asyameme](https://github.com/asyameme)
