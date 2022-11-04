let $status = document.getElementById("status");
let $time = document.getElementById("time");
let $maxNum = document.getElementById("max-num");
let $moves = document.getElementById("moves");
let $comment=document.getElementById("comment")

let comments=[
    "Nice play",
    "Great moves",
    "Cool work"
]

let winStatus = sessionStorage.getItem("win");
if(winStatus=="true"){
    $status.innerText="You Won 🎉"
}

let randomComment=comments[Math.floor(Math.random()*comments.length)]
let userNickName=localStorage.getItem("nickname");
$comment.innerText=`${randomComment}, ${userNickName}`

let seconds = Number(sessionStorage.getItem("time"));
let timeString = getTimeString(seconds);
$time.innerText = timeString;
$maxNum.innerText = sessionStorage.getItem("max");
$moves.innerText = sessionStorage.getItem("moves");