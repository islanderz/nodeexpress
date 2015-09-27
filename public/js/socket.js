
//$.getScript("js/mqttws31.js", function(){
//   alert("Script loaded but not necessarily executed.");
//});


function drawImage(imgData, coords) {
    "use strict";
	 var canvas = document.getElementById("thecanvas");
	 var ctx = canvas.getContext("2d");
	 
    //var uInt8Array = new Uint8Array(imgData);
    var uInt8Array = imgData;
    var i = uInt8Array.length;
    var binaryString = [i];
    while (i--) {
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
    }
    var data = binaryString.join('');

    var base64 = window.btoa(data);

    var img = new Image();
    img.src = "data:image/png;base64," + base64;
    img.onload = function () {
        console.log("Image Onload");
        ctx.clearRect(coords[0], coords[1], 1024, 768);
        ctx.drawImage(img, coords[0], coords[1], 1024, 768);
    };
    img.onerror = function (stuff) {
        console.log("Img Onerror:", stuff);
    };
 
}