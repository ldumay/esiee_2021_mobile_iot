/**
 * Station de température et d'humidité à l'aide d'un capteur DHT11.
 * Celui-ci permet de récupérer la température et le taux d'humidité.
 * On affiche les résultat, le tout pouvant être relier à XBee.
 */

//Import de la bibliothèque de système pour XBee
#include <SoftwareSerial.h>

//Import de la bibliothèque du capteur DHT11
#include "DHT.h"

//LED PIN 13
const int ledPIN = 13;

//Préparation du XBee
SoftwareSerial xbee(2, 3);

// Capteur de temperature et d'humidite DHT11
DHT dht(3, DHT11);

//- - - - [Initialisation de la carte] - - - -
void setup() {
  //Init Serial USB
  xbee.begin(9600); //--> XBee
  Serial.begin(9600); //--> Arduino
  
  //Initialisation de la broche 13 du Ardnuino
  pinMode(ledPIN, OUTPUT); //sur sortie

  //Capteur DHT11
  dht.begin();

  Serial.println(F("Station de température et d'humidité - Ready!"));
}

//- - - - [Fonction principale] - - - -
void loop() {
  //Check avec LED PIN 13
  checkRunProgArduino();
  
  //Recupere la temperature et l'humidite du capteur et l'affiche sur le moniteur serie
  Serial.print("temperature=");
  Serial.print(int(dht.readTemperature()));
  Serial.print("&");
  Serial.print("humidity=");
  Serial.println(int(dht.readHumidity()));
  delay(10000);
}

//- - - - [Vérification du run avec la LED PIN 13] - - - -
void checkRunProgArduino(){
  digitalWrite(ledPIN, HIGH); //Changement de l'état de la LED PIN 13
  delay(250);
  digitalWrite(ledPIN, LOW); //Changement de l'état de la LED PIN 13
  delay(250);
}
