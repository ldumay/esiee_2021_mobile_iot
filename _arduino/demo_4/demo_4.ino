//Variable
const int led_arduino = 13;
//--LED
const int led_rouge = 2;
//--PhotoResistance
const int capteurPhotoResistance = 3;
int capteurPhotoResistance_value = 0; // la valeur lue sera comprise entre 0 et 1023


// - - - - - -
// fonction d'initialisation de la carte
void setup()
{
    Serial.println("Init");
    
    //Initialisation de la broche 13 du Ardnuino
    pinMode(led_arduino, OUTPUT); //sur sortie

    //Broches Digitals
    pinMode(led_rouge, OUTPUT); //sur sortie

    //Broches Analogiques
    pinMode(led_rouge, OUTPUT); //sur sortie
}

// - - - - - -
// fonction principale, elle se répète (s’exécute) à l'infini
void loop()
{
  digitalWrite(led_arduino, HIGH);
  digitalWrite(led_rouge, HIGH);
  delay(500);

  digitalWrite(led_rouge, HIGH);
  delay(250);

  digitalWrite(led_rouge, LOW);
  delay(250);

  digitalWrite(led_arduino, LOW);
  digitalWrite(led_rouge, LOW);
  delay(500);

  capteurPhotoResistance_value = analogRead(capteurPhotoResistance);
  Serial.println(capteurPhotoResistance_value+"\n");
  delay(100);
}
