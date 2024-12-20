import network
import time
import urequests
from machine import Pin, ADC
import dht  # Import the DHT module

# Firebase details
FIREBASE_URL = 'https://smart-plant-1410c-default-rtdb.firebaseio.com'
FIREBASE_API_KEY = 'AIzaSyAH80KeujZowijs5GOezjQ3KR5YrsBMfHs'

# Initialize Wi-Fi
def connect_wifi(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    for _ in range(10):
        if wlan.isconnected():
            print(f'Connected to {ssid}, IP address: {wlan.ifconfig()[0]}')
            return True
        time.sleep(1)
    print(f'Failed to connect to {ssid}')
    return False

def ensure_wifi_connection():
    wlan = network.WLAN(network.STA_IF)
    if not wlan.isconnected():
        print("Not connected to Wi-Fi. Scanning for networks...")
        networks = scan_networks()
        network_index = int(input("Enter the number of the network you want to connect to: "))
        ssid = networks[network_index][0].decode('utf-8')
        password = input("Enter the password for the selected network: ")
        if connect_wifi(ssid, password):
            print("Connected to Wi-Fi.")
        else:
            print("Failed to connect to Wi-Fi. Please check your credentials.")
            while True:
                time.sleep(10)

def scan_networks():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    networks = wlan.scan()
    print("Available networks:")
    for i, net in enumerate(networks):
        ssid, _, _, RSSI, _, hidden = net
        print(f"{i}: SSID: {ssid.decode('utf-8')}, RSSI: {RSSI}, Hidden: {hidden}")
    return networks

# Sensor and Firebase Operations
def read_sensor(pin_num):
    try:
        adc = ADC(Pin(pin_num))
        return int((adc.read_u16() / 65535) * 100)
    except Exception as e:
        print(f'Error reading sensor on pin {pin_num}: {e}')
        return None

def send_to_firebase(path, data):
    try:
        url = f"{FIREBASE_URL}/{path}.json?auth={FIREBASE_API_KEY}"
        response = urequests.put(url, json=data)
        print(f'Data sent to Firebase ({path}): {response.text}')
        response.close()
    except Exception as e:
        print(f'Error sending data to Firebase ({path}): {e}')

def get_from_firebase(path):
    try:
        url = f"{FIREBASE_URL}/{path}.json?auth={FIREBASE_API_KEY}"
        response = urequests.get(url)
        if response.status_code == 200:
            data = response.json()
            response.close()
            return data
        else:
            print(f'Error fetching {path}: {response.status_code}')
            response.close()
            return None
    except Exception as e:
        print(f'Error fetching {path}: {e}')
        return None

# Fetch temperature and humidity data from DHT sensor
def fetch_temperature_and_humidity(sensor):
    try:
        sensor.measure()
        temperature = sensor.temperature()
        humidity = sensor.humidity()
        print(f'Temperature: {temperature}°C, Humidity: {humidity}%')
        return {'temperature': temperature, 'humidity': humidity}
    except Exception as e:
        print(f'Error reading DHT sensor: {e}')
        return None

# Control Functions
def control_water_level_led(water_percentage, led):
    if water_percentage > 75:
        led.on()  # Solid yellow LED for high water level
    elif 25 < water_percentage <= 75:
        led.on()
        time.sleep(3)
        led.off()
        time.sleep(3)
    else:
        for _ in range(3):  # Rapid blinking for low water level
            led.on()
            time.sleep(1)
            led.off()
            time.sleep(1)

def control_motor(auto_mode, manual_pump_status, moisture_percentage, water_percentage, motor, red_led):
    auto_mode = auto_mode.strip().lower()
    manual_pump_status = manual_pump_status.strip().lower()

    if water_percentage < 10:
        print("Water level too low. Motor will not activate.")
        send_to_firebase("Water_Pump_Status", {"status": "inactive", "reason": "low water level"})
        motor.off()
        red_led.on()
    else:
        if manual_pump_status == 'on':
            motor.on()
            red_led.on()
            print("Motor turned ON (manual mode)")
        elif auto_mode == 'on' and moisture_percentage >= 50:
            motor.on()
            print("Motor turned ON (automatic mode)")
            for _ in range(10):
                red_led.on()
                time.sleep(0.5)
                red_led.off()
                time.sleep(0.5)
            motor.off()
            red_led.on()
            print("Motor turned OFF (automatic mode)")
        else:
            print(f"Automatic mode not active or Moisture level too low ({moisture_percentage}%)")
            motor.off()
            red_led.off()

# Main Function
def main():
    # Initialize LEDs, motor, and DHT sensor
    green_led = Pin(3, Pin.OUT)
    red_led = Pin(4, Pin.OUT)
    white_led = Pin(5, Pin.OUT)
    yellow_led = Pin(6, Pin.OUT)
    motor = Pin(2, Pin.OUT)
    dht_sensor = dht.DHT11(Pin(15))  # Use the appropriate GPIO pin for the DHT sensor

    green_led.on()  # Indicate the system is on
    ensure_wifi_connection()

    while True:
        if network.WLAN(network.STA_IF).isconnected():
            white_led.on()  # Indicate Wi-Fi connectivity
        else:
            white_led.off()

        # Send system status to Firebase
        send_to_firebase("system_status", {"online": True})

        # Fetch and send temperature and humidity data from DHT sensor
        dht_data = fetch_temperature_and_humidity(dht_sensor)
        if dht_data:
            send_to_firebase("Temperature_Humidity_Data", dht_data)

        # Read and send soil moisture data
        moisture_percentage = read_sensor(26)
        if moisture_percentage is not None:
            send_to_firebase("Soil_Moisture_Sensor", moisture_percentage)

            auto_mode = get_from_firebase("auto_mode")
            manual_pump_status = get_from_firebase("manual_pump_status")

            print(f'Auto Mode: {auto_mode}, Manual Pump Status: {manual_pump_status}, Soil Moisture: {moisture_percentage}')

            # Read and process water level data
            water_percentage = read_sensor(27)
            if water_percentage is not None:
                send_to_firebase("Water_Level_Sensor", water_percentage)
                control_water_level_led(water_percentage, yellow_led)
                control_motor(auto_mode, manual_pump_status, moisture_percentage, water_percentage, motor, red_led)

        time.sleep(2)  # Delay between cycles

if __name__ == "__main__":
    main()
