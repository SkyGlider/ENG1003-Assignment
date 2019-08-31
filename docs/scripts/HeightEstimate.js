const toDegree = (180/Math.PI);
let userHeight = "1";
let baseAngle = null;
let topAngle = null;

//mdl snackbar selector
let notification = document.querySelector('.mdl-js-snackbar');
let calculateButton = document.getElementById("calculateButton");


//Feature 1 Device Orientation
try {

	var deviceSensor =  new AbsoluteOrientationSensor(); //Create a variable devSensor(device sensor) to store the object from class Absolute Orientation Sensor

	deviceSensor.onerror = reportError; //If there is error, devSensor will give back error
	deviceSensor.addEventListener('reading',() => getCoordinates(deviceSensor)); //Get the coordinates from devSensor via user function getCoordinates()
	deviceSensor.start();

} catch (error) {

	console.log(error);

}

setUserHeight();


function reportError() {

	document.getElementById("deviceTilt").innerHTML = "error";

}


function getCoordinates(theSensor){

	let coordinateData = smoothen(theSensor);

	let x_coordinate = coordinateData.x_value;  //x coordinate from coordinate data
	let y_coordinate = coordinateData.y_value; //y coordinate from coordinate data
	let z_coordinate = coordinateData.z_value; //z coordinate from coordinate data
	let vector_e = coordinateData.e_value; //vector e from coordinate data

	let data = [];
	data[0] = Math.atan2(2*(vector_e*x_coordinate + y_coordinate*z_coordinate), 1 - 2*(Math.pow(x_coordinate,2)+Math.pow(y_coordinate,2)));

	document.getElementById("deviceTilt").innerHTML = "beta: " + (data[0]*toDegree).toFixed(0) + "°";
	return data[0];

}


function smoothen(theSensor){

	let count = 0;
	let x_cummulative = 0;
	let y_cummulative = 0;
	let z_cummulative = 0;
	let e_cummulative = 0;
	let data_size = 1000;

	while (count < data_size){
		x_cummulative += theSensor.quaternion[0];
		y_cummulative += theSensor.quaternion[1];
		z_cummulative += theSensor.quaternion[2];
		e_cummulative += theSensor.quaternion[3];
		count++;

	}

	return {

		x_value:x_cummulative/data_size,
		y_value:y_cummulative/data_size,
		z_value:z_cummulative/data_size,
		e_value:e_cummulative/data_size

	};

}


function setUserHeight(){

	let newHeight;

	do{
		newHeight = prompt("Enter Your Height in metres (Reference Height): ",userHeight);

		if(isNaN(newHeight)  || newHeight<0 || newHeight == null){
			alert("invalid height");
		}

	}while(isNaN(newHeight)|| newHeight<0 || newHeight == null);

	userHeight = newHeight;
	document.getElementById("heightOfCamera").innerHTML = userHeight + "m";

	if (topAngle != null && baseAngle != null){
		calculateButton.disabled = false;
   	}

}


function setBaseAngle(){

	baseAngle = getCoordinates(deviceSensor);
	document.getElementById("baseAngle").innerHTML = (baseAngle*toDegree).toFixed(2) + "°";

	//mdl snackbar
	var data = {
  	message: 'Base Angle Recorded',
  	timeout: 2000
	};
	notification.MaterialSnackbar.showSnackbar(data);

	if (topAngle != null){
		calculateButton.disabled = false;
  	}

}


function setTopAngle(){

	topAngle = getCoordinates(deviceSensor);
	document.getElementById("topAngle").innerHTML = (topAngle*toDegree).toFixed(2) + "°";

	//mdl snackbar
	var data = {
  	message: 'Top Angle Recorded',
  	timeout: 2000
	};
	notification.MaterialSnackbar.showSnackbar(data);

	if (baseAngle != null){
		calculateButton.disabled = false;
  	}

}


function doCalculation(){
	
	let distOut = document.getElementById("distanceOfObject");
	let heightOut = document.getElementById("heightOfObject");

	let objectDistance = parseFloat(userHeight) * Math.tan(baseAngle);
	let differenceOfAngle = topAngle - Math.PI/2 ;
	let objectHeight = parseFloat(userHeight) + objectDistance * Math.tan(differenceOfAngle);

	if(objectHeight>0){
		distOut.innerHTML = objectDistance.toFixed(2) + "m";
		heightOut.innerHTML = objectHeight.toFixed(2)+"m";
	}
	else if (baseAngle>topAngle){
		alert("Base level should not be higher than top level");
	}
	else if(topAngle>baseAngle){
		alert("Object's base level cannot be higher than the referenced height's base level");
	}
	calculateButton.disabled = true;

}
