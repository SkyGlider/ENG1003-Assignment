const toDeg = (180/Math.PI);
let userHeight = "1";
let baseAngle = null;
let topAngle = null;

let calculateBtn = document.getElementById("calculateButton");

try {
  var devSensor =  new AbsoluteOrientationSensor();

  devSensor.onerror = reportError;
  devSensor.addEventListener('reading',() => getCoordinates(devSensor));
  devSensor.start();
} catch (e) {
  console.log(e);
}

setUserHeight();

function reportError() {
  document.getElementById("deviceTilt").innerHTML = "error";
}

function getCoordinates(theSensor){

  let coordinateData = smoothen(theSensor);

  let x = coordinateData.xval;
  let y = coordinateData.yval;
  let z = coordinateData.zval;
  let w = coordinateData.wval;
  let data = [];
  data[0] = Math.atan2(2*(w*x + y*z), 1 - 2*(Math.pow(x,2)+Math.pow(y,2)));
  data[1] = Math.asin(2*(w*y - x*z));
  data[2] = Math.atan2(2*(w*z + x*y),1 - 2*(Math.pow(y,2)+Math.pow(z,2)));

  document.getElementById("deviceTilt").innerHTML = "alpha: " + (data[1]*toDeg).toFixed(0) + "°" + "<br>" + "beta: " + (data[0]*toDeg).toFixed(0) + "°" + "<br>" + "gamma: " + (data[2]*toDeg).toFixed(0) + "°" ;

  return data[0];

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
		count++;
	}


	return {
		xval:x_cum/N,
		yval:y_cum/N,
		zval:z_cum/N,
		wval:w_cum/N
	};
}

function setUserHeight(){

	let newHeight;
	do{
		newHeight = prompt("Enter Your Height in meters: ",userHeight);

		if(isNaN(newHeight)){
			alert("invalid height");
		}

	}while(isNaN(newHeight));

	userHeight = newHeight;
	document.getElementById("heightOfCamera").innerHTML = userHeight + "m";

	if (topAngle != null && baseAngle != null){
	  calculateBtn.disabled = false;
    }
}

function setBase(){

  baseAngle = getCoordinates(devSensor);
  document.getElementById("baseAngle").innerHTML = (baseAngle*toDeg).toFixed(2) + "°";

  if (topAngle != null){
	  calculateBtn.disabled = false;
  }
}

function setTop(){

  topAngle = getCoordinates(devSensor);
  document.getElementById("topAngle").innerHTML = (topAngle*toDeg).toFixed(2) + "°";

  if (baseAngle != null){
	  calculateBtn.disabled = false;
  }
}

function doMath(){

	let objDistance = parseFloat(userHeight) * Math.tan(baseAngle);
	document.getElementById("distanceOfObject").innerHTML = objDistance.toFixed(2) + "m";

	let diffOfAngle = topAngle - Math.PI/2 ;
	let objHeight = parseFloat(userHeight) + objDistance * Math.tan(diffOfAngle);
	document.getElementById("heightOfObject").innerHTML = objHeight.toFixed(2)+"m";

	calculateBtn.disabled = true;
}
