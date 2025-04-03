# D-Link-DWR-921-reboot

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A simple Node.js script for pinging and rebooting D-Link DWR-921 router when internet connection becomes unstable.

## ⚠️ Disclaimer

THIS PROJECT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.

This project was created for personal use to save time and maintain stable internet
connection when occasional freezes occur. The code contains slightly modified pieces
from the router's web interface (reverse-engineered as no official API documentation
was available).

Use at your own risk. The author accepts no responsibility for any issues caused by
this software. This is published for demonstration purposes only and might be helpful
to someone in similar situation.

NO SUPPORT WILL BE PROVIDED. The author explicitly disclaims all responsibility for
any legal questions or consequences arising from the use of this code.


## 📝 Description

This script:
1. Periodically pings a reliable external server (Google DNS by default)
2. Detects when internet connection becomes unresponsive
3. Automatically reboots the D-Link DWR-921 router
4. Helps restore internet connectivity without manual intervention

## 🛠️ Installation

### 1. Ensure you have Node.js (v14+) installed
### 2. Clone this repository:
git clone https://github.com/gogalef/D-Link-DWR-921-reboot.git

### 3. Navigate to the project directory:
cd D-Link-DWR-921-reboot

### 4. Install dependencies:
npm install

## ⚙️ Configuration

Create a .env file in the project root with:

ROUTER_USERNAME=username
ROUTER_PASSWORD=passwd
ROUTER_IP=192.168.0.1
PING_TARGET=8.8.8.8

## 🚀 Usage

# Run the script:
node router_reboot.js

## 🧑‍💻 About Code Quality

Yes, I'm perfectly aware there are many non-ideal solutions here.
But this code was born from a simple principle: "If it works, don't touch it!"

When you need to choose between:
- Spending 2 hours on "pretty" code
- Or 20 minutes on "working" code
- And getting the same functioning router

The choice is obvious. I understand the difference between when code should be:
- Perfect (production, commercial projects)
- And "good enough" (personal utilities, quick hacks)

This script is definitely the second case. It does exactly what it's supposed to,
and makes no claims to being "exemplary". To hell with clean code 
when the internet is working again! 

## 🔧 Customization

You can modify:
- Ping target (in .env file) 
- Ping interval (in code) 
- Failure threshold (how many failed pings before reboot in code)
- Router reboot logic if needed

## 📄 License

This project has no license and is provided for educational/demonstrational purposes only.
All rights reserved by the original authors of any borrowed code segments.

For e-mails: gogalef97@gmail.com
