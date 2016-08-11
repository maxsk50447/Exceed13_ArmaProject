#include <pt.h>
#include <Wire.h>
#include <BMP085.h>
#include <LiquidCrystal.h>
LiquidCrystal lcd(8,9,4,5,6,7);
#define PT_DELAY(pt, ms, ts) \
  ts = millis(); \
  PT_WAIT_WHILE(pt, millis()-ts < (ms));
  
//defining names
  #define Heartrate A1 
  #define LPG A2
  #define LED 13
  #define GY61 A0
  
//constructing protothreads
  struct pt pt_taskHeartrate;
  struct pt pt_taskBMP085;
  struct pt pt_taskGY61;
  struct pt pt_taskLPG;
  struct pt pt_taskLED;
  struct pt pt_controller;

BMP085 bmp;  
//static String data;  
// declaring variables
static int totalTime = 0;
static int lastTime = 0;
static int beatCounter = 0;
static int totalBeats = 10;
static int BPM[10];
static int sumBPM = 0;
static int avgBPM = 0;
//
static long temp = 0;
//
int adcValue = 0;
float v = 0;
float valLPG = 0;
//
int xAcceleration = 0;
//
boolean healthStatus = true;

void setup() {
  Serial.begin(9600);
  Serial1.begin(115200);
  lcd.begin(16, 2);
  bmp.begin();
  pinMode(Heartrate, INPUT);
  pinMode(GY61, INPUT);
  pinMode(LPG, INPUT);
  pinMode(LED, OUTPUT);
  PT_INIT(&pt_taskHeartrate); 
  PT_INIT(&pt_taskLPG); 
  PT_INIT(&pt_controller);
  PT_INIT(&pt_taskBMP085);
  PT_INIT(&pt_taskGY61);
}
PT_THREAD(task_BMP085(struct pt*pt)) {
  static uint32_t ts;
  PT_BEGIN(pt);
  while(1) {
    temp = bmp.readTemperature();
    PT_DELAY(pt, 500, ts);
  }
  PT_END(pt);
}
PT_THREAD(task_Heartrate(struct pt*pt)) {
  static uint32_t ts;
  PT_BEGIN(pt);
  while(1) {
    if (digitalRead(Heartrate)>0)
       heartrateEvent();
    else if(ts-lastTime > 2000)
        avgBPM = 0;
    PT_DELAY(pt, 375, ts);
  }
  PT_END(pt);
}
void heartrateEvent() {
    totalTime = millis()-lastTime;
    lastTime = millis();
    BPM[beatCounter] = 60000/totalTime;
    beatCounter++;
    if(beatCounter>totalBeats-1) {
      beatCounter=0;
    }
    sumBPM = 0;
    avgBPM = 0;
    for (int i = 0;i<totalBeats;i++) {
      sumBPM = sumBPM + BPM[i];
    }
    avgBPM = sumBPM/(totalBeats-1);
}

PT_THREAD(task_LPG(struct pt*pt)) {
  static uint32_t ts;
  PT_BEGIN(pt);
  while(1) {
    adcValue = analogRead(A2);
    v = adcValue*(5.00/1024);
    valLPG=((100-(20.00*v))/v);
    PT_DELAY(pt, 300, ts);
  }
  PT_END(pt);
}
PT_THREAD(task_GY61(struct pt*pt)) {
  static uint32_t ts;
  PT_BEGIN(pt);
  while(1) {
    xAcceleration = analogRead(A0);
    PT_DELAY(pt, 300, ts);
  }
  PT_END(pt);
}
void loop() {
  task_Heartrate(&pt_taskHeartrate);
  task_LPG(&pt_taskLPG);
  task_BMP085(&pt_taskBMP085);
  task_GY61(&pt_taskGY61);
  controller(&pt_controller);
}
PT_THREAD(controller(struct pt*pt)) {
  static uint32_t ts;
  static char tempChar[50];
  PT_BEGIN(pt);
  while(1) {
 //   data+=avgBPM; data+="_";
    sprintf(tempChar, "%.2f", valLPG); 
 //   data+=tempChar; data+="_";
 //   data+=temp; data+="_";
 //   data+=xAcceleration;
    Serial1.println(String(avgBPM) + "_" + tempChar + "_" + String(temp) + "_" + String(xAcceleration));
    //data="";
    serialReport();
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("BPM: ");
    lcd.print(avgBPM);
    lcd.setCursor(0,1);
    lcd.print("Temperature:");
    lcd.print((String)(temp) + " C");  
    PT_DELAY(pt, 500, ts);
  }
  PT_END(pt);
}
void serialReport() {
 Serial.print("BPM: ");
 Serial.print(avgBPM);
 Serial.print(", Gas value: ");
 Serial.print(valLPG);
 Serial.print(", Temperature: ");
 Serial.print(temp);
 Serial.print(", X-acceleration: ");
 Serial.print(xAcceleration);
 Serial.println();
}
