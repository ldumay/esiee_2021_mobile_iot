#include <SoftwareSerial.h>
SoftwareSerial xbee(2, 3);
int count;

void setup()
{
  pinMode(13,OUTPUT);
  
    xbee.begin(9600);
    Serial.begin(9600);                     
    count = 0;
}

/***************************************
*  MAIN LOOP
***************************************/

void loop()
{
  String phrase = "test n°";
  phrase += count+1;
  Serial.println(phrase);
  xbee.println(phrase);
  count++;
  delay(5000);
}
