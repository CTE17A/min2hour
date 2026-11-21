document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const charCount = document.getElementById('char-count');
  const resHm = document.getElementById('res-hm');
  const resDec = document.getElementById('res-dec');

  let currentInput = '0';

  function updateCalculator() {
    display.textContent = currentInput;
    charCount.textContent = `${currentInput === '0' ? 0 : currentInput.length} симв.`;

    const numericValue = parseFloat(currentInput.replace(',', '.')) || 0;

    // 1. Формат "0 ч 00 мин"
    const hours = Math.floor(numericValue / 60);
    const minutes = Math.round(numericValue % 60);
    const paddedMin = String(minutes).padStart(2, '0');
    resHm.textContent = `${hours} ч ${paddedMin} мин`;

    // 2. Формат десятичных часов "0 ч"
    const decimalHours = +(numericValue / 60).toFixed(2);
    resDec.textContent = `${String(decimalHours).replace('.', ',')} ч`;
  }

  // Нажатие на цифры и запятую
  document.querySelectorAll('.key[data-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      if (val === ',') {
        if (!currentInput.includes(',')) currentInput += ',';
      } else {
        currentInput = currentInput === '0' ? val : currentInput + val;
      }
      updateCalculator();
    });
  });

  // Пресеты (+15, +30, +45, +60)
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const add = Number(btn.dataset.add);
      const currentNum = parseFloat(currentInput.replace(',', '.')) || 0;
      currentInput = String(currentNum + add).replace('.', ',');
      updateCalculator();
    });
  });

  // Очистка (C) и Стереть (⌫)
  document.getElementById('btn-clear').addEventListener('click', () => {
    currentInput = '0';
    updateCalculator();
  });

  document.getElementById('btn-backspace').addEventListener('click', () => {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    updateCalculator();
  });

  // Кнопки "Копировать"
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetEl = document.getElementById(btn.dataset.target);
      navigator.clipboard.writeText(targetEl.textContent).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Скопировано!';
        setTimeout(() => btn.textContent = originalText, 1200);
      });
    });
  });
});
