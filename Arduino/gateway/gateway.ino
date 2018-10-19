#include <TinyGPS++.h>
#include <RH_RF95.h>
#include <avr/dtostrf.h>

// for feather m0  
#define RFM95_CS 8
#define RFM95_RST 4
#define RFM95_INT 3
 
// Change to 434.0 or other frequency, must match RX's freq!
#define RF95_FREQ 915.0
 
// Singleton instance of the radio driver
RH_RF95 rf95(RFM95_CS, RFM95_INT);
RH_RF95 * rf95ptr = &rf95;

TinyGPSPlus gps;

#define LED 13
#define PACKET_SIZE 60
#define LONG_RANGE 0 // at a penalty of much lower bandwidth, both modems must be same

time_t lastUpdate = millis();

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial1.begin(9600);

  SetUpRadio(rf95ptr);
}

void loop() {
  
  //  Report self gps every three seconds
  time_t currentTime = millis();
  if((currentTime - lastUpdate) > 3000){
    
    if(Serial1.available()){
      while(Serial1.available() > 0){
        char c = Serial1.read();
        gps.encode(c);
      }
    }

    reportSelfPositioning(gps);
    lastUpdate = currentTime;
  }

  //  Receive incoming packets, print to serial
  if(rf95.available()){
    uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);

    if (rf95.recv(buf, &len)){
      digitalWrite(LED, HIGH);
      
      Serial.print((char*)buf);
      Serial.print(",");
      Serial.println(rf95.lastRssi(), DEC);
 
      digitalWrite(LED, LOW);
    }
    else{
      Serial.print("[]");
  }

}

void reportSelfPositioning(TinyGPSPlus gps){
  //  Gateways always report self as ID 0
  char * id = "0";
  
  Serial.print(id);
  Serial.print(",");
  Serial.print(gps.location.lat(), 6);
  Serial.print(",");
  Serial.print(gps.location.lng(), 6);
  Serial.print(",");
  Serial.print(gps.altitude.feet(), 6);
  Serial.print(",");
  Serial.print("bio");
  Serial.print(",");
  Serial.print("sev");
  Serial.print(",");
  Serial.print("rssi");
  Serial.println();
}

void SetUpRadio(RH_RF95 * rf95){
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);
 
  delay(100);
 
  // manual reset
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
 
  while (!rf95->init()) {
    Serial.println("LoRa radio init failed");
    while (1) {}
  }
  
  //////       //////
  // Radio init OK //
  //////       //////
  
  if (!rf95->setFrequency(RF95_FREQ)) {
    Serial.println("setFrequency failed");
    while (1) {}
  }
  //////          //////
  // Set frequency OK //
  //////          //////
  
  // Defaults after init are 434.0MHz, 13dBm, Bw = 125 kHz, Cr = 4/5, Sf = 128chips/symbol, CRC on
  // The default transmitter power is 13dBm, using PA_BOOST.
  // If you are using RFM95/96/97/98 modules which uses the PA_BOOST transmitter pin, then 
  // you can set transmitter powers from 5 to 23 dBm:
  rf95->setTxPower(23, false);
  #if LONG_RANGE
    rf95->setModemConfig(RH_RF95::Bw31_25Cr48Sf512);
  #endif
  
  //////               //////
  // Radio set up finished //
  //////               //////
}
