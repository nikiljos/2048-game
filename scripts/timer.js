let $timer=document.getElementById("timer")

let time=0;
let timer;

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