#include <TinyGPS++.h>

TinyGPSPlus gps;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial1.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(Serial1.available())
  {
    while(Serial1.available() > 0){
      //Serial.write(Serial1.read());
      char c = Serial1.read();
      Serial.write(c);
      gps.encode(c);
    }

    //Serial.print("LAT="); Serial.println(gps.location.lat(), 6);
    //Serial.print("LNG="); Serial.println(gps.location.lng(), 6);
    //Serial.print("ALT(ft)="); Serial.println(gps.altitude.feet(), 6);
    //Serial.print("SPD(mps)="); Serial.println(gps.speed.mps(), 6);

    delay(1000);
  }
}
