/*
  CMSC838f Individual Assignment 1
  Writing to Serial Port from Arduino
*/
int pin0_val;
int pin0_direction;
int pin3_val;
int step_size;

void setup() {
  pin3_val = 0;
  pin0_val = 512;
  pin0_direction = 1;
  step_size = 20;
  Serial.begin(9600);
}

void loop() {
  // Pin0 is output
  serial_write(0, pin0_val, false);
  pin0_val = pin0_val + (pin0_direction * random(0, 10));
  if(pin0_val > 900 || pin0_val < 250) { pin0_direction = pin0_direction * -1;}
  
  // Step up and down on pin 3
  pin3_val = pin3_val + step_size;
  if(pin3_val >= 100 || pin3_val <= 0) { step_size = step_size * -1;}
  serial_write(3, pin3_val, true);
  
  // Serial.println("Printing from the sketch");
  // serial_write(3, 100, true);

  delay(200);
}

void serial_write(int pin, int value, boolean isInput) {
  Serial.print(String(pin) + " " + String(value) + " " + String(isInput) + "\n");
}











