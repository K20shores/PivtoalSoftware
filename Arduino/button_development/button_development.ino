#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display = Adafruit_SSD1306();

#if (SSD1306_LCDHEIGHT != 32)
 #error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif

#define BUTTON_A 9
#define BUTTON_B 6
#define BUTTON_C 5

int selected = 0;
int resourceIterator = 1337;
int quantity = 0;
#define NUMBER_OF_RESOURCES 3
const char *resources[NUMBER_OF_RESOURCES];



void setup() {
  pinMode(BUTTON_A, INPUT_PULLUP);
  pinMode(BUTTON_B, INPUT_PULLUP);
  pinMode(BUTTON_C, INPUT_PULLUP);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // initialize with the I2C addr 0x3C (for the 128x32)

  // Show image buffer on the display hardware.
  // Since the buffer is intialized with an Adafruit splashscreen
  // internally, this will display the splashscreen.
  display.display();
  delay(1000);

  // Clear the buffer.
  display.clearDisplay();
  display.display();

  // text display tests
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);

  //  populate resources array
  resources[0] = "Search/rescue team";
  resources[1] = "Medical team";
  resources[2] = "Ambulance";

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
      selected = 1;
    }

    for(int i = 0; i < NUMBER_OF_RESOURCES; i++){
      if(resourceIterator % NUMBER_OF_RESOURCES == i){
        display.clearDisplay();
        display.setCursor(0,0);
        display.println("Choose a resource: ");
        display.println(resources[i]);
        display.display();
      }
    }
    
  }
  else if(selected == 1){
    if(!digitalRead(BUTTON_A)){
      if(quantity < 32){
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

    for(int i = 0; i < NUMBER_OF_RESOURCES; i++){
      if(resourceIterator % NUMBER_OF_RESOURCES == i){
        display.println(resources[i]);
      }
    }
    
    display.println();
    display.print("Quantity: ");
    display.println(quantity);
    
    display.display();
  }
  

  delay(80);
}
