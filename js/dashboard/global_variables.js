// 전역 변수로 선언 (document.ready 외부)
let imageBase64Source = '';
let imageBase64Target = '';
let imageAspectRatioSource = 0;  // Source 이미지 비율
let imageAspectRatioTarget = 0;  // Target 이미지 비율

var generationsT = false;

var apiGlobalURL = "https://whyding.site"
// var apiGlobalURL = "http://127.0.0.1:8000"

// 모달
const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
    myInput.focus()
})
