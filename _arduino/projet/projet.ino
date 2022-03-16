#include <SoftwareSerial.h>
//- - - - [Variables] - - - -

//-LED_PIN_13
const int led_arduino = 13;

//LED
const int led_rouge = 2;

//-Potentionmètre
/*
Notes de branchement :
--> GND + => GND
--> Pin + => 5v
--> Pin CLK => 4
--> Pin CLK => 7
--> Pin CLK => 8
*/
const int pin_CLK  = 4;
const int pin_TD  = 7;
const int pin_SW  = 8;
bool clkState  = LOW;
bool clkLast  = HIGH;
bool swState  = HIGH;
bool swLast  = HIGH;
int rotVal  = 0;
const int rotValMax = 20; //Max un tour complet du potentionmètre

//Message
SoftwareSerial xbee(2, 3);
String phrase = "";
int nb_message = 0;
int count = 0;


//- - - - [Initialisation de la carte] - - - -
void setup() {
  //Init Serial USB
  Serial.begin(9600);
  Serial.println(F("Initialisation du programme"));

  //Initialisation de la broche 13 du Ardnuino
  pinMode(led_arduino, OUTPUT); //sur sortie

  //- - [Broches Digitals] - -
  //Broches Digitals
  pinMode(led_rouge, OUTPUT); //sur sortie
  //Potentionmètre - Initialisation des rotations
  pinMode(pin_CLK,INPUT);
  pinMode(pin_TD,INPUT);
  pinMode(pin_SW,INPUT_PULLUP);

  //- - [Broches Analogiques] - -

}


//- - - - [Fonction principale] - - - -
void loop() {

  //LEDArduino
  //ledArduino();
  
  //LEDs
  //allLeds();

  //Fonction du Potentionmètre
  readRotary();

  //Link Arduino to XBee
  //arduinoToXBee();
}


//- - - - [LED-Arduino] - - - -
void ledArduino(){
  digitalWrite(led_arduino, HIGH);
  delay(500);
  digitalWrite(led_arduino, LOW);
  delay(500);
}


//- - - - [All-LED] - - - -
void allLeds(){
  digitalWrite(led_rouge, HIGH);
  delay(250);
  digitalWrite(led_rouge, LOW);
  delay(250);
  digitalWrite(led_rouge, HIGH);
  delay(250);
  digitalWrite(led_rouge, LOW);
  delay(250);
}


//- - - - [Lecteur du Potentionmètre] - - - -
void readRotary(){
  ////Test routine for Rotary
  // gestion position
  clkState = digitalRead(pin_CLK);
  if ((clkLast == LOW) && (clkState == HIGH)) {//rotary moving
    Serial.print("Rotary position ");
    if (digitalRead(pin_TD) == HIGH) {
      rotVal = rotVal - 1;
      if ( rotVal < 0 ) {
        rotVal = 0;
      }
    }
    else {
      rotVal++;
      if ( rotVal > rotValMax ) {
        rotVal = rotValMax;
      }
    }
    Serial.println(rotVal);
    delay(200);
  }
  clkLast = clkState;

  //gestion bouton
  swState = digitalRead(pin_SW);
  if (swState == LOW && swLast == HIGH) {
    Serial.println("Rotary pressed");
    delay(100);//debounce
  }
  swLast = swState;
}


//- - - - [Message d'essai de communication Arduino to XBee] - - - -
void arduinoToXBee(){
  phrase += "[Try] - nb : ";
  phrase += nb_message;
  phrase += " - ";
  nb_message++;
  phrase += count*2;
  phrase += "ms\n";
  Serial.println(phrase);
  xbee.println(phrase);
  count++;
  delay(2000);
}
