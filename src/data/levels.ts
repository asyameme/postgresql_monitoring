import { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Средства мониторинга операционной системы',
    subtitle: 'top, htop, vmstat, iostat, ss',
    accent: 'from-slate-900 to-slate-700',
    border: 'border-slate-300',
    theory:
      'Это базовый уровень диагностики, на котором PostgreSQL рассматривается как обычный процесс операционной системы. Здесь анализируют загрузку CPU, использование оперативной памяти, обращение к swap, интенсивность дисковых операций и сетевую активность. Такой подход позволяет быстро отделить проблемы инфраструктуры от проблем самой СУБД. Если сервер перегружен по CPU, упирается в диск или испытывает дефицит памяти, даже идеально написанные SQL-запросы будут работать медленно.',
    note:
      'Swap — это часть диска, которую операционная система использует как «запасную память», когда оперативная память (RAM) заканчивается.',
    tools: [
      { name: 'top / htop', desc: 'Показывают процессы PostgreSQL, загрузку CPU и потребление памяти.' },
      { name: 'vmstat', desc: 'Помогает увидеть очереди на CPU, swapping и общее состояние памяти.' },
      { name: 'iostat -xz 1', desc: 'Ключевой инструмент для поиска дисковых узких мест: await, util, r/s, w/s.' },
      { name: 'ss -tpn', desc: 'Показывает сетевые соединения и помогает заметить всплески клиентской активности.' }
    ],
    metrics: [
      { name: 'CPU usage', desc: 'Показывает, насколько активно процессор занят обработкой запросов и фоновых задач PostgreSQL.' },
      { name: 'Load average', desc: 'Отражает среднее число процессов, ожидающих CPU или ресурс, и помогает заметить перегрузку сервера.' },
      { name: 'RAM / swap', desc: 'Позволяет понять, хватает ли оперативной памяти и не начал ли сервер использовать swap.' },
      { name: 'I/O wait', desc: 'Показывает, сколько времени процессор простаивает в ожидании операций ввода-вывода.' },
      { name: 'Disk util%', desc: 'Характеризует степень занятости дисковой подсистемы.' },
      { name: 'Network sockets', desc: 'Помогает оценить количество сетевых соединений и активность клиентов.' }
    ],
    visualCards: [
      {
        title: 'Пример наблюдения за диском',
        body: 'Высокие await и util ≈ 100% обычно указывают, что база упирается в подсистему хранения.',
        code: `Device            r/s     w/s   rkB/s   wkB/s  await aqu-sz  %util
nvme0n1          12.0   180.0   512.0  8192.0  18.40   2.31  98.70`
      },
      {
        title: 'Пример вывода htop / top',
        body: 'Такой фрагмент помогает быстро заметить, какие процессы PostgreSQL сильнее всего нагружают CPU и память.',
        code: `PID   USER      CPU%   MEM%   COMMAND
1821  postgres  84.7   11.8   postgres: writer process
1822  postgres  71.3    9.6   postgres: client backend
1823  postgres  63.9    8.1   postgres: autovacuum worker
1824  postgres   4.2    1.3   postgres: walwriter`
      },
      {
        title: 'Типичные симптомы и что проверять',
        body: 'Если пользователи говорят, что база «тормозит», это можно быстро связать с метриками операционной системы.',
        code: `Симптом                              → Что проверить
Запросы стали медленными             → CPU usage, I/O wait, Disk util%
Сервер подвисает                     → Load average, RAM / swap
Соединения открываются с задержкой   → Network sockets, Load average
База резко «задумалась» под нагрузкой → RAM / swap, I/O wait`
      },
      {
        title: 'Ресурсы ОС и что смотреть',
        body: 'Эта мини-панель помогает быстро соотнести ресурс операционной системы с теми метриками, которые стоит проверить в первую очередь.',
        code: `CPU      → CPU usage, load average, процессы с высоким %CPU
RAM      → объём занятой памяти, swap, нехватка RAM
Disk     → iowait, await, Disk util%, чтение и запись
Network  → число соединений, активность клиентов, задержки подключения`
      },
      {
        title: 'Когда этот слой особенно полезен',
        body: 'Если пользователи жалуются на медленную БД, сначала проверьте: не закончилась ли память, не вырос ли load average, не упирается ли сервер в диск.'
      }
    ],
    practice: [
      {
        title: 'Проверка дисковой подсистемы',
        code: 'iostat -xz 1',
        explanation: 'Смотрите на await, aqu-sz и %util. Если задержка высокая и util близок к 100%, проблема может быть ниже уровня SQL.'
      },
      {
        title: 'Список процессов PostgreSQL',
        code: 'ps aux | grep postgres',
        explanation: 'Позволяет увидеть фоновые процессы, postmaster и активность backend-процессов.'
      },
      {
        title: 'Наблюдение за процессами в реальном времени',
        code: 'top -p $(pgrep -d"," postgres)',
        explanation: 'Показывает только процессы PostgreSQL и помогает быстро заметить, какой из них нагружает CPU сильнее всего.'
      },
      {
        title: 'Проверка памяти и swap',
        code: 'free -h',
        explanation: 'Позволяет быстро оценить объём свободной памяти и понять, используется ли swap.'
      },
      {
        title: 'Общая сводка по памяти и очередям CPU',
        code: 'vmstat 1',
        explanation: 'Полезна для наблюдения за нагрузкой на CPU, очередями процессов и активностью swap в динамике.'
      },
      {
        title: 'Сетевые соединения PostgreSQL',
        code: 'ss -tpn | grep 5432',
        explanation: 'Показывает активные TCP-соединения с PostgreSQL и помогает заметить всплеск подключений.'
      },
      {
        title: 'Занятое место на файловой системе',
        code: 'df -h',
        explanation: 'Нужно, чтобы проверить, не заканчивается ли место на разделе, где лежат данные PostgreSQL или WAL.'
      }
    ],
    interpretation: [
      'Высокий CPU без высокого I/O часто указывает на тяжёлые вычисления, сортировки или неэффективные планы запросов.',
      'Высокий iowait и util% по диску намекают на узкое место в хранилище или слишком частые последовательные чтения.',
      'Использование swap для сервера БД почти всегда тревожный сигнал.'
    ],
    quiz: [
      {
        q: 'Какая команда лучше всего подходит для быстрой диагностики задержек дисковой подсистемы?',
        options: [
          { text: 'htop', explanation: 'htop показывает процессы и загрузку CPU, но не даёт детальной статистики по диску.' },
          { text: 'iostat -xz 1', explanation: 'iostat показывает метрики чтения/записи (r/s, w/s), await (задержку), util (загрузку) — именно то, что нужно для анализа дисковых узких мест.' },
          { text: 'pwd', explanation: 'pwd просто показывает текущую директорию и не имеет отношения к диагностике диска.' },
          { text: 'whoami', explanation: 'whoami показывает имя текущего пользователя и не даёт никакой информации о дисковой подсистеме.' }
        ],
        correct: 1
      },
      {
        q: 'Что чаще всего означает высокий iowait на сервере с PostgreSQL?',
        options: [
          { text: 'Проблема с CSS', explanation: 'CSS относится к веб-интерфейсам и не связан с системными метриками như iowait.' },
          { text: 'Ожидание дисковых операций', explanation: 'iowait — это время, которое CPU проводит в ожидании завершения операций ввода-вывода. Высокий iowait означает, что процессор простаивает в ожидании диска.' },
          { text: 'Ошибка SQL-синтаксиса', explanation: 'Ошибки SQL вызовут ошибку запроса, но не повлияют на метрику iowait на уровне ОС.' },
          { text: 'Не работает сеть', explanation: 'Проблемы с сетью влияют на другие метрики (network delays), но не на iowait, который относится только к дисковым операциям.' }
        ],
        correct: 1
      },
      {
        q: 'Какая команда из практического блока помогает быстро проверить, используется ли swap?',
        options: [
          { text: 'free -h', explanation: 'free -h показывает использование RAM и swap. Если swap используется, значит оперативной памяти не хватает и сервер начал использовать диск как расширение памяти.' },
          { text: 'df -h', explanation: 'df -h показывает занятое место на файловых системах, но не показывает использование swap.' },
          { text: 'ps aux | grep postgres', explanation: 'Эта команда показывает процессы PostgreSQL, но не даёт информации об использовании swap.' },
          { text: 'ss -tpn | grep 5432', explanation: 'ss показывает сетевые соединения, но не связан с использованием swap.' }
        ],
        correct: 0
      }
    ]
  },
  {
    id: 2,
    title: 'Внешние системы мониторинга инфраструктуры',
    subtitle: 'Prometheus, Grafana, exporters, alerting',
    accent: 'from-blue-700 to-cyan-600',
    border: 'border-blue-200',
    theory:
      'На этом уровне используются внешние системы мониторинга, которые собирают метрики PostgreSQL и инфраструктуры в виде временных рядов. Они позволяют не только увидеть текущее состояние сервера, но и анализировать поведение базы во времени: замечать рост нагрузки, повторяющиеся пики, ухудшение отклика, накопление lag репликации и другие долгосрочные тенденции. В отличие от разовой ручной диагностики, такой мониторинг помогает строить дашборды, сравнивать интервалы работы и заранее настраивать алерты на опасные состояния. Это делает эксплуатацию PostgreSQL предсказуемой и снижает риск того, что проблема будет замечена слишком поздно.',
    note:
      'Lag репликации — это отставание реплики от основного сервера, то есть задержка между моментом записи данных на primary и их появлением на standby.',
    extraNotes: [
      'scrape_config — это раздел конфигурации Prometheus, в котором задаётся, откуда и как именно собирать метрики.',
      'targets в Prometheus — это адреса сервисов или exporter-ов, которые Prometheus опрашивает для получения метрик.',
      'PromQL-запрос — это специальный язык запросов Prometheus для выбора, фильтрации и вычисления метрик.',
      'alert rule — это правило, по которому Prometheus определяет, когда значение метрики становится опасным и нужно сгенерировать алерт.'
    ],
    tools: [
      { name: 'Prometheus', desc: 'Регулярно опрашивает exporter и хранит временные ряды метрик.' },
      { name: 'Grafana', desc: 'Визуализация, панели, аннотации, сравнение интервалов и алерты.' },
      { name: 'postgres_exporter', desc: 'Экспортирует метрики PostgreSQL в формате, понятном Prometheus.' },
      { name: 'Alertmanager', desc: 'Доставляет уведомления при выходе метрик за допустимые пределы.' }
    ],
    metrics: [
      { name: 'Uptime', desc: 'Показывает, как долго сервер работает без перезапуска и помогает замечать нестабильность.' },
      { name: 'Connections', desc: 'Отражает текущее число подключений и помогает увидеть всплески нагрузки со стороны приложений.' },
      { name: 'Transactions/sec', desc: 'Характеризует интенсивность работы базы по числу транзакций в секунду.' },
      { name: 'Cache hit ratio', desc: 'Показывает, как часто данные читаются из кэша, а не с диска.' },
      { name: 'Replication lag', desc: 'Позволяет контролировать отставание реплик от основного сервера.' },
      { name: 'Deadlocks', desc: 'Фиксирует случаи взаимных блокировок между транзакциями.' }
    ],
    visualCards: [
      {
        title: 'Поток метрик',
        body: 'PostgreSQL → postgres_exporter → Prometheus → Grafana / Alertmanager'
      },
      {
        title: 'Пример дашборда Grafana',
        body: 'Официальный пример панели Grafana, которая включает статусы и сводные метрики.',
        imageUrl: 'https://grafana.com/api/dashboards/9628/images/6027/image'
      },
      {
        title: 'Какие графики смотреть первыми',
        body: 'Мини-шпаргалка по тем панелям Grafana, которые чаще всего дают самую быструю картину состояния PostgreSQL.',
        code: `1. Connections
2. TPS
3. Cache hit ratio
4. Replication lag
5. Deadlocks`
      },
      {
        title: 'Визуальный сценарий инцидента',
        body: 'Такой сценарий показывает, как проблема развивается во времени и как мониторинг помогает её заметить.',
        code: 'рост соединений → рост latency → рост replication lag → срабатывает alert'
      }
    ],
    practice: [
      {
        title: 'Пример запуска exporter',
        code: 'DATA_SOURCE_NAME="postgresql://monitor:secret@localhost:5432/postgres?sslmode=disable" ./postgres_exporter',
        explanation: 'Exporter подключается к PostgreSQL и публикует метрики, которые затем считывает Prometheus.'
      },
      {
        title: 'Фрагмент scrape_config',
        code: `scrape_configs:
  - job_name: postgres
    static_configs:
      - targets: ["localhost:9187"]`,
        explanation: 'Prometheus будет опрашивать exporter по указанному адресу и сохранять метрики во времени.'
      },
      {
        title: 'Проверка доступности метрик exporter',
        code: 'curl http://localhost:9187/metrics | head',
        explanation: 'Так можно быстро убедиться, что exporter запущен и действительно отдаёт метрики в формате Prometheus.'
      },
      {
        title: 'Проверка статуса targets в Prometheus',
        code: 'curl http://localhost:9090/api/v1/targets',
        explanation: 'Позволяет убедиться, что Prometheus видит postgres_exporter и успешно собирает с него метрики.'
      },
      {
        title: 'Пример PromQL-запроса по числу соединений',
        code: 'pg_stat_database_numbackends{datname="postgres"}',
        explanation: 'Этот запрос показывает текущее число backend-соединений для выбранной базы данных.'
      },
      {
        title: 'Пример PromQL-запроса по активности транзакций',
        code: 'rate(pg_stat_database_xact_commit[5m]) + rate(pg_stat_database_xact_rollback[5m])',
        explanation: 'Так можно оценить интенсивность транзакционной нагрузки на базе за последние 5 минут.'
      },
      {
        title: 'Пример alert rule для роста lag репликации',
        code: `groups:
- name: postgres-alerts
  rules:
  - alert: PostgreSQLReplicationLagHigh
    expr: pg_replication_lag > 10
    for: 5m
    labels:
      severity: warning`,
        explanation: 'Такое правило подаст предупреждение, если lag репликации держится выше порога в течение 5 минут.'
      }
    ],
    interpretation: [
      'Резкий рост соединений может означать утечки коннектов в приложении или нехватку пула.',
      'Падающий cache hit ratio часто приводит к усилению давления на диск.',
      'Алерты полезны, когда они не шумят: лучше несколько точных, чем десятки бесполезных.'
    ],
    quiz: [
      {
        q: 'Какой компонент обычно отвечает именно за визуализацию метрик?',
        options: [
          { text: 'Grafana', explanation: 'Grafana — это система визуализации, которая строит графики, дашборды и панели поверх данных, собранных Prometheus.' },
          { text: 'pg_ctl', explanation: 'pg_ctl — это утилита для управления PostgreSQL сервером (запуск, остановка, перезагрузка), но не для визуализации метрик.' },
          { text: 'systemd', explanation: 'systemd — это система инициализации Linux для управления сервисами, а не инструмент визуализации.' },
          { text: 'VACUUM', explanation: 'VACUUM — это команда PostgreSQL для очистки мёртвых кортежей и освобождения места, не связанная с визуализацией.' }
        ],
        correct: 0
      },
      {
        q: 'Зачем нужен postgres_exporter?',
        options: [
          { text: 'Для резервного копирования', explanation: 'Резервное копирование выполняется pg_dump, pg_backrest или другими инструментами, а не postgres_exporter.' },
          { text: 'Для преобразования метрик PostgreSQL в формат Prometheus', explanation: 'postgres_exporter подключается к PostgreSQL, читает статистику и отдаёт её в формате, который Prometheus может собирать (scrape).' },
          { text: 'Для репликации', explanation: 'Репликация настраивается через recovery.conf или standby.signal, а не через postgres_exporter.' },
          { text: 'Для миграций схемы', explanation: 'Миграции схемы выполняются инструментами вроде Flyway, Liquibase или напрямую через SQL, а не postgres_exporter.' }
        ],
        correct: 1
      },
      {
        q: 'Какая команда помогает быстро проверить, что postgres_exporter действительно отдаёт метрики?',
        options: [
          { text: 'curl http://localhost:9187/metrics | head', explanation: 'postgres_exporter по умолчанию публикует метрики на порту 9187 по пути /metrics. curl позволяет сделать HTTP-запрос и увидеть ответ.' },
          { text: 'df -h', explanation: 'df показывает дисковое пространство, но не связан с проверкой работы postgres_exporter.' },
          { text: 'free -h', explanation: 'free показывает использование памяти, но не проверяет доступность postgres_exporter.' },
          { text: 'ps aux | grep postgres', explanation: 'Эта команда покажет процессы PostgreSQL, но не гарантирует, что postgres_exporter работает и отдаёт метрики.' }
        ],
        correct: 0
      }
    ]
  },
  {
    id: 3,
    title: 'Встроенные средства PostgreSQL',
    subtitle: 'pg_stat_activity, pg_stat_database, pg_locks, progress views',
    accent: 'from-violet-700 to-fuchsia-600',
    border: 'border-violet-200',
    theory:
      'Этот уровень переносит анализ внутрь самой PostgreSQL и опирается на системные представления, которые показывают текущее и накопленное состояние базы. Здесь можно увидеть активные сессии, ожидания, блокировки, статистику чтений и попаданий в буферный кэш, а также признаки проблемных операций. Именно встроенные средства позволяют понять, как сервер ведёт себя не с точки зрения операционной системы, а с точки зрения внутренних процессов СУБД. Такой уровень особенно полезен, когда сервер в целом работает стабильно, но пользователи сталкиваются с медленными запросами, блокировками или нестабильным временем ответа.',
    tools: [
      { name: 'pg_stat_activity', desc: 'Текущие сессии, state, wait_event, длительность запросов.' },
      { name: 'pg_stat_database', desc: 'Транзакции, блоковые чтения/попадания в кэш, конфликты, deadlocks.' },
      { name: 'pg_locks', desc: 'Диагностика блокировок и ожиданий между сессиями.' },
      { name: 'pg_stat_progress_vacuum / create_index', desc: 'Показывают ход длительных операций.' }
    ],
    metrics: [
      { name: 'Active sessions', desc: 'Показывает количество реально работающих сессий в текущий момент.' },
      { name: 'Wait events', desc: 'Помогает понять, какие ресурсы заставляют backend ждать.' },
      { name: 'Deadlocks', desc: 'Показывает случаи взаимных блокировок на уровне СУБД.' },
      { name: 'Blks hit/read', desc: 'Характеризует соотношение чтений из кэша и с физического носителя.' },
      { name: 'Temp files', desc: 'Указывает на использование временных файлов при сортировках и хешировании.' },
      { name: 'Transaction counters', desc: 'Позволяет оценить интенсивность транзакционной активности базы.' }
    ],
    visualCards: [
      {
        title: 'Пример активных запросов',
        body: 'Этот пример показывает запрос к pg_stat_activity — представлению PostgreSQL, в котором видны текущие сессии и запросы. Здесь важно смотреть не только на текст SQL, но и на состояние сессии (state), тип и причину ожидания (wait_event_type и wait_event), а также на длительность выполнения запроса. Такой подход помогает понять, действительно ли запрос сейчас работает, ждёт ли он блокировку или другой ресурс и как долго это продолжается.',
        code: `SELECT pid, usename, state, wait_event_type, wait_event, now() - query_start AS age
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY age DESC;`
      },
      {
        title: 'Состояния сессий PostgreSQL',
        body: 'Эта шпаргалка помогает быстро понять, что означает состояние соединения внутри PostgreSQL.',
        code: `active   → запрос сейчас выполняется
idle     → соединение открыто, но запрос не выполняется
waiting  → backend ждёт ресурс или блокировку
idle in transaction → транзакция открыта, но активной работы нет`
      },
      {
        title: 'Схема блокировок между сессиями',
        body: 'Такой сценарий показывает, как одна транзакция может удерживать ресурс, а другая — ждать его освобождения.',
        code: `Сессия A → держит lock на таблице orders
Сессия B → пытается изменить orders
Сессия B → wait_event_type = Lock
Сессия B → ждёт завершения транзакции A`
      },
      {
        title: 'Как читать wait_event',
        body: 'По типу ожидания можно понять, что именно замедляет работу backend-процесса.',
        code: `Lock         → ожидание блокировки
IO           → ожидание чтения или записи
ClientRead   → ожидание данных от клиента
ClientWrite  → ожидание передачи данных клиенту
LWLock       → ожидание внутреннего ресурса PostgreSQL`
      },
      {
        title: 'Типы wait_event_type и что они означают',
        body: 'PostgreSQL классифицирует ожидания по типам ресурсов. Понимание этих типов помогает быстро локализовать проблему.',
        code: `LWLock        → внутренние блокировки PostgreSQL (буферы, кэши)
Lock          → транзакционные блокировки (таблицы, строки)
BufferPin     → доступ к буферу (обычно короткие ожидания)
Activity      → активность сервера (автовакуум, WAL)
Client        → сетевое взаимодействие с клиентом
Extension      → ожидание расширения
IO            → операции ввода-вывода
Timeout       → таймауты перед повторными попытками`
      },
      {
        title: 'Что особенно важно',
        body: 'Если сессия долго висит в active или ждёт lock, это повод искать конфликтующий запрос или проблемную транзакцию.'
      }
    ],
    practice: [
      {
        title: 'Активные сессии',
        code: `SELECT pid, application_name, state, wait_event_type, query
FROM pg_stat_activity
WHERE backend_type = 'client backend';`,
        explanation: 'Позволяет понять, кто сейчас реально работает, а кто ждёт ресурс или блокировку.'
      },
      {
        title: 'Оценка cache hit ratio',
        code: `SELECT datname, blks_hit, blks_read,
       round(100.0 * blks_hit / nullif(blks_hit + blks_read, 0), 2) AS hit_ratio
FROM pg_stat_database
ORDER BY hit_ratio ASC;`,
        explanation: 'Чем ниже hit ratio, тем больше вероятность, что сервер читает данные с диска, а не из shared buffers / ОС-кэша.'
      },
      {
        title: 'Поиск долгих активных запросов',
        code: `SELECT pid, usename, state,
       now() - query_start AS age,
       wait_event_type, wait_event, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY age DESC;`,
        explanation: 'Помогает быстро найти запросы, которые выполняются слишком долго, и оценить, не ждут ли они какой-то ресурс.'
      },
      {
        title: 'Диагностика блокировок через pg_locks',
        code: `SELECT a.pid,
       a.usename,
       a.state,
       l.locktype,
       l.mode,
       l.granted,
       a.query
FROM pg_locks l
JOIN pg_stat_activity a ON a.pid = l.pid
WHERE NOT l.granted;`,
        explanation: 'Показывает процессы, которые не получили блокировку и сейчас ожидают доступ к ресурсу.'
      },
      {
        title: 'Прогресс VACUUM',
        code: `SELECT pid,
       phase,
       heap_blks_total,
       heap_blks_scanned,
       heap_blks_vacuumed
FROM pg_stat_progress_vacuum;`,
        explanation: 'Позволяет увидеть, на каком этапе находится длительная операция VACUUM и как далеко она продвинулась.'
      },
      {
        title: 'Количество временных файлов по базам',
        code: `SELECT datname,
       temp_files,
       pg_size_pretty(temp_bytes) AS temp_size
FROM pg_stat_database
ORDER BY temp_bytes DESC;`,
        explanation: 'Полезно для поиска баз, в которых запросы активно создают временные файлы из-за сортировок или хеширования.'
      },
      {
        title: 'Детальный анализ wait events с описаниями',
        code: `SELECT a.pid,
       a.wait_event_type,
       a.wait_event,
       w.description
FROM pg_stat_activity a
JOIN pg_wait_events w
  ON a.wait_event_type = w.type
  AND a.wait_event = w.name
WHERE a.wait_event IS NOT NULL
  AND a.state = 'active'
ORDER BY a.pid;`,
        explanation: 'Показывает активные процессы с человеческими описаниями того, чего именно они ждут. Помогает понять природу ожиданий: I/O, блокировки, сетевые операции и т.д.'
      },
      {
        title: 'Прогресс CREATE INDEX / REINDEX',
        code: `SELECT pid,
       datname,
       relid::regclass AS table_name,
       command,
       phase,
       blocks_total,
       blocks_done,
       tuples_total,
       tuples_done,
       CASE
         WHEN blocks_total > 0
         THEN round(100.0 * blocks_done / blocks_total, 2)
         ELSE 0
       END AS progress_pct
FROM pg_stat_progress_create_index;`,
        explanation: 'Позволяет отслеживать прогресс создания или перестроения индексов в реальном времени, включая текущую фазу и процент выполнения.'
      },
      {
        title: 'Расширенный прогресс VACUUM с индексами',
        code: `SELECT pid,
       datname,
       relid::regclass AS table_name,
       phase,
       heap_blks_total,
       heap_blks_scanned,
       heap_blks_vacuumed,
       index_total,
       index_processed,
       num_dead_item_ids,
       round(100.0 * index_processed / NULLIF(index_total, 0), 2) AS index_progress
FROM pg_stat_progress_vacuum;`,
        explanation: 'Показывает детальный прогресс VACUUM, включая обработку индексов (indexes_total/index_processed) — новая возможность PostgreSQL 17 для мониторинга vacuum операций.'
      }
    ],
    interpretation: [
      'Большое число ожиданий по lock — сигнал, что запросы мешают друг другу и проблему надо искать в конкурентном доступе.',
      'Рост temp_files часто связан с нехваткой work_mem или тяжёлыми сортировками/хешированием.',
      'Одиночная метрика редко объясняет проблему: полезно смотреть контекст сразу по нескольким представлениям.'
    ],
    quiz: [
      {
        q: 'В каком представлении чаще всего ищут текущие активные запросы?',
        options: [
          { text: 'pg_stat_activity', explanation: 'pg_stat_activity показывает все активные сессии, их состояние (active, idle), wait events и текст выполняемых запросов.' },
          { text: 'pg_tablespace', explanation: 'pg_tablespace содержит информацию о табличных пространствах, а не о текущих запросах.' },
          { text: 'pg_roles', explanation: 'pg_roles содержит информацию о ролях пользователей, но не о текущих запросах.' },
          { text: 'pg_indexes', explanation: 'pg_indexes содержит метаданные об индексах, но не показывает активные запросы.' }
        ],
        correct: 0
      },
      {
        q: 'Что помогает диагностировать pg_locks?',
        options: [
          { text: 'Размер CSS-файлов', explanation: 'CSS — это каскадные таблицы стилей для веб-страниц и не связаны с блокировками PostgreSQL.' },
          { text: 'Сетевые порты Docker', explanation: 'Docker порты относятся к контейнеризации и не связаны с блокировками внутри PostgreSQL.' },
          { text: 'Блокировки и ожидания между сессиями', explanation: 'pg_locks показывает, какие процессы удерживают блокировки, а какие ждут их освобождения. Это ключевой инструмент для диагностики deadlock и long locks.' },
          { text: 'Только резервные копии', explanation: 'pg_locks не связан с резервным копированием, а только с блокировками во время нормальной работы.' }
        ],
        correct: 2
      },
      {
        q: 'Какое представление из практического блока позволяет увидеть прогресс длительной операции VACUUM?',
        options: [
          { text: 'pg_stat_progress_vacuum', explanation: 'Это представление показывает текущую фазу VACUUM, количество обработанных блоков, прогресс по индексам и позволяет оценить время завершения.' },
          { text: 'pg_settings', explanation: 'pg_settings содержит конфигурационные параметры PostgreSQL, но не прогресс операций.' },
          { text: 'pg_tablespace', explanation: 'pg_tablespace показывает табличные пространства, но не содержит информации о прогрессе VACUUM.' },
          { text: 'pg_authid', explanation: 'pg_authid содержит информацию об аутентификации ролях, но не о прогрессе операций.' }
        ],
        correct: 0
      },
      {
        q: 'Для чего нужен join с pg_wait_events при анализе pg_stat_activity?',
        options: [
          { text: 'Для смены пароля', explanation: 'Смена пароля выполняется через ALTER USER и не связана с pg_wait_events.' },
          { text: 'Для получения человекочитаемых описаний wait events', explanation: 'pg_wait_events содержит описания всех типов ожиданий. Join позволяет получить human-readable описание того, что именно ждёт процесс.' },
          { text: 'Для экспорта CSV', explanation: 'Экспорт в CSV выполняется через COPY или \pset в psql, а не через join с pg_wait_events.' },
          { text: 'Для настройки SSL', explanation: 'SSL настраивается через postgresql.conf и certificates, а не через анализ wait events.' }
        ],
        correct: 1
      },
      {
        q: 'Что означает wait_event_type = "LWLock"?',
        options: [
          { text: 'Сетевое соединение', explanation: 'Сетевые соединения относятся к типу Client, а не LWLock.' },
          { text: 'Внутренняя блокировка PostgreSQL (буферы, кэши)', explanation: 'LWLock (Lightweight Lock) — это внутренние блокировки PostgreSQL для управления ресурсами: shared buffers, WAL buffers, clog и другими структурами.' },
          { text: 'Дисковая операция', explanation: 'Дисковые операции относятся к типу IO, а не LWLock.' },
          { text: 'Транзакционная блокировка', explanation: 'Транзакционные блокировки относятся к типу Lock, а не LWLock. LWLock — это более лёгкие внутренние блокировки.' }
        ],
        correct: 1
      }
    ]
  },
  {
    id: 4,
    title: 'Расширения и плагины',
    subtitle: 'pg_stat_statements, auto_explain, pg_buffercache',
    accent: 'from-pink-700 to-rose-600',
    border: 'border-pink-200',
    theory:
      'Когда стандартных представлений PostgreSQL уже недостаточно, используют специализированные расширения и плагины. Они позволяют собирать агрегированную статистику выполнения SQL-запросов, автоматически сохранять планы медленных операций и получать более детальную картину поведения базы под нагрузкой. Такой уровень особенно полезен для поиска не одной случайной проблемы, а устойчивых источников деградации: часто вызываемых запросов, тяжёлых операций чтения, неудачных планов или неэффективной работы с буферами. Расширения делают диагностику глубже и помогают переходить от общей симптоматики к поиску конкретных причин.',
    tools: [
      { name: 'pg_stat_statements', desc: 'Собирает статистику планирования и выполнения SQL-запросов.' },
      { name: 'auto_explain', desc: 'Автоматически пишет планы медленных запросов в лог.' },
      { name: 'pg_buffercache', desc: 'Показывает содержимое shared buffers для точечного анализа.' },
      { name: 'pg_wait_sampling', desc: 'Помогает глубже анализировать ожидания, если доступно в окружении.' }
    ],
    metrics: [
      { name: 'Total_exec_time', desc: 'Показывает суммарное время, потраченное на выполнение конкретного запроса.' },
      { name: 'Mean_exec_time', desc: 'Отражает среднее время одного выполнения запроса.' },
      { name: 'Calls', desc: 'Показывает, сколько раз запрос был вызван за период наблюдения.' },
      { name: 'Rows', desc: 'Характеризует объём строк, возвращаемых или обрабатываемых запросом.' },
      { name: 'Shared blocks hit/read', desc: 'Позволяет увидеть, работал ли запрос в основном из кэша или активно читал с диска.' },
      { name: 'Plan time', desc: 'Показывает, сколько времени уходит на построение плана выполнения.' }
    ],
    visualCards: [
      {
        title: 'Как читать pg_stat_statements',
        body: 'Смотрите не только на среднее время, но и на суммарное время. Запрос с небольшим mean_exec_time может съедать больше всего ресурсов из-за огромного числа вызовов.'
      },
      {
        title: 'Типичный лидер по суммарному времени',
        body: 'Top SQL по total_exec_time — хороший кандидат для первой оптимизации.',
        code: `SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;`
      },
      {
        title: 'Как интерпретировать статистику запросов',
        body: 'Эта шпаргалка помогает быстро понять, на какие поля смотреть в pg_stat_statements в первую очередь.',
        code: `total_exec_time → общий вклад запроса в нагрузку
mean_exec_time  → среднее время одного выполнения
calls           → сколько раз запрос запускался
rows            → сколько строк обычно обрабатывается
shared_blks_read → сколько данных пришлось читать с диска`
      },
      {
        title: 'Когда полезен auto_explain',
        body: 'Расширение auto_explain помогает автоматически сохранять планы тех запросов, которые выполняются слишком долго.',
        code: `медленный запрос → auto_explain пишет план в лог
план попадает в журнал → можно разобрать узкие места
не нужно вручную ловить проблемный запрос в моменте`
      },
      {
        title: 'Сценарий анализа через расширения',
        body: 'Такой сценарий показывает, как переходят от общей статистики к поиску конкретного проблемного запроса.',
        code: `pg_stat_statements → находим дорогой SQL
auto_explain → получаем его план
анализируем blocks / joins / scans
выбираем способ оптимизации`
      }
    ],
    practice: [
      {
        title: 'Активация pg_stat_statements',
        code: `shared_preload_libraries = 'pg_stat_statements'
compute_query_id = on`,
        explanation: 'После изменения shared_preload_libraries требуется перезапуск сервера, затем расширение создаётся в базе командой CREATE EXTENSION.'
      },
      {
        title: 'Создание расширения',
        code: 'CREATE EXTENSION IF NOT EXISTS pg_stat_statements;',
        explanation: 'После этого становятся доступны представления со статистикой по SQL-запросам.'
      },
      {
        title: 'Поиск самых дорогих запросов по суммарному времени',
        code: `SELECT query,
       calls,
       total_exec_time,
       mean_exec_time,
       rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;`,
        explanation: 'Этот запрос помогает найти SQL, которые в сумме дают наибольшую нагрузку на сервер.'
      },
      {
        title: 'Поиск запросов с самым большим средним временем',
        code: `SELECT query,
       calls,
       mean_exec_time,
       total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;`,
        explanation: 'Полезно для поиска запросов, которые сами по себе выполняются очень медленно, даже если запускаются нечасто.'
      },
      {
        title: 'Анализ чтений из кэша и с диска',
        code: `SELECT query,
       shared_blks_hit,
       shared_blks_read,
       round(shared_blks_hit::numeric / nullif(shared_blks_hit + shared_blks_read, 0), 3) AS hit_ratio
FROM pg_stat_statements
ORDER BY shared_blks_read DESC
LIMIT 10;`,
        explanation: 'Помогает понять, какие запросы чаще других вынуждают сервер читать данные с диска.'
      },
      {
        title: 'Настройка auto_explain для медленных запросов',
        code: `shared_preload_libraries = 'pg_stat_statements,auto_explain'
auto_explain.log_min_duration = '500ms'
auto_explain.log_analyze = on
auto_explain.log_buffers = on`,
        explanation: 'Такой набор настроек заставляет PostgreSQL записывать в лог планы запросов, которые работают дольше 500 мс.'
      },
      {
        title: 'Создание pg_buffercache',
        code: 'CREATE EXTENSION IF NOT EXISTS pg_buffercache;',
        explanation: 'Расширение pg_buffercache позволяет анализировать содержимое shared buffers и использовать его для точечной диагностики.'
      },
      {
        title: 'Top-5 запросов с cache hit percentage',
        code: `SELECT query,
       calls,
       total_exec_time,
       rows,
       round(100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0), 2) AS hit_percent
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;`,
        explanation: 'Показывает топ-5 запросов по суммарному времени выполнения с процентом попадания в кэш. Низкий hit_percent указывает на то, что запрос активно читает с диска.'
      },
      {
        title: 'Запросы с наибольшей активностью WAL',
        code: `SELECT query,
       calls,
       wal_records,
       pg_size_pretty(wal_bytes) AS wal_size,
       round(wal_bytes::numeric / nullif(calls, 0), 2) AS wal_per_call
FROM pg_stat_statements
ORDER BY wal_bytes DESC
LIMIT 10;`,
        explanation: 'Помогает найти запросы, которые генерируют наибольшую нагрузку на WAL (write-ahead log). Высокие значения могут указывать на массовые вставки или обновления.'
      },
      {
        title: 'Анализ эффективности использования индексов',
        code: `SELECT query,
       calls,
       total_exec_time,
       rows,
       shared_blks_read,
       shared_blks_hit,
       round(100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0), 2) AS cache_hit_ratio,
       round(100.0 * idx_blks_read / nullif(idx_blks_read + idx_blks_hit, 0), 2) AS idx_cache_hit_ratio
FROM pg_stat_statements
WHERE calls > 10
ORDER BY total_exec_time DESC
LIMIT 10;`,
        explanation: 'Показывает соотношение чтений из кэша и с диска как для таблиц, так и для индексов. Позволяет понять, эффективно ли используются индексы и нет ли проблем с кэшем.'
      }
    ],
    interpretation: [
      'Большой total_exec_time означает высокий общий вклад в нагрузку, даже если отдельный вызов быстрый.',
      'Большой mean_exec_time означает, что сам запрос медленный и его надо разбирать по плану.',
      'Расширения полезны, но их нужно включать осознанно и читать вместе с обычной статистикой PostgreSQL.'
    ],
    quiz: [
      {
        q: 'Какое расширение лучше всего подходит для поиска самых дорогих SQL-запросов в сумме?',
        options: [
          { text: 'pg_stat_statements', explanation: 'pg_stat_statements собирает статистику по всем запросам: количество вызовов, суммарное и среднее время выполнения, чтение блоков. Это позволяет найти запросы, которые в сумме создают наибольшую нагрузку.' },
          { text: 'pg_hba.conf', explanation: 'pg_hba.conf — это файл конфигурации аутентификации, а не расширение для сбора статистики.' },
          { text: 'initdb', explanation: 'initdb — это утилита для создания нового кластера баз данных, а не расширение для мониторинга запросов.' },
          { text: 'reindexdb', explanation: 'reindexdb — это утилита для перестроения индексов, а не расширение для анализа производительности запросов.' }
        ],
        correct: 0
      },
      {
        q: 'Нужно ли перезапускать PostgreSQL после добавления pg_stat_statements в shared_preload_libraries?',
        options: [
          { text: 'Да', explanation: 'shared_preload_libraries — это параметр, который загружает расширения при старте сервера. Изменения этого параметра требуют перезапуска PostgreSQL.' },
          { text: 'Нет', explanation: 'Неверно. Поскольку shared_preload_libraries загружает библиотеки при старте сервера, изменение этого параметра требует перезапуска.' }
        ],
        correct: 0
      },
      {
        q: 'Какой запрос из практического блока помогает найти SQL с наибольшим суммарным временем выполнения?',
        options: [
          { text: 'ORDER BY total_exec_time DESC', explanation: 'total_exec_time показывает суммарное время всех выполнений запроса. Сортировка по убыванию позволяет найти запросы с наибольшим вкладом в нагрузку.' },
          { text: 'ORDER BY rows ASC', explanation: 'rows показывает количество строк, но не время выполнения. Сортировка по rows не поможет найти самые медленные запросы.' },
          { text: 'ORDER BY calls ASC', explanation: 'calls показывает количество вызовов, но не учитывает время выполнения. Частый быстрый запрос может быть менее проблемным, чем редкий медленный.' },
          { text: 'ORDER BY query ASC', explanation: 'ORDER BY query ASC сортирует по тексту запроса в алфавитном порядке, что не помогает найти самые медленные запросы.' }
        ],
        correct: 0
      }
    ]
  },
  {
    id: 5,
    title: 'Внутренняя телеметрия и низкоуровневые механизмы',
    subtitle: 'EXPLAIN, BUFFERS, WAL, wait events, внутренние счётчики I/O',
    accent: 'from-rose-800 to-orange-600',
    border: 'border-rose-200',
    theory:
      'Это самый детальный уровень анализа, на котором исследуется не просто факт медленной работы, а конкретный механизм её возникновения. Здесь разбирают планы выполнения запросов, реальные и ожидаемые оценки строк, обращения к буферам, характер чтения данных, ожидания backend-процессов и телеметрию операций ввода-вывода. Такой подход позволяет точно установить, почему запрос оказался неэффективным: из-за отсутствующего индекса, неверной статистики, неудачного join, избыточного последовательного сканирования или перегрузки подсистемы хранения. На этом уровне диагностика превращается в целенаправленную оптимизацию конкретных SQL-запросов и настроек PostgreSQL.',
    tools: [
      { name: 'EXPLAIN', desc: 'Показывает план, выбранный оптимизатором.' },
      { name: 'EXPLAIN (ANALYZE, BUFFERS)', desc: 'Даёт реальное время выполнения и информацию о чтениях/попаданиях в буфер.' },
      { name: 'wait events', desc: 'Помогают понять, где именно backend ждёт ресурс.' },
      { name: 'pg_stat_io', desc: 'Современная статистика I/O по типам backend и контекстам операций.' }
    ],
    metrics: [
      { name: 'Execution time', desc: 'Показывает фактическое время выполнения запроса.' },
      { name: 'Planning time', desc: 'Отражает затраты времени на построение плана оптимизатором.' },
      { name: 'Seq Scan vs Index Scan', desc: 'Помогает понять, использует ли запрос индексный доступ или последовательное сканирование.' },
      { name: 'Shared hit/read', desc: 'Показывает, были ли страницы найдены в буферах или прочитаны с диска.' },
      { name: 'WAL activity', desc: 'Характеризует интенсивность записи в журнал предзаписи.' },
      { name: 'I/O by backend type', desc: 'Позволяет увидеть, какие типы backend-процессов создают основную нагрузку по I/O.' }
    ],
    visualCards: [
      {
        title: 'Пример плана',
        body: 'Если оптимизатор выбирает Seq Scan на большой таблице при селективном фильтре, возможно отсутствует подходящий индекс или статистика устарела.',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42;`
      },
      {
        title: 'Как интерпретировать план',
        body: 'Сравнивайте estimated rows и actual rows. Большой разрыв намекает на неточную статистику, перекос распределения или неподходящую модель плана.'
      },
      {
        title: 'Seq Scan против Index Scan',
        body: 'Такой блок помогает наглядно понять, почему один и тот же запрос может читать таблицу целиком или работать через индекс.',
        code: `Seq Scan   → чтение большого числа строк подряд
Index Scan → точечный доступ по индексу
Bitmap Heap Scan → компромиссный вариант для выборки множества строк`
      },
      {
        title: 'Как читать BUFFERS',
        body: 'Статистика BUFFERS показывает, были ли страницы найдены в памяти или пришлось читать их с диска.',
        code: `shared hit  → страница уже была в буферах
shared read → страницу пришлось читать с диска
temp read/write → запрос использовал временные файлы`
      },
      {
        title: 'Сценарий поиска причины медленного запроса',
        body: 'Этот сценарий показывает типичную логику работы на самом глубоком уровне диагностики.',
        code: `EXPLAIN ANALYZE → находим дорогой узел
смотрим BUFFERS → понимаем, CPU это или I/O
сравниваем actual rows и estimated rows
проверяем индекс, статистику и тип join`
      },
      {
        title: 'Типы индексов PostgreSQL и когда их использовать',
        body: 'PostgreSQL поддерживает различные типы индексов для разных задач. Правильный выбор типа индекса критически важен для производительности.',
        code: `B-tree  → по умолчанию, для =, <, >, ≤, ≥, сравнений, ORDER BY
Hash    → только для =, но более компактен чем B-tree
GiST    → пространственные данные, полнотекстовый поиск, диапазоны
SP-GiST → оптимизированный GiST для некоторых задач (например, префиксы)
GIN     → массивы, jsonb, полнотекстовый поиск (индексирует каждое слово)
BRIN    → очень большие таблицы с упорядоченными данными (дешёвый)`
      },
      {
        title: 'Конкурентность и блокировки при работе с индексами',
        body: 'Разные типы индексов ведут себя по-разному при конкурентных операциях. Это важно учитывать при выборе типа индекса для высоконагруженных систем.',
        code: `B-tree, GiST, SP-GiST → короткие page-level блокировки, высокая конкурентность
Hash                  → bucket-level блокировки, могут быть deadlocks
GIN                   → короткие page-level блокировки, но одна вставка
                       может вызвать несколько операций с индексом
Рекомендация:          для concurrent приложений предпочитайте B-tree`
      }
    ],
    practice: [
      {
        title: 'Разбор тяжёлого запроса',
        code: `EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT c.name, sum(o.total)
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name;`,
        explanation: 'Смотрите на самые дорогие узлы плана, число строк, типы join, чтения из shared buffers и время на каждом шаге.'
      },
      {
        title: 'Обновление статистики',
        code: 'ANALYZE orders;',
        explanation: 'Если оценки строк сильно расходятся с реальностью, стоит проверить актуальность статистики таблиц.'
      },
      {
        title: 'Проверка конкретного фильтра через EXPLAIN',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE status = 'paid';`,
        explanation: 'Полезно, чтобы увидеть, использует ли PostgreSQL индексный доступ или выбирает последовательное сканирование таблицы.'
      },
      {
        title: 'Поиск запросов с большим числом чтений с диска',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM products
WHERE category_id = 10;`,
        explanation: 'Если в плане много shared read и мало shared hit, запрос активно обращается к диску и может быть чувствителен к I/O.'
      },
      {
        title: 'Проверка статистики I/O по backend-процессам',
        code: `SELECT backend_type,
       object,
       context,
       reads,
       writes
FROM pg_stat_io
ORDER BY reads DESC;`,
        explanation: 'Позволяет понять, какие типы backend-процессов создают основную нагрузку по операциям чтения и записи.'
      },
      {
        title: 'Проверка активности WAL',
        code: `SELECT wal_records,
       wal_fpi,
       wal_bytes,
       stats_reset
FROM pg_stat_wal;`,
        explanation: 'Эта статистика помогает оценить интенсивность записи в WAL и понять, насколько активно сервер генерирует журнал предзаписи.'
      },
      {
        title: 'Мониторинг использования индексов',
        code: `SELECT schemaname,
       tablename,
       indexname,
       idx_scan as index_scans,
       idx_tup_read as tuples_read,
       idx_tup_fetch as tuples_fetched,
       pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;`,
        explanation: 'Показывает индексы с наименьшим количеством использований. Неиспользуемые индексы замедляют INSERT/UPDATE и занимают место.'
      },
      {
        title: 'Анализ эффективности Seq Scan vs Index Scan',
        code: `SELECT schemaname,
       tablename,
       seq_scan,
       seq_tup_read,
       idx_scan,
       idx_tup_fetch,
       round(100.0 * seq_scan / nullif(seq_scan + idx_scan, 0), 2) as seq_scan_pct
FROM pg_stat_user_tables
WHERE seq_scan + idx_scan > 0
ORDER BY seq_scan DESC
LIMIT 10;`,
        explanation: 'Помогает найти таблицы, где PostgreSQL чаще использует последовательное сканирование вместо индексного. Высокий seq_scan_pct может указывать на отсутствующие или неэффективные индексы.'
      },
      {
        title: 'Поиск проблемных индексов (дубликаты и перекрытия)',
        code: `SELECT pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
       indexrelid::regclass as index_name,
       indrelid::regclass as table_name,
       idx_scan,
       idx_tup_read,
       idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND pg_relation_size(indexrelid) > 100000
ORDER BY pg_relation_size(indexrelid) DESC;`,
        explanation: 'Находит индексы, которые вообще не используются (idx_scan = 0), но занимают значительное место. Такие индексы — кандидаты на удаление.'
      },
      {
        title: 'Анализ B-tree vs других типов индексов',
        code: `-- Проверка типов индексов и их использования
SELECT
  i.indrelid::regclass AS table_name,
  i.indexrelid::regclass AS index_name,
  am.amname AS index_type,
  pg_size_pretty(pg_relation_size(i.indexrelid)) AS size,
  s.idx_scan,
  s.idx_tup_read,
  s.idx_tup_fetch
FROM pg_index i
JOIN pg_am am ON am.oid = i.indexrelid::regclass::relam
JOIN pg_stat_user_indexes s ON s.indexrelid = i.indexrelid
ORDER BY pg_relation_size(i.indexrelid) DESC;`,
        explanation: 'Показывает все индексы с указанием их типа (btree, hash, gist, gin, spgist, brin). Помогает оценить эффективность разных типов индексов для конкретных задач.'
      }
    ],
    interpretation: [
      'EXPLAIN без ANALYZE показывает прогноз, а не фактическое выполнение.',
      'BUFFERS помогает понять, проблема в CPU или в чтениях страниц.',
      'Плохой план часто связан не только с индексами, но и с неточной статистикой или неподходящими настройками памяти.',
      'Выбор правильного типа индекса критичен: B-tree для равенств и диапазонов, GIN для массивов/jsonb/полнотекста, BRIN для больших упорядоченных таблиц.',
      'Неиспользуемые индексы не только занимают место, но и замедляют операции записи — регулярно анализируйте pg_stat_user_indexes.'
    ],
    quiz: [
      {
        q: 'Какая команда показывает фактический путь выполнения запроса, а не только прогноз оптимизатора?',
        options: [
          { text: 'EXPLAIN ANALYZE', explanation: 'EXPLAIN ANALYZE действительно выполняет запрос и показывает реальное время выполнения, фактическое количество строк и использование буферов.' },
          { text: 'SHOW ALL', explanation: 'SHOW ALL показывает все конфигурационные параметры, но не выполняет запрос и не показывает план выполнения.' },
          { text: 'CREATE INDEX', explanation: 'CREATE INDEX создаёт новый индекс, но не показывает план выполнения запроса.' },
          { text: 'CHECKPOINT', explanation: 'CHECKPOINT принудительно записывает все изменённые данные на диск, но не связан с анализом планов выполнения.' }
        ],
        correct: 0
      },
      {
        q: 'Для чего полезна опция BUFFERS в EXPLAIN?',
        options: [
          { text: 'Для смены пароля', explanation: 'Смена пароля выполняется через ALTER USER и не связана с опцией BUFFERS.' },
          { text: 'Для анализа чтений и попаданий в буферы', explanation: 'BUFFERS показывает количество shared hits (попаданий в кэш), shared reads (чтений с диска), temp reads/writes. Это помогает понять, проблема в CPU или в I/O.' },
          { text: 'Для экспорта CSV', explanation: 'Экспорт в CSV выполняется через COPY или \pset в psql, а не через опцию BUFFERS.' },
          { text: 'Для настройки SSL', explanation: 'SSL настраивается через postgresql.conf и сертификаты, а не через опцию BUFFERS в EXPLAIN.' }
        ],
        correct: 1
      },
      {
        q: 'Какое представление из практического блока помогает увидеть статистику I/O по backend-процессам?',
        options: [
          { text: 'pg_stat_io', explanation: 'pg_stat_io показывает статистику чтений и записей по типам backend (client backend, autovacuum, checkpointer и т.д.) и контекстам операций.' },
          { text: 'pg_indexes', explanation: 'pg_indexes содержит метаданные об индексах, но не статистику I/O операций.' },
          { text: 'pg_description', explanation: 'pg_description содержит комментарии к объектам базы данных, но не статистику I/O.' },
          { text: 'pg_depend', explanation: 'pg_depend показывает зависимости между объектами базы данных, но не I/O статистику.' }
        ],
        correct: 0
      },
      {
        q: 'Какой тип индекса в PostgreSQL лучше всего подходит для операций равенства и диапазонов (=, <, >)?',
        options: [
          { text: 'B-tree', explanation: 'B-tree — это тип индекса по умолчанию, оптимизированный для операций равенства и диапазонов. Он поддерживает сортировку и используется для =, <, >, ≤, ≥, ORDER BY.' },
          { text: 'GIN', explanation: 'GIN оптимизирован для полнотекстового поиска, массивов, JSONB, где нужно индексировать каждое слово или элемент. Он неэффективен для простых диапазонных запросов.' },
          { text: 'BRIN', explanation: 'BRIN (Block Range INdex) очень компактен и подходит для очень больших упорядоченных таблиц, но менее точен для точечных запросов, чем B-tree.' },
          { text: 'Hash', explanation: 'Hash-индексы поддерживают только операции равенства (=), но не диапазонные запросы (<, >). В большинстве случаев B-tree предпочтительнее.' }
        ],
        correct: 0
      },
      {
        q: 'Какой тип индекса лучше всего подходит для полнотекстового поиска и массивов?',
        options: [
          { text: 'B-tree', explanation: 'B-tree не подходит для полнотекстового поиска и массивов, так как не может индексировать каждое слово или элемент отдельно.' },
          { text: 'GIN', explanation: 'GIN (Generalized Inverted Index) создаёт инвертированный индекс, где каждое слово или элемент индексируется отдельно. Это идеально для полнотекстового поиска, массивов и JSONB.' },
          { text: 'Hash', explanation: 'Hash-индексы поддерживают только операции равенства и не могут использоваться для полнотекстового поиска или поиска по элементам массива.' },
          { text: 'BRIN', explanation: 'BRIN хранит сводную информацию по диапазонам блоков и неэффективен для точечного поиска по словам или элементам массива.' }
        ],
        correct: 1
      }
    ]
  }
];

export const TABS = [
  { key: 'theory', label: 'Теория' },
  { key: 'visual', label: 'Визуальный блок' },
  { key: 'practice', label: 'Практика' },
  { key: 'quiz', label: 'Самопроверка' }
];
