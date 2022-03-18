// déclaration de variables globales (broches...)
const int ledPin = 13;
const int led_rouge = 2; // définition de la broche 2 de la carte en tant que variable

// fonction d'initialisation de la carte
void setup()
{
    pinMode(ledPin, OUTPUT); // initialisation de la broche 13 comme étant une sortie
    pinMode(led_rouge, OUTPUT); // initialisation de la broche 2 comme étant une sortie
}

// fonction principale, elle se répète (s’exécute) à l'infini
void loop()
{
  digitalWrite(ledPin, HIGH);
  digitalWrite(led_rouge, HIGH);
  delay(500);

  digitalWrite(led_rouge, HIGH);
  delay(250);

  digitalWrite(led_rouge, LOW);
  delay(250);

  digitalWrite(ledPin, LOW);
  digitalWrite(led_rouge, LOW);
  delay(500);
}
