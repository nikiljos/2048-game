//this file will be imported and these functions will be triggered
//only if the value of testing is set to true in env.js 

let testInterval;
let resHistory = "";

//trigger random arrow key presses
function autoPlay() {
    testInterval = setInterval(() => {
        let options = ["Down", "Up", "Right", "Left"];
        let key = options[Math.floor(Math.random() * options.length)];
        console.log("Clicking", key);
        document.dispatchEvent(
            new KeyboardEvent("keyup", { key: `Arrow${key}` })
        );
    }, 100);
}

//stop random keypresses
function stopTesting() {
    clearInterval(testInterval);
}

//add the given res to history
function updateHistory(fRes) {
    hCombi.forEach((elt) => {
        elt.forEach((pos) => {
            let val = fRes[pos];
            if (val == undefined) {
                val = "-";
            }
            resHistory += `${val},`;
        });
        resHistory += "\n";
    });
    resHistory += "\n";
}

// append strings to csv output
function appendHistory(text){
    resHistory+=text
}

//download the value of resHistory as a csv
function downloadHistory() {
    let now = new Date();
    let date = now.toDateString().split(" ");
    let time = now.toLocaleTimeString().split(":").join("-");
    let dateString = `${date[2]}-${date[1]} ${time}`;
    let link = document.createElement("a");
    link.download = `GamePlay ${dateString}.csv`;
    let blob = new Blob([resHistory], { type: "text/csv" });
    link.href = window.URL.createObjectURL(blob);
    link.click();
}
