#define BLYNK_PRINT Serial // Enables Serial Monitor
#include <ServerExceed.h>
#include <SPI.h>
#include <BlynkSimpleEsp8266.h>

// Setting for Server
WiFiServer server(80); // nodeMCU server : port 80
char ssid[] = "nodeMCU only";
char password[] = "";
char host[] = "10.32.176.4";
int port = 80;
String group = "exvariable";
ServerExceed mcu(ssid, password, host, port, group, &server);

void setup() {
  Serial.begin(115200);
  mcu.connectServer();
  BLYNK_PRINT.println("\n\n[- nodeMCU -] Connected.");
  BLYNK_PRINT.print("[- nodeMCU -] IPAddress : ");
  BLYNK_PRINT.println(WiFi.localIP());
}

String data = "";

void loop() {
  if(Serial.available()) {
  	data = Serial.readStringUntil('\r');
    data.replace("\r","");
    data.replace("\n","");
  	Serial.flush();
  	mcu.sendDataFromBoardToServer(data);
  }
  mcu.sendDataFromServerToBoard();
}
