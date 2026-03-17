import { useMemo, useState } from 'react';
import { LEVELS, TABS } from './data/levels';
import { ProgressRings } from './components/ProgressRings';
import { QuizBlock } from './components/QuizBlock';
import type { Answers, Tab } from './types';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('theory');
  const [answers, setAnswers] = useState<Answers>({});

  const level = LEVELS[currentLevel];
  const progress = ((currentLevel + 1) / LEVELS.length) * 100;

  const passedLevels = useMemo(() => {
    return LEVELS.map((lvl, idx) => {
      const localAnswers = answers[idx] || {};
      return lvl.quiz.every((q, qIdx) => localAnswers[qIdx] === q.correct);
    });
  }, [answers]);

  const totalCorrect = LEVELS.reduce((acc, lvl, idx) => {
    const localAnswers = answers[idx] || {};
    return acc + lvl.quiz.filter((q, qIdx) => localAnswers[qIdx] === q.correct).length;
  }, 0);

  const totalQuestions = LEVELS.reduce((acc, lvl) => acc + lvl.quiz.length, 0);

  const switchLevel = (index: number) => {
    setCurrentLevel(index);
    setActiveTab('theory');
  };

  const goNext = () => {
    if (currentLevel < LEVELS.length - 1) {
      switchLevel(currentLevel + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid lg:grid-cols-[1.4fr_.8fr] gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">PostgreSQL</h1>
              <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
                Интерактивный туториал показывает путь от внешнего наблюдения за хостом до анализа планов выполнения и внутренней телеметрии PostgreSQL.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Уровни</div>
                  <div className="text-2xl font-bold">{currentLevel + 1}/{LEVELS.length}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Самопроверка</div>
                  <div className="text-2xl font-bold">{totalCorrect}/{totalQuestions}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-2xl">
              <ProgressRings currentLevel={currentLevel} />
              <p className="mt-4 text-center text-sm text-slate-500">Схема уровней мониторинга PostgreSQL</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
          <aside className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900">Навигация по уровням</h2>
                <span className="text-xs text-slate-500">{currentLevel + 1}/{LEVELS.length}</span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>

              <div className="space-y-2">
                {LEVELS.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => switchLevel(index)}
                    className={`w-full text-left rounded-2xl p-4 border transition-all ${
                      currentLevel === index
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">Уровень {item.id}</div>
                        <div className="font-bold text-slate-900 leading-tight">{item.title}</div>
                        <div className="text-sm text-slate-600 mt-1">{item.subtitle}</div>
                      </div>
                      <div className={`mt-1 shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        passedLevels[index] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {passedLevels[index] ? '✓' : item.id}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className={`bg-gradient-to-r ${level.accent} text-white p-6 md:p-8`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">Уровень {level.id}</div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{level.title}</h2>
                    <p className="text-white/80 text-sm md:text-base max-w-3xl">{level.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 px-4 md:px-6 overflow-x-auto hide-scrollbar">
                <div className="flex gap-2 py-3 min-w-max">
                  {TABS.map((tab: Tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeTab === tab.key
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 md:p-6 lg:p-8">
                {activeTab === 'theory' && (
                  <div className="space-y-8 fade-in">
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] text-blue-700 font-bold mb-3">Описание уровня</h3>
                      <p className="text-lg leading-relaxed text-slate-700 max-w-4xl">{level.theory}</p>
                      {level.note && (
                        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                          <span className="font-bold">Замечание.</span> {level.note}
                        </div>
                      )}
                    </div>

                    <div className="grid xl:grid-cols-[1.3fr_.9fr] gap-6">
                      <div>
                        <h3 className="text-xs uppercase tracking-[0.2em] text-blue-700 font-bold mb-3">Инструменты</h3>
                        <div className="grid gap-3">
                          {level.tools.map((tool) => (
                            <div key={tool.name} className={`rounded-2xl border ${level.border} p-4 bg-slate-50`}>
                              <div className="font-bold text-slate-900 mb-1">{tool.name}</div>
                              <div className="text-sm text-slate-700 leading-relaxed">{tool.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-[0.2em] text-blue-700 font-bold mb-3">Ключевые метрики</h3>
                        <div className="grid gap-3">
                          {level.metrics.map((metric) => (
                            <div key={metric.name} className={`rounded-2xl border ${level.border} p-4 bg-slate-50`}>
                              <div className="font-bold text-slate-900 mb-1">{metric.name}</div>
                              <div className="text-sm text-slate-700 leading-relaxed">{metric.desc}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 bg-slate-900 text-slate-100 rounded-2xl p-5">
                          <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">Зачем смотреть этот уровень</div>
                          <p className="text-sm leading-relaxed text-slate-300">
                            Он помогает локализовать проблему: инфраструктура, поведение сервера PostgreSQL, конкретные SQL-запросы или ошибки планирования.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'visual' && (
                  <div className="space-y-6 fade-in">
                    <div className="grid gap-4">
                      {level.visualCards.map((card, idx) => (
                        <div key={idx} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                            <h4 className="font-bold text-slate-900">{card.title}</h4>
                          </div>
                          <div className="p-5">
                            <p className="text-slate-700 leading-relaxed">{card.body}</p>
                            {card.imageUrl && (
                              <img
                                src={card.imageUrl}
                                alt={card.title}
                                className="mt-4 w-full rounded-2xl border border-slate-200"
                                loading="lazy"
                              />
                            )}
                            {card.code && (
                              <pre className="mt-4 bg-slate-950 text-blue-200 rounded-2xl p-4 overflow-auto text-sm leading-relaxed"><code>{card.code}</code></pre>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'practice' && (
                  <div className="space-y-6 fade-in">
                    <div className="grid gap-4">
                      {level.practice.map((item, idx) => (
                        <div key={idx} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Практический блок</span>
                          </div>
                          <div className="p-5">
                            <pre className="bg-slate-950 text-emerald-200 rounded-2xl p-4 overflow-auto text-sm leading-relaxed"><code>{item.code}</code></pre>
                            <p className="mt-4 text-slate-700 leading-relaxed">{item.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {level.extraNotes && (
                      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                        <div className="font-bold mb-2 text-lg">Важные уточнения.</div>
                        <ul className="list-disc pl-5 space-y-3">
                          {level.extraNotes.map((item, noteIdx) => (
                            <li key={noteIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                      <h4 className="font-bold text-amber-900 mb-3">Интерпретация результатов</h4>
                      <ul className="space-y-2 text-slate-800 list-disc pl-5">
                        {level.interpretation.map((point, pointIdx) => (
                          <li key={pointIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <QuizBlock levelIndex={currentLevel} level={level} answers={answers} setAnswers={setAnswers} />
                )}
              </div>

              <div className="border-t border-slate-200 px-4 md:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => switchLevel(Math.max(0, currentLevel - 1))}
                    className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={goNext}
                    className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    {currentLevel === LEVELS.length - 1 ? 'Последний уровень' : 'Следующий уровень'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
