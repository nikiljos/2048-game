let $table=document.querySelector("table");

let prev = localStorage.getItem("history");
let history;
if (prev == null||prev.length<10) {
    history = new Array();
    document.getElementById("nothing-prompt").classList.remove("hide");
} else {
    history = JSON.parse(prev);
}

history.forEach(elt=>{
    let $row=document.createElement("tr");
    let $maxNum=document.createElement("td");
    let $moves=document.createElement("td");
    let $time=document.createElement("td");
    // let $startTime = document.createElement("td");

    $maxNum.innerText=elt.maxNum;
    $moves.innerText = elt.moves;
    $time.innerText = getTimeString(Number(elt.time));
    // $startTime.innerText = new Date(elt.startTime).toLocaleString();

    $row.append($maxNum,$moves,$time);
    $table.append($row)
})