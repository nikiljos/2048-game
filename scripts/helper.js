function getTimeString(seconds) {
    let min = Math.floor(seconds / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
    });
    let sec = (seconds % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
    });
    return `${min}:${sec}`;
}