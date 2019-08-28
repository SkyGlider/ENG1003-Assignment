const toDegree = (180/Math.PI);
let userHeight = "1";
let baseAngle = null;
let topAngle = null;


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

		if(isNaN(newHeight)  && newHeight<0){

			alert("invalid height");

		}

	}while(isNaN(newHeight));

	userHeight = newHeight;
	document.getElementById("heightOfCamera").innerHTML = userHeight + "m";

	if (topAngle != null && baseAngle != null){

		calculateButton.disabled = false;

    }

}


function setBaseAngle(){

	baseAngle = getCoordinates(deviceSensor);
	document.getElementById("baseAngle").innerHTML = (baseAngle*toDegree).toFixed(2) + "°";
	alert("Base angle is recorded");

	if (topAngle != null){

		calculateButton.disabled = false;

  }

}


function setTopAngle(){

	topAngle = getCoordinates(deviceSensor);
	document.getElementById("topAngle").innerHTML = (topAngle*toDegree).toFixed(2) + "°";
	alert("Top angle is recorded");

	if (baseAngle != null){

		calculateButton.disabled = false;

  }

}


function doCalculation(){

	let objectDistance = parseFloat(userHeight) * Math.tan(baseAngle);
	document.getElementById("distanceOfObject").innerHTML = objectDistance.toFixed(2) + "m";

	let differenceOfAngle = topAngle - Math.PI/2 ;
	let objectHeight = parseFloat(userHeight) + objectDistance * Math.tan(differenceOfAngle);

	if(objectHeight>0){

		document.getElementById("heightOfObject").innerHTML = objectHeight.toFixed(2)+"m";
		calculateButton.disabled = true;

	}

	else if(objectHeight==0){

		alert("Base angle should not be the same as the top angle");
		document.getElementById("heightOfObject").innerHTML = objectHeight.toFixed(2)+"m";
		calculateButton.disabled = true;

	}

	else{

		if (baseAngle>topAngle){

			alert("Base angle should not be larger than top angle");
			document.getElementById("heightOfObject").innerHTML = "null";
			document.getElementById("distanceOfObject").innerHTML = "null";
			calculateButton.disabled = true;

		}

		else if (topAngle>baseAngle){

			alert("Object's base cannot be higher than the referenced height");
			document.getElementById("heightOfObject").innerHTML = "null";
			document.getElementById("distanceOfObject").innerHTML = "null";
			calculateButton.disabled = true;

		}

	}

}
