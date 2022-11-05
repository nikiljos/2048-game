let $table=document.querySelector("table");
let $clearHistory=document.getElementById("clear-history")

let prev = localStorage.getItem("history");
let history;
if (prev == null||prev.length<10) {
    history = new Array();
    document.getElementById("nothing-prompt").classList.remove("hide");
    $clearHistory.style.display="none";
} else {
    history = JSON.parse(prev);
}

//render all hostory to the table
history.forEach(elt=>{
    let $row=document.createElement("tr");
    let $maxNum=document.createElement("td");
    let $moves=document.createElement("td");
    let $time=document.createElement("td");

    $maxNum.innerText=elt.maxNum;
    $moves.innerText = elt.moves;
    $time.innerText = getTimeString(Number(elt.time));

    $row.append($maxNum,$moves,$time);
    $table.append($row)
})

$clearHistory.onclick=()=>{
    if(confirm("Are you sure you want to clear your history?")){
        localStorage.removeItem("history");
        window.location.reload()
    }
}