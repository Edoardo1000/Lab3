// This script adjusts the Wavegen offset based on Scope measurement.
clear();
if (!('Wavegen' in this) || !('Scope' in this)) throw "Please open a Scope and a Wavegen instrument";

Wavegen.Channel1.Mode.text = "Simple";
Scope.Trigger.Trigger.text = "Repeated";
Wavegen.run();
Scope.run();

var amplitudeArray1 = []; // Array to store amplitude values
var amplitudeArray2 = [];

for (var idx = 0; wait(0.001) && idx < 1000; idx++) {
    if (!Scope.wait()) throw "Stopped";
    var amplitude1 = Scope.Channel1.measure("Amplitude");
    var amplitude2 = Scope.Channel2.measure("Amplitude");
    amplitudeArray1.push(amplitude1); // Store amplitude in the array
    amplitudeArray2.push(amplitude2); // Store amplitude in the array
}

// Calculate Mean
var mean1 = amplitudeArray1.reduce(function (sum, value) {
    return sum + value;
}, 0) / amplitudeArray1.length;
var mean2 = amplitudeArray2.reduce(function (sum, value) {
    return sum + value;
}, 0) / amplitudeArray2.length;


// Calculate Variance
var variance1 = amplitudeArray1.reduce(function (sum, value) {
    return sum + Math.pow(value - mean1, 2);
}, 0) / amplitudeArray1.length;
var variance2 = amplitudeArray2.reduce(function (sum, value) {
    return sum + Math.pow(value - mean2, 2);
}, 0) / amplitudeArray2.length;

// Calculate Standard Deviation
var standardDeviation1 = Math.sqrt(variance1);
var standardDeviation2 = Math.sqrt(variance2);

print("Mean: " + mean1 + " | " + mean2);
print("Standard Deviation: " + standardDeviation1 + " | " + standardDeviation2);

var Av = mean1/mean2
var dAv = Av * Math.sqrt(Math.pow(standardDeviation1/mean1,2) + Math.pow(standardDeviation2/mean2,2))

print("$" + mean2.toFixed(4) + " \\pm " + standardDeviation2.toFixed(4) + "$ & $" + mean1.toFixed(3) + " \\pm" + standardDeviation1.toFixed(3) + "$ & $ " + Av.toFixed(3) + " \\pm " + dAv.toFixed(3) + "$\\\\ ")
print(mean2.toFixed(4) +" " + standardDeviation2.toFixed(4) + " " + mean1.toFixed(3) + " " + standardDeviation1.toFixed(3) + " " + Av.toFixed(3) + " " + dAv.toFixed(3) + " ")
