var Gpio = require('pigpio').Gpio;

var steeringPosition = 1500;
var steeringSpeed = 50;
var maxSpeed = 240;
function motorControls (motor1_spd, motor1_dr, motor2_spd, motor2_dr, steeringWheelServo){
	this.motor1_speed = new Gpio(motor1_spd,{mode:Gpio.OUTPUT});
	this.motor1_dir = new Gpio(motor1_dr,{mode:Gpio.OUTPUT});
	
	this.motor2_speed = new Gpio(motor2_spd,{mode:Gpio.OUTPUT});
	this.motor2_dir = new Gpio(motor2_dr,{mode:Gpio.OUTPUT});
	
	this.steeringWheel = new Gpio(steeringWheelServo, {mode: Gpio.OUTPUT});
	this.steeringWheel.servoWrite(steeringPosition);
};


function maxSpeedCheck(speed){
		if(speed > maxSpeed){
			console.log("Exceeding Speedlimit. Droping to maxSpeed (240)");
			return maxSpeed;
		}
		else{
				return speed;
		}
};

motorControls.prototype.cleanup = function(){
	this.motor1_speed.digitalWrite(0);
	this.motor1_dir.digitalWrite(0);
	this.motor2_speed.digitalWrite(0);
	this.motor2_dir.digitalWrite(0);
	console.log("used pins are reversed to LOW state");
};

motorControls.prototype.setMaxSpeed = function(newMaxSpeed){
	maxSpeed = newMaxSpeed;
	console.log("MaxSpeed changed to "+newMaxSpeed+". This may cause errors if it exceeds Pigpio requirements for pwmWrite;");
};

motorControls.prototype.moveForward = function(speed){
	speed = maxSpeedCheck(speed);
	this.motor1_dir.digitalWrite(0);
	this.motor2_dir.digitalWrite(0);
	this.motor1_speed.pwmWrite(speed);
	this.motor2_speed.pwmWrite(speed);
};
	
motorControls.prototype.moveBackwards = function(speed){
	speed = maxSpeedCheck(speed);
	this.motor1_dir.digitalWrite(1);
	this.motor2_dir.digitalWrite(1);
	this.motor1_speed.pwmWrite(maxSpeed - speed);
	this.motor2_speed.pwmWrite(maxSpeed - speed);
};

motorControls.prototype.turnLeft = function(speed){
	speed = maxSpeedCheck(speed);
	this.motor1_dir.digitalWrite(1);
	this.motor2_dir.digitalWrite(0);
	this.motor1_speed.pwmWrite(maxSpeed - speed);
	this.motor2_speed.pwmWrite(speed);
};

motorControls.prototype.turnRight = function(speed){
	speed = maxSpeedCheck(speed);
	this.motor1_dir.digitalWrite(0);
	this.motor2_dir.digitalWrite(1);
	this.motor1_speed.pwmWrite(speed);
	this.motor2_speed.pwmWrite(maxSpeed - speed);
};

motorControls.prototype.fullForward = function(){
	this.motor1_dir.digitalWrite(0);
	this.motor2_dir.digitalWrite(0);
	this.motor1_speed.pwmWrite(maxSpeed);
	this.motor2_speed.pwmWrite(maxSpeed);
};

motorControls.prototype.fullStop = function(speed){
	this.motor1_dir.digitalWrite(0);
	this.motor2_dir.digitalWrite(0);
	this.motor1_speed.pwmWrite(0);
	this.motor2_speed.pwmWrite(0);
};

motorControls.prototype.steerLeft = function(){
	steeringStop = false;
	if(steeringPosition > 1350){
		steeringPosition = steeringPosition - steeringSpeed;
		this.steeringWheel.servoWrite(steeringPosition);
	}	
};
motorControls.prototype.steerRight = function(){
	if(steeringPosition < 1700){
		steeringPosition = steeringPosition + steeringSpeed;
		this.steeringWheel.servoWrite(steeringPosition);
	}	
};

motorControls.prototype.stopSteer = function(){
	steeringStop = true;	
};

motorControls.prototype.motor1 = {
	setSpeed : function(speed){
		speed = maxSpeedCheck(speed);
		if(this.motor1_dir === 1){
			speed = maxSpeed - speed;
		};
		this.motor1_speed.pwmWrite(speed);
	},
	setDirection : function(direction){
		if(direction > 0) {
			direction = 1;
		}
		else{
			direction = 0;
		};
		this.motor1_dir.digitalWrite(direction);
	}
}
motorControls.prototype.motor2 = {
	setSpeed : function(speed){
		if(this.motor1_dir === 1){
			speed = maxSpeed - speed;
		};
		speed = maxSpeedCheck(speed);
		this.motor2_speed.pwmWrite(speed);
	},
	setDirection : function(direction){
		if(direction > 0) {
			direction = 1;
		}
		else{
			direction = 0;
		};
		this.motor2_dir.digitalWrite(direction);
	}
}



module.exports = motorControls;
