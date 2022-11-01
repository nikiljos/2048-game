let testInterval;
let resHistory = "";
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

function stopTesting() {
    clearInterval(testInterval);
}

function updateHistory(fRes) {
    console.log(fRes);
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

function appendHistory(text){
    resHistory+=text
}

function downloadHistory() {
    var link = document.createElement("a");
    link.download = "result.csv";
    var blob = new Blob([resHistory], { type: "text/csv" });
    link.href = window.URL.createObjectURL(blob);
    link.click();
}
