let endNum=2048;

let res=new Array(16);
let hCombi=[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
let vCombi=[[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]];

let hInvCombi=hCombi.map(elt=>{
    return elt.slice().reverse();
})
// console.log({hCombi,hInvCombi})
let vInvCombi = vCombi.map((elt) => {
    return elt.slice().reverse();
});

let gameOverStatus=false;

let bgm=new Audio("assets/bgm.mp3")
bgm.loop=true;

let cheer = new Audio("assets/cheer.mp3");

sessionStorage.setItem("win", false);

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

newNumber();
updateDOM();
setScore(maxNum, time, moves);

function newNumber(){
    let rem=[]
    for(let i=0;i<16;i++){
        if(res[i]==undefined){
            rem.push(i)
        }
    }
    if(rem.length==0){
        console.log("Max filled")
    }
    else{
        let randPos = rem[Math.floor(Math.random() * rem.length)];
        console.log("New Number",rem.length, randPos);
        res[randPos] = 2;
    }
}

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

function addMove(){
    if(moves==0){
        startTimer();
    }
    let $moves=document.getElementById("moves")
    moves++;
    $moves.innerText=moves;
}

function merge(arr){
    // console.log(arr)
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
    // console.log({arr,res2})
    return {
        fragment:res2,
        change
    };
}

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
        // console.log(newResFragment,res)
        combi.forEach((elt,i)=>{
            tempRes[elt] = newResFragment[i];
        })
    })
    return {
        change,
        newResult:tempRes
    }
}

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

function checkUpdateChance(){

    let options = ["Down", "Up", "Right","Left"];
    let chance=options.some(direction=>{
        let update = updateSum(direction);
        console.log("Chance Check: ",direction,update);
        return update.change
    })
    return chance
}

function playMove(direction){
    if(gameOverStatus){
        return;
    }
    console.clear();
    addMove();
    let newRes = updateSum(direction);
    if (newRes.change) {
        res = newRes.newResult;
        console.log({ res });
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
        // alert("It is over dude🥲 nere chovve nokk!");
        endGame();
    }
    console.log("Play Chance: ", playChance);
}

function setScore(max,timeTaken,movesTaken){
    sessionStorage.setItem("moves",movesTaken);
    sessionStorage.setItem("time", timeTaken);
    sessionStorage.setItem("max", max);

    latestScore.maxNum=max;
    latestScore.moves=movesTaken;
    latestScore.time=timeTaken;
}

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

document.getElementById("keypad").onclick=(e)=>{
    if(e.target.matches(".key-box")){
        let direction=e.target.dataset.dir;
        playMove(direction); 
    }
}

let $keypadIcon=document.getElementById("keypad-icon")
document.getElementById("keypad-toggle").onclick=()=>{
    let $keypad=document.getElementById("keypad");
    let currentKeypad = getComputedStyle($keypad).display;
    //adding hide class doesn't work as it conflicts with touchscreen media query
    if(currentKeypad=="block"){
        $keypad.style.display="none"
        $keypadIcon.setAttribute("src", "assets/keyboard.png");
    }
    else{
        $keypad.style.display = "block";
        $keypadIcon.setAttribute("src", "assets/keyhide.png");
    }
}

if(window.matchMedia("(hover: none)").matches){
    $keypadIcon.setAttribute("src","assets/keyhide.png")
}

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

document.getElementById("replay").onclick = () => {
    if(confirm("Are you sure you want to restart the game?")){
        window.location.reload();
    }
};

document.getElementById("home").onclick = () => {
    if (confirm("Are you sure you want to stop playing and go home?")) {
        window.location.href="index.html";
    }
};