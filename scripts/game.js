// The game is based on the 2048 game
// https://en.wikipedia.org/wiki/2048_(video_game)

let endNum=2048;

let res=new Array(16);

// possible combinations in 4 directions
let hCombi=[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
let vCombi=[[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]];

let hInvCombi=hCombi.map(elt=>{
    return elt.slice().reverse();
})

let vInvCombi = vCombi.map((elt) => {
    return elt.slice().reverse();
});

let gameOverStatus=false;

let bgm=new Audio("assets/bgm.mp3")
bgm.loop=true;

let cheer = new Audio("assets/cheer.mp3");

let $keypadIcon = document.getElementById("keypad-icon");
let keypadVisibility=false;

sessionStorage.setItem("win", false);

//prompt to set nickname if not set
if(localStorage.getItem("nickname")==null){
    if(confirm("Please set your name before the game starts!")){
        window.location.href="name.html";
    }
    else{
        window.location.href="index.html"
    }
}

let color = {
    2: "#E5FFF6",
    4: "#CCFFEE",
    8: "#B2FFE5",
    16: "#99FFDC",
    32: "#7FFFD4",
    64: "#66FFCB",
    128: "#4CFFC3",
    256: "#32FFBA",
    512: "#19FFB2",
    1024: "#00FFA9",
    2048: "#00FFA9",
    default:"#ffffff"
};

let moves=0;
let maxNum=2;
let startTime=new Date();

let latestScore={
    startTime,
    moves,
    maxNum,
    time
}

//add an initial 2, update dom and score
newNumber();
updateDOM();
setScore(maxNum, time, moves);

//add a new number if there are remaining spaces
function newNumber(){
    let rem=[]
    for(let i=0;i<16;i++){
        if(res[i]==undefined){
            rem.push(i)
        }
    }
    if(rem.length>0){
        let randPos = rem[Math.floor(Math.random() * rem.length)];
        res[randPos] = 2;
    }
}

//update the grid content with current value of res array
function updateDOM(){
    let box=document.querySelectorAll(".box")
    box.forEach((elt,i)=>{
        let val=res[i]
        if(val!=undefined){
            elt.innerText=val
            elt.style.backgroundColor=color[val]
        }
        else{
            elt.innerText="";
            elt.style.backgroundColor = color["default"];
        }
    })    
}

//move counter
function addMove(){
    if(moves==0){
        startTimer();
    }
    let $moves=document.getElementById("moves")
    moves++;
    $moves.innerText=moves;
}

// process merge of a singler row/col
function merge(arr){
    let change=false
    let len=0;
    let res1 = [];
    let allUndef=true
    //shit all elemetns to end
    for (let i = 0; i < 4; i++) {
        if (arr[i] != undefined) {
            allUndef=false
            // find last defined position
            len=i+1;
            res1.push(arr[i]);
        }
    }
    if(res1.length!=len||allUndef){
        change=true;
    }
    let res2=[];
    // add nearby elts with same value
    for(let i = 0; i <4; i++){
        if(res1[i]==res1[i+1]&&res1[i]!=undefined){
            res2.push(res1[i] * 2);
            change=true;
            i++;
        }
        else{
            res2.push(res1[i])
        }
    }
    return {
        fragment:res2,
        change
    };
}

//find out the movement result in the given direction
function updateSum(direction){
    let tempRes=res.slice();
    let change=false;
    let fullCombi;
    switch(direction){
        case "Left":
            fullCombi=hCombi;
            break;
        case "Right":
            fullCombi=hInvCombi;
            break;
        case "Up":
            fullCombi=vCombi;
            break;
        case "Down":
            fullCombi=vInvCombi;
            break;
        default:
            return;
    }
    fullCombi.forEach(combi=>{
        let toMerge=[];
        combi.forEach((elt,i)=>{
            toMerge[i]=res[elt]
        })
        let newRes=merge(toMerge);
        let newResFragment=newRes.fragment;
        if(newRes.change){
            change=true
        };
        combi.forEach((elt,i)=>{
            tempRes[elt] = newResFragment[i];
        })
    })
    return {
        change,
        newResult:tempRes
    }
}

//update the max value reached if there is a change
function updateMax(){
    let tempMax=maxNum;
    res.forEach(elt=>{
        if(elt>tempMax){
            tempMax=elt;
        }
    })
    if(tempMax>maxNum){

        cheer.play();

        maxNum=tempMax;
        setScore(maxNum,time,moves);

        let $maxNum = document.getElementById("max-num");
        $maxNum.innerText = maxNum;

        if(maxNum==endNum){
            sessionStorage.setItem("win", true);
            endGame();
        }
    }
    
}

//check new update possibility after each move
function checkUpdateChance(){

    let options = ["Down", "Up", "Right","Left"];
    let chance=options.some(direction=>{
        let update = updateSum(direction);
        return update.change
    })
    return chance
}

//initiate number movements based on input direction 
function playMove(direction){
    if(gameOverStatus){
        return;
    }
    keyColor(direction);
    addMove();
    let newRes = updateSum(direction);
    if (newRes.change) {
        res = newRes.newResult;
        newNumber();
        updateMax();
        updateDOM();
        if (testing) {
            appendHistory(`${getTimeString(time)},${moves},${direction}\n`);
            updateHistory(res);
        }
    }
    let playChance = checkUpdateChance();
    if (!playChance) {
        endGame();
    }
}

//change onscreen keycolor to white while clicking the arrows
async function keyColor(direction){
    if(!keypadVisibility){
        return
    }
    let $key = document.querySelector(`.key-box[data-dir="${direction}"]`);
    $key.style.backgroundColor="#fefefe"
    setTimeout(()=>{
       $key.style.backgroundColor = ""; 
    },150)
}

//update score in session storage when a new number id reached
function setScore(max,timeTaken,movesTaken){
    sessionStorage.setItem("moves",movesTaken);
    sessionStorage.setItem("time", timeTaken);
    sessionStorage.setItem("max", max);

    latestScore.maxNum=max;
    latestScore.moves=movesTaken;
    latestScore.time=timeTaken;
}

// update history when game ends
function setHistory(){
    let prev=localStorage.getItem("history")
    let history;
    if (prev == null || prev.length < 10) {
        history = new Array();
    } else {
        history = JSON.parse(prev);
    }
    history=history.slice(0,9);
    //push to first index
    history.unshift(latestScore)
    let newHistory=JSON.stringify(history)
    localStorage.setItem("history",newHistory)
}

//on game end, set history and reditrect
function endGame(){
    if(testing){
        downloadHistory();
    }
    gameOverStatus=true;
    setHistory();
    window.location.href="over.html"
}

//listen to arrow key press
document.addEventListener("keyup",e=>{
    let key=e.key;
    if(key.startsWith("Arrow")){
        e.preventDefault();
        let direction=key.substring(5)
        playMove(direction); 
    }
})

//prevent scroll on space and arrow keys
document.addEventListener("keydown",e=>{
    if(e.key.startsWith("Arrow")||e.key==" "){
        e.preventDefault();
    }
})

//trigger move handler on arrow key press
document.getElementById("keypad").onclick=(e)=>{
    if(e.target.matches(".key-box img")){
        let direction=e.target.parentElement.dataset.dir;
        playMove(direction); 
    }
}

//trigger  move handler in onscreen key press
document.getElementById("keypad-toggle").onclick=()=>{
    let $keypad=document.getElementById("keypad");
    let currentKeypad = getComputedStyle($keypad).display;
    //adding hide class doesn't work as it conflicts with touchscreen media query
    if(currentKeypad=="block"){
        $keypad.style.display="none"
        keypadVisibility=false;
        $keypadIcon.setAttribute("src", "assets/keyboard.png");
    }
    else{
        $keypad.style.display = "block";
        keypadVisibility=true;
        $keypadIcon.setAttribute("src", "assets/keyhide.png");
    }
}

//change keypad trigger logo to hide in touch devices
if(window.matchMedia("(hover: none)").matches){
    keypadVisibility=true;
    $keypadIcon.setAttribute("src","assets/keyhide.png")
}

//bgm mute and unmute
document.getElementById("music-toggle").onclick=()=>{
    let $musicImg=document.getElementById("music-img")
    if(bgm.paused){
        bgm.play();
        $musicImg.setAttribute("src","assets/mute.png");
    }
    else{
        bgm.pause();
        $musicImg.setAttribute("src", "assets/speaker.png");
    }
}

//game restart button click handler
document.getElementById("replay").onclick = () => {
    if(confirm("Are you sure you want to restart the game?")){
        window.location.reload();
    }
};

//go home button click handler
document.getElementById("home").onclick = () => {
    if (confirm("Are you sure you want to stop playing and go home?")) {
        window.location.href="index.html";
    }
};