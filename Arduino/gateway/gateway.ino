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

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial1.begin(9600);

  SetUpRadio(rf95ptr);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(Serial1.available())
  {
    while(Serial1.available() > 0){
      //Serial.write(Serial1.read());
      char c = Serial1.read();
      //Serial.write(c);
      gps.encode(c);
    }

    //Serial.print("LAT="); Serial.println(gps.location.lat(), 6);
    //Serial.print("LNG="); Serial.println(gps.location.lng(), 6);
    //Serial.print("ALT(ft)="); Serial.println(gps.altitude.feet(), 6);
    //Serial.print("SPD(mps)="); Serial.println(gps.speed.mps(), 6);

    delay(1000);

    char buf[128];
    memset(buf, '\0', sizeof(buf) / sizeof(buf[0]));
    uint8_t len = 0;

    Serial.println(rf95.available());
    while(rf95.recv((uint8_t *)buf, &len))
    {
      Serial.print(buf);
    }
    Serial.println();
  }
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
  rf95->setTxPower(21, false);
  rf95->setModemConfig(RH_RF95::Bw31_25Cr48Sf512);
  
  //////               //////
  // Radio set up finished //
  //////               //////
}
