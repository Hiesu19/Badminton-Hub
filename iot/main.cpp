#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ===== WIFI =====
const char* WIFI_SSID = "abcdef";
const char* WIFI_PASSWORD = "1234567899";

// ===== MQTT =====
const char* MQTT_HOST = "411294335e634cba99fe79d749850513.s1.eu.hivemq.cloud";
const int MQTT_PORT = 8883;
const char* MQTT_USER = "admin_hieu";
const char* MQTT_PASS = "Hieu123@";

// ===== DEVICE CONFIG =====
const char* SUPPER_COURT_ID = "2";
const char* DEVICE_KEY = "524f79a3f30e8462";

// ===== ZONE → GPIO MAP =====
struct ZoneMap {
  int zone;
  int pin;
};

ZoneMap zones[] = {
  {5, 2},
  {6, 4},
  {7, 19},
  {10, 22}
};

const int ZONE_COUNT = sizeof(zones) / sizeof(zones[0]);

int getPinFromZone(int zone) {
  for (int i = 0; i < ZONE_COUNT; i++) {
    if (zones[i].zone == zone) {
      return zones[i].pin;
    }
  }
  return -1;
}

// ===== MQTT OBJECT =====
WiFiClientSecure espClient;
PubSubClient client(espClient);

String subTopic;

// ===== CALLBACK =====
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println("\n--- MQTT MESSAGE ---");
  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  Serial.println(message);

  // Parse JSON
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, message);

  if (error) {
    Serial.print("JSON parse error: ");
    Serial.println(error.c_str());
    return;
  }

  int zone = doc["zone"];
  const char* cmd = doc["cmd"];

  Serial.printf("Zone = %d | Cmd = %s\n", zone, cmd);

  int pin = getPinFromZone(zone);

  if (pin == -1) {
    Serial.println("Zone không tồn tại trên thiết bị này");
    return;
  }

  if (strcmp(cmd, "ON") == 0) {
    digitalWrite(pin, HIGH);
    Serial.printf("GPIO %d -> ON\n", pin);
  }
  else if (strcmp(cmd, "OFF") == 0) {
    digitalWrite(pin, LOW);
    Serial.printf("GPIO %d -> OFF\n", pin);
  }
  else {
    Serial.println("Cmd không hợp lệ");
  }
}

// ===== MQTT CONNECT =====
void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting MQTT... ");

    if (client.connect("ESP32_Light", MQTT_USER, MQTT_PASS)) {
      Serial.println("connected");

      client.subscribe(subTopic.c_str());
      Serial.print("Subscribed topic: ");
      Serial.println(subTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.println(client.state());
      delay(3000);
    }
  }
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);

  // Init GPIO
  for (int i = 0; i < ZONE_COUNT; i++) {
    pinMode(zones[i].pin, OUTPUT);
    digitalWrite(zones[i].pin, LOW);
  }

  // Build topic
  subTopic = "field/";
  subTopic += SUPPER_COURT_ID;
  subTopic += "/";
  subTopic += DEVICE_KEY;
  subTopic += "/light";

  Serial.print("Final SUB topic: ");
  Serial.println(subTopic);

  // WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  // SSL
  espClient.setInsecure();

  // MQTT
  client.setServer(MQTT_HOST, MQTT_PORT);
  client.setCallback(callback);
}

// ===== LOOP =====
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
