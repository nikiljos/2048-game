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

newNumber();
updateDOM();
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
        }
        else{
            elt.innerText="";
        }
    })    
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

function checkUpdateChance(){

    let options = ["Down", "Up", "Right","Left"];
    let chance=options.some(direction=>{
        let update = updateSum(direction);
        console.log("Chance Check: ",direction,update);
        return update.change
    })
    return chance
}

document.addEventListener("keyup",e=>{
    let key=e.key;
    if(key.startsWith("Arrow")){
        console.clear();
        let direction=key.substring(5)
        // console.log()
        let newRes=updateSum(direction);
        if(newRes.change){
            res=newRes.newResult;
            console.log({res})
            newNumber();
            updateDOM();
            if(testing){
                appendHistory(`${key}\n`)
                updateHistory(res);
            }
        }
        let playChance = checkUpdateChance();
        if (!playChance){
            alert("Is it over dude? nere chovve nokk!")
        }
        console.log("Play Chance: ", playChance);
    }
})