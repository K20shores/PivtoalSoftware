#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <TinyGPS++.h>
#include <RH_RF95.h>
#include <avr/dtostrf.h>

struct RadioPacket{
  unsigned short ID;
  unsigned long x;
  unsigned long y;
  unsigned long z;
  unsigned char resource;
  unsigned char quantity;
  unsigned long timestamp;
  unsigned long unused;
} __attribute__((packed));

//  Button input pins
#define BUTTON_A 9
#define BUTTON_B 6
#define BUTTON_C 5

// Feather M0 pins
#define RFM95_CS 8
#define RFM95_RST 4
#define RFM95_INT 3
#define RF95_FREQ 915.0

//  Instance of display
Adafruit_SSD1306 display = Adafruit_SSD1306();
#if (SSD1306_LCDHEIGHT != 32)
 #error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif

//  Instance of radio driver
RH_RF95 rf95(RFM95_CS, RFM95_INT);
RH_RF95 * rf95ptr = &rf95;

//  Instance of GPS
TinyGPSPlus gps;

//  Config
unsigned short DEVICE_ID = 0;
#define LED 13
#define PACKET_SIZE 24
#define LONG_RANGE 0              //  at a penalty of much lower bandwidth
#define SEND_INTERVAL 5000        //  ms delay between sending
#define NUMBER_OF_RESOURCES 7

//  Globals
int selected = 0;
int resourceIndex = 0;
int quantity = 0;
int resourceIterator = 1337 * NUMBER_OF_RESOURCES;  //  start as multiple of resource number
unsigned long lastPacketSent = millis();
const char *resources[NUMBER_OF_RESOURCES];


void setup() {
  //  Serial port
  Serial.begin(9600);
  //  GPS serial
  Serial1.begin(9600);

  DEVICE_ID = getUniqueID();
  InitializeButtons();
  PopulateResourcesArray();
  SetUpRadio(rf95ptr);
  InitializeDisplay();

  Serial.println("Set up finished... entering loop");
}

void loop() {

  if(selected == 0){
    if(!digitalRead(BUTTON_A)){
      resourceIterator += 1;
    }
    if(!digitalRead(BUTTON_B)){
      resourceIterator -= 1;
    }
    if(!digitalRead(BUTTON_C)){
      //  Start timer for packet sent
      lastPacketSent = millis();
      selected = 1;
    }

    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Choose a resource: ");
    display.println(resources[resourceIterator % NUMBER_OF_RESOURCES]);
    display.display();

  }
  else if(selected == 1){
    if(!digitalRead(BUTTON_A)){
      if(quantity < 255){
        quantity += 1;
      }
    }
    if(!digitalRead(BUTTON_B)){
      if(quantity > 0){
        quantity -= 1;
      }
    }
    if(!digitalRead(BUTTON_C)){
      quantity = 0;
      selected = 0;
    }

    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Selected: ");

    display.println(resources[resourceIterator % NUMBER_OF_RESOURCES]);

    display.println();
    display.print("Quantity: ");
    display.println(quantity);

    display.display();

    //  If SEND_INTERVAL has elapsed, construct packet and send
    unsigned long currentTime = millis();
    if((currentTime - lastPacketSent) > SEND_INTERVAL){
      digitalWrite(LED, HIGH);

      RadioPacket radioPacket;
      memset(&radioPacket, 0, sizeof(RadioPacket));
      radioPacket.ID = DEVICE_ID;
      radioPacket.x = pack754(gps.location.lat());
      radioPacket.y = pack754(gps.location.lng());
      radioPacket.z = (unsigned long)gps.altitude.feet();
      radioPacket.resource = resourceIterator % NUMBER_OF_RESOURCES;
      radioPacket.quantity = quantity;
      radioPacket.timestamp = (gps.time.hour() << 24) + (gps.time.minute() << 16) + (gps.time.second() << 8) + 0xFF;//gps.time.value();
      radioPacket.unused = 0xFFFFFFFF;

      uint8_t radioBuffer[sizeof(RadioPacket)];
      memcpy(radioBuffer, &radioPacket, sizeof(RadioPacket));

      //Serial.print("radioPacket: ");
      for(int i = 0; i < sizeof(RadioPacket); i++){
        if(radioBuffer[i] < 16){
          Serial.print(0, HEX);
        }
        Serial.print(radioBuffer[i], HEX);
        Serial.print(" ");
      }
      Serial.println();

      delay(10);
      rf95.send((uint8_t *)radioBuffer, PACKET_SIZE);
      Serial.print("Waiting for packet to complete... ");
      delay(10);
      rf95.waitPacketSent();
      Serial.println("Sent");

      lastPacketSent = currentTime;
      digitalWrite(LED, LOW);
    }
  }

  //  Capture GPS data
  if(Serial1.available())
  {
    while(Serial1.available() > 0){
      char c = Serial1.read();
      gps.encode(c);
    }
  }

  //  So button does not trigger multiple times per press
  delay(80);
}

void InitializeButtons(){
  //  Initialize button inputs
  pinMode(BUTTON_A, INPUT_PULLUP);
  pinMode(BUTTON_B, INPUT_PULLUP);
  pinMode(BUTTON_C, INPUT_PULLUP);
}

void PopulateResourcesArray(){
  //  Populate resources array with descriptions
  resources[0] = "Search/rescue team";
  resources[1] = "Medical team";
  resources[2] = "Ambulance";
  resources[3] = "Boat";
  resources[4] = "Wood (sq ft)";
  resources[5] = "Meals";
  resources[6] = "Cases of water";
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

void InitializeDisplay(){
  //  Initialize screen with I2C addr 0x3C (for the 128x32)
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  //  Display splashscreen, buffered on initialization
  display.display();
  delay(1000);

  // Clear the buffer.
  display.clearDisplay();
  display.display();

  //  Display text config
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
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

unsigned short getUniqueID() {
  volatile uint32_t val1, val2, val3, val4;
  volatile uint32_t *ptr1 = (volatile uint32_t *)0x0080A00C;
  val1 = *ptr1;
  volatile uint32_t *ptr = (volatile uint32_t *)0x0080A040;
  val2 = *ptr;
  ptr++;
  val3 = *ptr;
  ptr++;
  val4 = *ptr;

//  Serial.print("chip id: 0x");
//  char buf[33];
//  sprintf(buf, "%8x%8x%8x%8x", val1, val2, val3, val4);
//  Serial.println(buf);

  Serial.print("DEVICE_ID: ");
  Serial.println((unsigned short)val1);

  return (unsigned short)val1;
}
