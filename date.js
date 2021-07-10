
// module.exports = getDate;
// module.exports.getDate = getDate;

module.exports.getDate = function() { // anonymus

// var getDate = function() {
// function getDate() {
    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    // let day = today.toLocaleDateString("en-US", options);
    // return day;

    return today.toLocaleDateString("en-US", options);
}