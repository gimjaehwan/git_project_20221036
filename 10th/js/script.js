const display = document.getElementById("display"); // 화면에 표시할 요소를 가져옵니다.
const buttons = document.querySelectorAll("button"); // 계산기 버튼을 모두 가져옵니다.
const audioContext = new window.AudioContext(); // 버튼 효과음을 생성할 오디오 환경을 준비합니다.
let currentValue = "0"; // 현재 입력 중인 숫자를 저장합니다.
let savedValue = null; // 연산을 위해 저장한 숫자를 관리합니다.
let savedOperator = null; // 선택한 연산자를 관리합니다.
let shouldStartNewValue = false; // 다음 숫자 입력에서 화면을 새로 시작할지 관리합니다.
// 지정한 음높이와 파형으로 짧은 버튼 효과음을 재생합니다.
function playTone(frequency, waveform, delay) { // 버튼 종류에 맞는 음을 생성합니다.
const oscillator = audioContext.createOscillator(); // 소리를 만드는 발진기를 생성합니다.
const volume = audioContext.createGain(); // 소리 크기를 부드럽게 조절합니다.
const startTime = audioContext.currentTime + delay; // 앞선 음과 겹치지 않도록 시작 시간을 정합니다.
oscillator.type = waveform; // 효과음의 음색을 설정합니다.
oscillator.frequency.setValueAtTime(frequency, startTime); // 효과음의 음높이를 설정합니다.
volume.gain.setValueAtTime(0.0001, startTime); // 클릭 잡음 방지를 위해 작은 음량에서 시작합니다.
volume.gain.exponentialRampToValueAtTime(0.12, startTime + 0.012); // 짧게 음량을 올립니다.
volume.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.14); // 자연스럽게 음량을 줄입니다.
oscillator.connect(volume); // 발진기 출력을 음량 조절기에 연결합니다.
volume.connect(audioContext.destination); // 음량 조절기를 스피커 출력에 연결합니다.
oscillator.start(startTime); // 효과음을 재생합니다.
oscillator.stop(startTime + 0.15); // 재생 후 발진기를 정리합니다.
} // 효과음 생성 함수를 끝냅니다.
// 버튼 동작에 따라 서로 다른 효과음을 재생합니다.
function playButtonSound(button) { // 누른 버튼의 종류와 값으로 음을 고릅니다.
if (audioContext.state === "suspended") audioContext.resume(); // 브라우저가 오디오를 일시 중지했으면 사용자 입력에 맞춰 다시 시작합니다.
if (button.dataset.number !== undefined) { // 숫자 버튼이면 숫자마다 다른 높이의 음을 냅니다.
playTone(300 + Number(button.dataset.number) * 32, "sine", 0); // 숫자 입력용 맑은 음을 재생합니다.
return; // 숫자 버튼 음을 재생했으므로 마칩니다.
} // 숫자 버튼 음 처리를 끝냅니다.
if (button.dataset.operator !== undefined) { // 연산자 버튼이면 연산마다 다른 음을 냅니다.
const tones = { "+": 620, "-": 470, "*": 740, "/": 540 }; // 연산자별 음높이를 지정합니다.
playTone(tones[button.dataset.operator], "triangle", 0); // 연산자 선택용 음을 재생합니다.
return; // 연산자 버튼 음을 재생했으므로 마칩니다.
} // 연산자 버튼 음 처리를 끝냅니다.
if (button.dataset.action === "clear") { // 초기화 버튼이면 아래로 내려가는 두 음을 냅니다.
playTone(520, "sawtooth", 0); // 초기화 효과음의 첫 음을 재생합니다.
playTone(350, "sawtooth", 0.07); // 초기화 효과음의 낮은 끝음을 재생합니다.
return; // 초기화 버튼 음을 재생했으므로 마칩니다.
} // 초기화 버튼 음 처리를 끝냅니다.
playTone(660, "sine", 0); // 계산 결과용 화음의 첫 음을 재생합니다.
playTone(880, "sine", 0.035); // 계산 결과용 화음의 높은 음을 재생합니다.
} // 버튼 효과음 함수를 끝냅니다.
// 계산 결과를 화면에 표시합니다.
function showValue(value) { // 전달받은 값을 화면과 현재 값에 반영합니다.
currentValue = String(value); // 계산기 상태를 문자열로 통일합니다.
display.textContent = currentValue; // 현재 값을 화면에 표시합니다.
} // 화면 표시 함수를 끝냅니다.
// 현재 저장된 연산을 두 숫자에 적용합니다.
function calculate(firstValue, secondValue, operator) { // 사칙연산 결과를 반환합니다.
if (operator === "+") return firstValue + secondValue; // 두 숫자를 더합니다.
if (operator === "-") return firstValue - secondValue; // 두 숫자를 뺍니다.
if (operator === "*") return firstValue * secondValue; // 두 숫자를 곱합니다.
if (operator === "/") return secondValue === 0 ? null : firstValue / secondValue; // 0으로 나누지 않도록 확인한 뒤 나눕니다.
return secondValue; // 연산자가 없으면 두 번째 숫자를 반환합니다.
} // 사칙연산 함수를 끝냅니다.
// 누른 숫자를 현재 입력 값에 추가합니다.
function enterNumber(number) { // 숫자 버튼 입력을 처리합니다.
if (shouldStartNewValue || currentValue === "0" || currentValue === "오류") { // 새 숫자를 입력해야 하는지 확인합니다.
showValue(number); // 새 숫자로 현재 값을 바꿉니다.
shouldStartNewValue = false; // 이어서 입력할 수 있도록 상태를 갱신합니다.
return; // 기존 숫자에 추가하지 않고 함수를 마칩니다.
} // 새 숫자 입력 처리를 끝냅니다.
showValue(currentValue + number); // 기존 숫자 뒤에 새 숫자를 붙입니다.
} // 숫자 입력 함수를 끝냅니다.
// 연산자 버튼 입력을 처리합니다.
function chooseOperator(operator) { // 연산자를 저장하고 필요한 계산을 수행합니다.
const number = Number(currentValue); // 현재 입력을 숫자로 변환합니다.
if (savedOperator !== null && !shouldStartNewValue) { // 이전 연산 결과가 필요한지 확인합니다.
const result = calculate(savedValue, number, savedOperator); // 저장된 연산을 실행합니다.
if (result === null || !Number.isFinite(result)) { // 0 나누기나 유효하지 않은 결과인지 확인합니다.
showValue("오류"); // 계산 오류를 화면에 표시합니다.
savedValue = null; // 저장한 숫자를 초기화합니다.
savedOperator = null; // 저장한 연산자를 초기화합니다.
shouldStartNewValue = true; // 다음 숫자 입력을 새로 시작하게 합니다.
return; // 오류 처리 후 함수를 마칩니다.
} // 계산 결과 확인을 끝냅니다.
showValue(result); // 중간 계산 결과를 화면에 표시합니다.
savedValue = result; // 중간 계산 결과를 다음 연산에 저장합니다.
} else { // 첫 연산이거나 연속으로 연산자를 누른 경우입니다.
savedValue = number; // 현재 숫자를 연산용으로 저장합니다.
} // 저장할 숫자 선택을 끝냅니다.
savedOperator = operator; // 새 연산자를 저장합니다.
shouldStartNewValue = true; // 다음 숫자 입력에서 새 숫자를 시작합니다.
} // 연산자 입력 함수를 끝냅니다.
// 현재 계산을 완료합니다.
function showResult() { // 저장된 연산이 있을 때 결과를 계산합니다.
if (savedOperator === null || savedValue === null) return; // 실행할 연산이 없으면 그대로 둡니다.
const result = calculate(savedValue, Number(currentValue), savedOperator); // 저장한 숫자와 현재 숫자로 계산합니다.
if (result === null || !Number.isFinite(result)) { // 0 나누기나 유효하지 않은 결과인지 확인합니다.
showValue("오류"); // 계산 오류를 화면에 표시합니다.
} else { // 계산 결과가 정상인 경우입니다.
showValue(Number(result.toPrecision(12))); // 불필요한 부동 소수점 오차 표시를 줄입니다.
} // 계산 결과 표시를 마칩니다.
savedValue = null; // 저장한 숫자를 초기화합니다.
savedOperator = null; // 저장한 연산자를 초기화합니다.
shouldStartNewValue = true; // 다음 입력은 새 계산으로 시작하게 합니다.
} // 계산 완료 함수를 끝냅니다.
// 모든 버튼 클릭을 알맞은 동작으로 연결합니다.
buttons.forEach(function (button) { // 각 버튼에 클릭 처리를 등록합니다.
button.addEventListener("click", function () { // 버튼을 누르면 해당 동작을 실행합니다.
playButtonSound(button); // 버튼의 종류에 맞는 효과음을 재생합니다.
if (button.dataset.number !== undefined) enterNumber(button.dataset.number); // 숫자 버튼이면 숫자를 입력합니다.
if (button.dataset.operator !== undefined) chooseOperator(button.dataset.operator); // 연산자 버튼이면 연산을 선택합니다.
if (button.dataset.action === "equals") showResult(); // 등호 버튼이면 계산 결과를 표시합니다.
if (button.dataset.action === "clear") { // Clear 버튼이면 모든 계산 상태를 지웁니다.
savedValue = null; // 저장한 숫자를 초기화합니다.
savedOperator = null; // 저장한 연산자를 초기화합니다.
shouldStartNewValue = false; // 새 숫자 입력 상태를 기본값으로 설정합니다.
showValue("0"); // 화면을 0으로 되돌립니다.
} // Clear 버튼 처리를 끝냅니다.
}); // 버튼 클릭 이벤트 등록을 끝냅니다.
}); // 모든 버튼 연결을 끝냅니다.
