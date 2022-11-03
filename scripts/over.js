let $time = document.getElementById("time");
let $maxNum = document.getElementById("max-num");
let $moves = document.getElementById("moves");

let seconds = Number(sessionStorage.getItem("time"));
let timeString = getTimeString(seconds);

$time.innerText=timeString;
$maxNum.innerText = sessionStorage.getItem("max");
$moves.innerText = sessionStorage.getItem("moves");