#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "HX711.h"
#define BLYNK_PRINT Serial
#include <Blynk.h>
#include <BlynkSimpleEsp8266.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd = LiquidCrystal_I2C(0x27,16,2);
#define BLYNK_PRINT Serial
 
#define BLYNK_TEMPLATE_ID "TMPLab0iBx80"
#define BLYNK_DEVICE_NAME "Load Weight"

#define BLYNK_AUTH_TOKEN "k07Ysafs4GumOQrXkjT9MRM146AwK-t7"
char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "Redmif";
char pass[] = "123456789";
//dashboard
const char* SERVER_NAME = "http://bloodanytime.com/value/sensordata.php";
String PROJECT_API_KEY = "value";

unsigned long lastMillis = 0;
long interval = 3000;
//dashboard
//web server
const char* host = "maker.ifttt.com";
const int httpsPort = 443;
const char* fingerprint = "616275faea5f64954af6090f59c90de71e6d66a3";
String value1 = "MP04557800";
 //web server
 
WiFiClient client;

const int LOADCELL_DOUT_PIN = 14;
const int LOADCELL_SCK_PIN = 12;

HX711 scale;
 
//int rbutton = 2; // this button will be used to reset the scale to 0.
float weight;
float calibration_factor = 235640;  //cf 235640

#define led D3
#define led1 D7
#define led2 D8 

void setup() 
{
  Serial.begin(9600);
 
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
//  pinMode(rbutton, INPUT_PULLUP); 
  scale.set_scale();
  scale.tare(); //Reset the scale to 0
  long zero_factor = scale.read_average(); //Get a baseline reading
  Blynk.begin(auth, ssid, pass,"blynk.cloud",80);

  //pinMode(2,HIGH);
  pinMode(led,OUTPUT);
  pinMode(led1,OUTPUT);
 pinMode(led2,OUTPUT);
  
  lcd.begin();
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("The Metadaters");
  delay(3000);
  lcd.setCursor(1,1);
  lcd.print(" Presents ");
  lcd.clear();
  lcd.print("Load Measurement");
  delay(2000);
  lcd.clear();
 
  lcd.print("Connecting Wifi");
  
  WiFi.begin(ssid, pass);
  {
  delay(1000);
  Serial.print(".");
  lcd.clear();
  }
  Serial.println("");
  Serial.println("WiFi connected");
  lcd.clear();
  lcd.print("WiFi connected");

  //webserver
  HTTPClient http;
 http.GET();
 http.end();
 Serial.print("done");
 //webserver
   
  delay(2000);
  lcd.clear();
 
}
 
void loop() 
 
{
 
   Blynk.run();
  scale.set_scale(calibration_factor); //Adjust to this calibration factor
 
  weight = scale.get_units(5); 
 
  lcd.setCursor(0, 0);
  lcd.print("Measured Weight");
  lcd.setCursor(0, 1);
  lcd.print(weight);
  lcd.print(" KG  ");
  Blynk.virtualWrite(V3, weight);
  delay(2000);
  lcd.clear();
  
  Serial.print("Weight: ");
  Serial.print(weight);
  Serial.println(" KG");
  Serial.println();
  
   digitalWrite(led,HIGH);
  digitalWrite(led1,LOW);
  digitalWrite(led2,LOW);

  if(weight>=0.20 && weight<0.25)
  {
  digitalWrite(led,LOW);
  digitalWrite(led1,LOW);
  digitalWrite(led2,HIGH);
  }

  
  if(weight>=0.33)
  {
    Blynk.logEvent("over_weight","Truck Is Over Loaded");
    digitalWrite(led,LOW);
    digitalWrite(led1,HIGH);
    //digitalWrite(led2,LOW);

      
  //Check WiFi connection status
  if(WiFi.status()== WL_CONNECTED){
    if(millis() - lastMillis > interval) {
       //Send an HTTP POST request every interval seconds
       upload();
       lastMillis = millis();
    }
  }
  
  else {
    Serial.println("WiFi Disconnected");
  }

    //webserver
       // Use WiFiClientSecure class to create TLS connection
        WiFiClientSecure client;
        Serial.print("connecting to ");
        Serial.println(host);

        Serial.print("Using fingerprint: ");
        Serial.println(fingerprint);
        client.setFingerprint(fingerprint);

        if (!client.connect(host, httpsPort))
        {
          Serial.println("connection failed");
          return;
        }

        String url = "/trigger/OverWeighted/with/key/fxqyDBLhxEIpgDGP3R7knLFRmW3pO89mw8sOkgyZZSt?value1="+value1;
        Serial.print("requesting URL: ");
        Serial.println(url);

        client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                     "Host: " + host + "\r\n" +
                     "User-Agent: BuildFailureDetectorESP8266\r\n" +
                     "Connection: close\r\n\r\n");

        Serial.println("request sent");


    
  }
  
 
}

void upload()
{
  String truck_no = "MP04557800" ;
  
  //HTTP POST request data
  String temperature_data;
  temperature_data = "api_key="+PROJECT_API_KEY;
  temperature_data += "&temperature="+truck_no;
  temperature_data += "&humidity="+(String)weight;

  Serial.print("temperature_data: ");
  Serial.println(temperature_data);
  
  WiFiClient client;
  HTTPClient http;

  http.begin(client, SERVER_NAME);
  // Specify content-type header
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  // Send HTTP POST request
  int httpResponseCode = http.POST(temperature_data);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
    
  // Free resources
  http.end();
  }
