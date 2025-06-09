/**
 * Скрипт для обработки контекстной помощи и управления интерфейсом
 */
document.addEventListener("DOMContentLoaded", () => {
    // Инициализация контекстной помощи
    initContextHelp();
    
    // Инициализация карты Карно
    initKarnaughMap();
    
    // Инициализация виртуальной клавиатуры
    initKeyboard();
    
    // Инициализация кнопки поддержки
    initSupportButton();
});

/**
 * Инициализация системы контекстной помощи
 */
function initContextHelp() {
    let lastHoveredElement = null;
    let lastFocusedElement = null;

    // Сохраняем элемент, на который навели мышку
    document.body.addEventListener("mouseover", (e) => {
        if (e.target.dataset.help) {
            lastHoveredElement = e.target;
        }
    });

    // Убираем, когда мышка уходит
    document.body.addEventListener("mouseout", (e) => {
        if (lastHoveredElement === e.target) {
            lastHoveredElement = null;
        }
    });

    // Сохраняем элемент, на котором фокус (например, input)
    document.body.addEventListener("focusin", (e) => {
        if (e.target.dataset.help) {
            lastFocusedElement = e.target;
        }
    });

    // Убираем фокус
    document.body.addEventListener("focusout", (e) => {
        if (lastFocusedElement === e.target) {
            lastFocusedElement = null;
        }
    });

    // Обработка нажатия F1
    document.addEventListener("keydown", (e) => {
        if (e.key === "F1") {
            e.preventDefault();

            let helpText = "";

            // Сначала проверим фокус, потом ховер
            if (lastFocusedElement?.dataset.help) {
                helpText = lastFocusedElement.dataset.help;
            } else if (lastHoveredElement?.dataset.help) {
                helpText = lastHoveredElement.dataset.help;
            }

            // Показать справку
            if (helpText) {
                alert("Справка: " + helpText);
            }
        }
    });

    // Инициализация справочной кнопки
    const helpButton = document.getElementById("helpButton");
    if (helpButton) {
        helpButton.addEventListener("click", () => {
            // Открываем справочный документ в новой вкладке
            window.open("/UserHelp/vvedenie.htm", "_blank");
        });
    }
}

/**
 * Инициализация навигации по карте Карно
 */
function initKarnaughMap() {
    const steps = document.querySelectorAll('.karnaugh-step');
    if (steps.length === 0) return;
    
    let currentStep = steps.length - 1; // Показываем последний шаг при загрузке
    
    function showStep(step) {
        steps.forEach((s, i) => s.style.display = i === step ? 'block' : 'none');
        const stepIndicator = document.getElementById('currentStep');
        if (stepIndicator) {
            stepIndicator.textContent = step + 1;
        }
    }

    window.nextStep = function() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    };

    window.prevStep = function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    };
    
    // Показать текущий шаг при загрузке
    showStep(currentStep);
}

/**
 * Инициализация виртуальной клавиатуры
 */
function initKeyboard() {
    const toggleKeyboardBtn = document.getElementById('toggleKeyboard');
    const keyboard = document.getElementById('keyboard');
    const inputField = document.getElementById('inputField');
    
    if (!toggleKeyboardBtn || !keyboard) return;
    
    // Проверяем состояние из localStorage при загрузке
    if (localStorage.getItem("keyboardVisible") === "false") {
        keyboard.style.display = "none";
        toggleKeyboardBtn.innerText = "Показать клавиатуру";
    } else {
        keyboard.style.display = "grid";
        toggleKeyboardBtn.innerText = "Скрыть клавиатуру";
    }
    
    // Обработка переключения видимости клавиатуры
    toggleKeyboardBtn.addEventListener('click', () => {
        const isVisible = keyboard.style.display !== 'none';
        keyboard.style.display = isVisible ? 'none' : 'grid';
        toggleKeyboardBtn.textContent = isVisible ? 'Показать клавиатуру' : 'Скрыть клавиатуру';
        localStorage.setItem("keyboardVisible", isVisible ? "false" : "true");
    });
    
    // Обработка нажатий на клавиши
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (inputField) {
                const symbol = key.textContent;
                const start = inputField.selectionStart;
                const end = inputField.selectionEnd;
                const value = inputField.value;
                
                inputField.value = value.substring(0, start) + symbol + value.substring(end);
                inputField.focus();
                inputField.setSelectionRange(start + symbol.length, start + symbol.length);
            }
        });
    });
}

/**
 * Инициализация кнопки поддержки
 */
function initSupportButton() {
    const helpButton = document.getElementById('helpButton');
    const supportText = document.getElementById('supportText');
    
    if (!helpButton || !supportText) return;
    
    helpButton.addEventListener('click', () => {
        const isVisible = supportText.style.display !== 'none';
        supportText.style.display = isVisible ? 'none' : 'block';
    });
}

/**
 * Функция для переключения видимости подсказок
 * (Объявляется в глобальной области видимости для использования в HTML)
 */
window.toggleHint = function(hintId) {
    const hint = document.getElementById(hintId);
    if (hint) {
        hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
    }
};

