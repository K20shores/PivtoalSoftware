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
#define LONG_RANGE 0 // at a penalty of much lower bandwidth
#define SEND_RATE 1000//  ms delay between sending

void setup() {
  Serial.begin(9600);
  delay(3000);
  Serial.println("Serial up");
  Serial1.begin(9600);
  Serial.println("Serial for GPS up");

  SetUpRadio(rf95ptr);

  // Overall setup OK
  Serial.println("Set up finished.. entering loop");
}

void loop() {
  digitalWrite(LED, LOW);
  delay(SEND_RATE);
  digitalWrite(LED, HIGH);

  char radioPacket[PACKET_SIZE];
  memset(radioPacket, 0, PACKET_SIZE);
  
  if(Serial1.available())
  {
    while(Serial1.available() > 0){
      char c = Serial1.read();
      gps.encode(c);
    }
  }

  char * id = "1";
  char latBuffer[12];
  dtostrf(gps.location.lat(), 8, 6, latBuffer);
  char lngBuffer[12];
  dtostrf(gps.location.lng(), 8, 6, lngBuffer);
  char altBuffer[12];
  itoa(gps.altitude.feet(), altBuffer, 10);
  char * biometricData = "n/a";
  char * severity = "n/a";
  sprintf(radioPacket, "%s,%s,%s,%s,%s,%s", id, latBuffer, lngBuffer, altBuffer, biometricData, severity);

  Serial.print("Sending "); Serial.println(radioPacket);
  delay(10);
  rf95.send((uint8_t *)radioPacket, PACKET_SIZE);
  Serial.print("Waiting for packet to complete... "); 
  delay(10);
  rf95.waitPacketSent();
  Serial.println("Sent");
}

void SetUpRadio(RH_RF95 * rf95){
  Serial.println("Entering radio set up");
  
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
  Serial.println("Radio set up complete");
}
