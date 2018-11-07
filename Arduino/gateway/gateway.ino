#include <TinyGPS++.h>
#include <RH_RF95.h>
#include <avr/dtostrf.h>

struct RadioPacket{
  short ID;
  unsigned long x;
  unsigned long y;
  unsigned long z;
  char resource;
  char quantity;
  unsigned long timestamp;
  unsigned long unused;
} __attribute__((packed));

// Feather M0 pins 
#define RFM95_CS 8
#define RFM95_RST 4
#define RFM95_INT 3
#define RF95_FREQ 915.0

//  Instance of radio driver
RH_RF95 rf95(RFM95_CS, RFM95_INT);
RH_RF95 * rf95ptr = &rf95;

//  Instance of GPS
TinyGPSPlus gps;

//  Config
unsigned short DEVICE_ID = 0x1337;
#define LED 13
#define PACKET_SIZE 24
#define LONG_RANGE 0                    //  at a penalty of much lower bandwidth
#define SELF_REPORT_INTERVAL 5000
#define DATABASE_DUMP_INTERVAL 12000
#define NUMBER_OF_RESOURCES 5

//  Globals
time_t lastSelfReport = millis();
time_t lastDatabaseDump = millis();

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.setTimeout(100);
  Serial1.begin(9600);

  SetUpRadio(rf95ptr);
}

void loop() {

  if(Serial1.available()){
    while(Serial1.available() > 0){
      char c = Serial1.read();
      gps.encode(c);
    }
  }
  
  //  Report self GPS every SELF_REPORT_INTERVAL seconds
  time_t currentTime = millis();
  if((currentTime - lastSelfReport) > SELF_REPORT_INTERVAL){
    reportSelfPositioning(gps);
    lastSelfReport = currentTime;
  }

  if((currentTime - lastDatabaseDump) > DATABASE_DUMP_INTERVAL){
    uint8_t requestDumpPacket[PACKET_SIZE];
    memset(requestDumpPacket, 0xFF, PACKET_SIZE);

    for(int i = 0; i < PACKET_SIZE; i++){
      if(requestDumpPacket[i] < 0x10){
        Serial.print(0, HEX);
      }
      Serial.print(requestDumpPacket[i], HEX);
      Serial.print(" ");
    }

    delay(100);

    //  Send sync packet to other gateways if told to
    if(Serial.available()){
  
      //  Create two dimensional array so we can send multiple packets of PACKET_SIZE
      uint8_t gatewaySyncBuffer[128][PACKET_SIZE];
      memset(gatewaySyncBuffer, 0, sizeof(uint8_t) * 128 * PACKET_SIZE);
  
      //  Populate radio packets in buffer
      int iterator = 0;
      while(Serial.available()){
        uint8_t c = Serial.read();
        gatewaySyncBuffer[iterator / PACKET_SIZE][iterator % PACKET_SIZE] = c;
        iterator++;
      }
    
  //    for(int i = 0; i < iterator; i++){
  //      Serial.print(gatewaySyncBuffer[i]);
  //    }
  //    Serial.println(iterator);
  
      //  Send all constructed packets
      digitalWrite(LED, HIGH);
      for(int i = 0; i < iterator / PACKET_SIZE; i++){
        rf95.send((uint8_t *)gatewaySyncBuffer[i], PACKET_SIZE);
        delay(10);
        rf95.waitPacketSent();
        delay(10);
      }
      digitalWrite(LED, LOW);
    }
    lastDatabaseDump = currentTime;
  }


  //  Receive incoming packets, print to serial
  if(rf95.available()){
    uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);
  
    if (rf95.recv(buf, &len)){
      digitalWrite(LED, HIGH);

      for(int i = 0; i < sizeof(buf); i++){
        if(buf[i] < 16){
          Serial.print(0, HEX);
        }
        Serial.print(buf[i], HEX);
        Serial.print(" ");
      }
      //Serial.println();
  
      digitalWrite(LED, LOW);
    }
    else{
      Serial.print("[]");
    }
  }

}

void reportSelfPositioning(TinyGPSPlus gps){

  RadioPacket radioPacket;
  memset(&radioPacket, 0, sizeof(RadioPacket));
  radioPacket.ID = DEVICE_ID;
  radioPacket.x = pack754(gps.location.lat());
  radioPacket.y = pack754(gps.location.lng());
  radioPacket.z = (unsigned long)gps.altitude.feet();
  radioPacket.resource = 0xFF;
  radioPacket.quantity = 0xFF;
  radioPacket.timestamp = gps.time.value();
  radioPacket.unused = 0xFFFFFFFF;

  char radioBuffer[sizeof(RadioPacket)];
  memcpy(radioBuffer, &radioPacket, sizeof(RadioPacket));

  for(int i = 0; i < sizeof(RadioPacket); i++){
    if(radioBuffer[i] < 0x10){
      Serial.print(0, HEX);
    }
    Serial.print(radioBuffer[i], HEX);
    Serial.print(" ");
  }
  //Serial.println();

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

uint32_t pack754(double f)
{
  long double fnorm;
  int shift;
  long long sign, exp, significand;
  unsigned significandbits = 32 - 8 - 1; // -1 for sign bit

  if (f == 0.0) return 0; // get this special case out of the way

  // check sign and begin normalization
  if (f < 0) { sign = 1; fnorm = -f; }
  else { sign = 0; fnorm = f; }

  // get the normalized form of f and track the exponent
  shift = 0;
  while(fnorm >= 2.0) { fnorm /= 2.0; shift++; }
  while(fnorm < 1.0) { fnorm *= 2.0; shift--; }
  fnorm = fnorm - 1.0;

  // calculate the binary form (non-float) of the significand data
  significand = fnorm * ((1LL<<significandbits) + 0.5f);

  // get the biased exponent
  exp = shift + ((1<<(8-1)) - 1); // shift + bias

  // return the final answer
  return (sign<<(32-1)) | (exp<<(32-8-1)) | significand;
}
