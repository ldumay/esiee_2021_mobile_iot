/**
 * Station de de simulation de vent à l'aide d'un potentiomètre.
 * Celui-ci permet de récupérer la position du potentiomètre permet de simuler la force du vent entre 0 et 200 (km/h).
 * On affiche les résultat, le tout pouvant être relier à XBee.
 */

//Import de la bibliothèque de système pour XBee
#include <SoftwareSerial.h>

//Préparation du XBee
SoftwareSerial xbee(2, 3);

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
int rotVal  = random(0, 30);
const int rotValMax = 200; //Max un tour complet du potentionmètre

//- - - - [Initialisation de la carte] - - - -
void setup() {
  //Init Serial USB
  xbee.begin(9600); //--> XBee
  Serial.begin(9600); //--> Arduino

  //Potentionmètre - Initialisation des rotations
  pinMode(pin_CLK,INPUT);
  pinMode(pin_TD,INPUT);
  pinMode(pin_SW,INPUT_PULLUP);

  Serial.println(F("Station de de simulation de vent - Ready!"));
  Serial.print("position=");
  Serial.print(rotVal);
  Serial.println("");
}

//- - - - [Fonction principale] - - - -
void loop() {
  //Fonction du Potentionmètre
  readRotary();
}

//- - - - [Lecteur du Potentionmètre] - - - -
void readRotary(){
  ////Test routine for Rotary
  // gestion position
  clkState = digitalRead(pin_CLK);
  if ((clkLast == LOW) && (clkState == HIGH)) {//rotary moving
    Serial.print("position=");
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
    Serial.print(rotVal);
    Serial.println("");
    delay(100);
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
