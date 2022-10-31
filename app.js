let res=new Array(16);
let hCombi=[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
let vCombi=[[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]];

let hInvCombi=hCombi.map(elt=>{
    return elt.slice().reverse();
})
let vInvCombi = vCombi.map((elt) => {
    return elt.slice().reverse();
});

// console.log(hCombi,hInvCombi)

function newNumber(){
    let rem=[]
    for(let i=0;i<16;i++){
        // console.log(i)
        if(res[i]==undefined){
            rem.push(i)
        }
    }
    if(rem.length==0){
        console.log("Max filled")
    }
    else{
        let randPos = rem[Math.floor(Math.random() * rem.length)];
        console.log(rem.length, randPos);
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
    let res = [];
    //shit all elemetns to end
    for (let i = 0; i < 4; i++) {
        if (arr[i] != undefined) {
            res.push(arr[i]);
        }
    }
    let res2=[]
    // add nearby elts with same value
    for(let i = 0; i <4; i++){
        if(res[i]==res[i+1]&&res[i]!=undefined){
            res2.push(res[i] * 2);
            i++;
        }
        else{
            res2.push(res[i])
        }
    }
    return res2;
}

function updateSum(direction){
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
        let newResFragment=merge(toMerge);
        console.log(newResFragment,res)
        combi.forEach((elt,i)=>{
            res[elt] = newResFragment[i];
        })
    })
}

document.addEventListener("keyup",e=>{
    let key=e.key;
    if(key.startsWith("Arrow")){
        let direction=key.substring(5)
        // console.log()
        updateSum(direction);
        newNumber();
        updateDOM();
    }
})