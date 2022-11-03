let $timer=document.getElementById("timer")

let time=0;
let timer;

function getTimeString(seconds){
    let min = Math.floor(seconds / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
    });
    let sec = (seconds % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
    });
    return `${min}:${sec}`;
}

function startTimer(){
    timer = setInterval(() => {
        time++;
        let timeString = getTimeString(time);
        $timer.innerText = timeString;
    }, 1000);
}

function stopTimer(){
    clearInterval(timer)
}