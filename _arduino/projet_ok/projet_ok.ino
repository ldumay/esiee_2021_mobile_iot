#include <SoftwareSerial.h>
#include "DHT.h"

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
int rotVal  = 0;
int lastRotVal = 0;
const int rotValMax = 20; //Max un tour complet du potentionmètre

// Capteur de temperature et d'humidite DHT11
DHT dht(3, DHT11);
int lastTemperature = 0;
int lastHumidite = 0;

//- - - - [Initialisation de la carte] - - - -
void setup() {

  lastTemperature = dht.readTemperature();
  lastHumidite = dht.readHumidity();
  //Init Serial USB
  xbee.begin(9600); //--> XBee
  Serial.begin(9600); //--> Arduino
  
  //Initialisation de la broche 13 du Ardnuino
  pinMode(13, OUTPUT); //sur sortie

  //Potentionmètre - Initialisation des rotations
  pinMode(pin_CLK,INPUT);
  pinMode(pin_TD,INPUT);
  pinMode(pin_SW,INPUT_PULLUP);

  //Capteur DHT11
  dht.begin();

  Serial.println(F("Initialisation du programme"));

}

//- - - - [Fonction principale] - - - -
void loop() {
  lastTemperature = int(dht.readTemperature());
  lastHumidite = int(dht.readHumidity());
  
  //Fonction du Potentionmètre
  readRotary();
  if(lastRotVal!=rotVal){
    lastRotVal=rotVal;
  }

  // Recupere la temperature et l'humidite du capteur et l'affiche
  // sur le moniteur serie
  if( (lastTemperature!= int(dht.readTemperature())) ){
    lastTemperature = int (dht.readTemperature());
  }
  if((lastTemperature!=int(dht.readHumidity())) ){
    lastHumidite = int (dht.readHumidity());
  }

  if(lastTemperature != int(dht.readTemperature()) || lastHumidite != int(dht.readHumidity()) || lastRotVal!=rotVal){
    Serial.print("position=");
    Serial.print(rotVal);
    Serial.print("&temperature=");
    Serial.print(int(dht.readTemperature()));
    Serial.print("&humidity=");
    Serial.print(int(dht.readHumidity()));
    Serial.println("");
  }
}

//- - - - [Lecteur du Potentionmètre] - - - -
void readRotary(){
  ////Test routine for Rotary
  // gestion position
  clkState = digitalRead(pin_CLK);
  if ((clkLast == LOW) && (clkState == HIGH)) {//rotary moving
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
