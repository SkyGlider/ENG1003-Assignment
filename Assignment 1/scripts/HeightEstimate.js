const toDeg = 180/Math.PI;
let userHeight = "1";


try {
  let devSensor =  new AbsoluteOrientationSensor();

  devSensor.onerror = reportError;
  devSensor.addEventListener('reading',() => showCoordinates(devSensor))
  devSensor.start();
} catch (e) {
  console.log(e);
}

setUserHeight();


function reportError() {
  document.getElementById("test1").innerHTML = "error";
}

function showCoordinates(theSensor){

  let coordinateData = smoothen(theSensor);
  document.getElementById("testx").innerHTML = "x: " + (coordinateData.xval*toDeg).toFixed(0);
  document.getElementById("testy").innerHTML = "y: " + (coordinateData.yval*toDeg).toFixed(0);
  document.getElementById("testz").innerHTML = "z: " + (coordinateData.zval*toDeg).toFixed(0);
  document.getElementById("testw").innerHTML = "w: " + (coordinateData.wval*toDeg).toFixed(0);

}

function smoothen(theSensor){

	let count = 0;
	let x_cum = 0;
	let y_cum = 0;
	let z_cum = 0;
	let w_cum = 0;
	let N = 1000;
	while (count < N){
		x_cum += theSensor.quaternion[0];
		y_cum += theSensor.quaternion[1];
		z_cum += theSensor.quaternion[2];
		w_cum += theSensor.quaternion[3];
		count++
	}

	return {
		xval:x_cum/N,
		yval:y_cum/N,
		zval:z_cum/N,
		wval:w_cum/N
	}
}

function setUserHeight(){

	let newHeight;
	do{
		newHeight = prompt("Enter Your Height in meters: ",userHeight);

		if(isNaN(newHeight)){
			alert("invalid height")
		}

	}while(isNaN(newHeight))

	userHeight = newHeight;
	document.getElementById("heightOfCamera").innerHTML = userHeight;

}
