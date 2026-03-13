console.log("Credit Card Validator loaded");

// Алгоритм Луна
export function validateCardNumber(number) {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
}

// Определение платёжной системы
export function getPaymentSystem(number) {
    const digits = number.replace(/\D/g, '');
    
    if (digits.startsWith('2')) return 'mir';
    if (digits.startsWith('34') || digits.startsWith('37')) return 'amex';
    if (digits.startsWith('4')) return 'visa';
    if (digits.startsWith('5') && digits[1] >= '1' && digits[1] <= '5') return 'mastercard';
    if (digits.startsWith('6011') || digits.startsWith('65') ||
        digits.startsWith('644') || digits.startsWith('645') || 
        digits.startsWith('646') || digits.startsWith('647') || 
        digits.startsWith('648') || digits.startsWith('649')) return 'discover';
    if (digits.startsWith('35') && 
        parseInt(digits.substring(2,4)) >= 28 && 
        parseInt(digits.substring(2,4)) <= 89) return 'jcb';
    
    return 'unknown';
}

// Основная логика (для браузера)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('form');
        const input = document.getElementById('card-input');
        const resultDiv = document.getElementById('result');
        const icons = document.querySelectorAll('.card-icon');

        function highlightSystem(system) {
            icons.forEach(icon => {
                icon.classList.remove('active');
                if (icon.dataset.system === system) {
                    icon.classList.add('active');
                }
            });
        }

        function showResult(message, isSuccess) {
            resultDiv.textContent = message;
            resultDiv.className = isSuccess ? 'success visible' : 'error visible';
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const number = input.value.trim();
            if (!number) {
                showResult('Введите номер карты', false);
                highlightSystem('unknown');
                return;
            }

            const isValid = validateCardNumber(number);
            const system = getPaymentSystem(number);
            
            if (isValid) {
                const systemNames = {
                    'visa': 'Visa',
                    'mastercard': 'MasterCard',
                    'mir': 'МИР',
                    'amex': 'American Express',
                    'discover': 'Discover',
                    'jcb': 'JCB',
                    'unknown': 'неизвестная система'
                };
                showResult(`Карта действительна (${systemNames[system]})`, true);
            } else {
                showResult('Недействительный номер карты', false);
            }
            
            highlightSystem(system);
        });

        input.addEventListener('input', () => {
            const number = input.value.trim();
            const system = number ? getPaymentSystem(number) : 'unknown';
            highlightSystem(system);
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    });
}