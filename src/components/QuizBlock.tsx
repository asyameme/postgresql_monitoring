import type { QuizBlockProps } from '../types';

export function QuizBlock({ levelIndex, level, answers, setAnswers }: QuizBlockProps) {
  const localAnswers = answers[levelIndex] || {};
  const correctCount = level.quiz.filter((q, idx) => localAnswers[idx] === q.correct).length;
  const allAnswered = Object.keys(localAnswers).length === level.quiz.length;
  const passed = correctCount === level.quiz.length;

  const choose = (qIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [levelIndex]: {
        ...(prev[levelIndex] || {}),
        [qIndex]: optionIndex
      }
    }));
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-blue-900">Результат самопроверки</div>
          <div className="text-sm text-slate-700">Правильных ответов: {correctCount} из {level.quiz.length}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${passed ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-700 border border-slate-200'}`}>
          {passed ? 'Уровень зачтён' : allAnswered ? 'Нужна доработка' : 'Ответьте на вопросы'}
        </div>
      </div>

      {level.quiz.map((item, qIndex) => {
        const selected = localAnswers[qIndex];
        const isAnswered = selected !== undefined;
        const isCorrect = selected === item.correct;

        return (
          <div key={qIndex} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-2">Вопрос {qIndex + 1}</div>
            <h4 className="text-lg font-bold mb-4 text-slate-900">{item.q}</h4>

            <div className="grid gap-3">
              {item.options.map((option, optionIndex) => {
                const active = selected === optionIndex;
                const isCorrectOption = optionIndex === item.correct;
                const shouldMarkCorrect = isAnswered && isCorrectOption;
                const shouldMarkWrong = active && !isCorrect;

                return (
                  <div key={optionIndex}>
                    <button
                      onClick={() => choose(qIndex, optionIndex)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        shouldMarkCorrect
                          ? 'border-emerald-400 bg-emerald-50'
                          : shouldMarkWrong
                            ? 'border-red-300 bg-red-50'
                            : active
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      } ${isAnswered ? 'cursor-default' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-medium">{option.text}</span>
                        {isAnswered && isCorrectOption && (
                          <span className="text-emerald-600 font-bold">✓</span>
                        )}
                        {isAnswered && active && !isCorrect && (
                          <span className="text-red-600 font-bold">✗</span>
                        )}
                      </div>
                    </button>

                    {isAnswered && (
                      <div className={`mt-2 ml-4 p-3 rounded-lg text-sm ${
                        isCorrectOption
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : active
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {isCorrectOption && (
                          <span className="font-bold">Правильно: </span>
                        )}
                        {active && !isCorrect && (
                          <span className="font-bold">Ваш выбор: </span>
                        )}
                        {!active && !isCorrectOption && (
                          <span className="font-bold text-slate-600">Неверно: </span>
                        )}
                        {option.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`mt-4 rounded-xl p-4 text-sm ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
                <div className="font-bold mb-1">{isCorrect ? 'Отлично!' : 'Попробуйте ещё раз'}</div>
                <div>Правильный ответ: {item.options[item.correct].text}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
