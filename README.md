# Automated TV Testing Tool

This is a hardware and software tool that enables TVs and Set-Top-Boxes to be tested in an automated manner.

*This is Under development - The features below are goals at this point*

Using ATVTT you can :

* Record a testing session using any IR remote control.
* Play back a session to multiple TVs.
* With the addition of some API calls to your app, logs can be recorded and saved to the server.

## Hardware Setup

Install a standard 'rasberrian' debian OS image. The easiest way to do this is via [Noobs](https://projects.raspberrypi.org/en/projects/noobs-install).

You will want to boot the device and using Settings, enable SSH. You will then be able to connect to the device using a SSH client.

### Installing Touch Screen

Select the screen/touch technology appropriate for the display you have purchased. I used the 2.8" 'Cupcade'.

```
$ curl https://raw.githubusercontent.com/adafruit/Raspberry-Pi-Installer-Scripts/master/pitft-fbcp.sh >pitft-fbcp.sh
$ sudo bash pitft-fbcp.sh

Select project:
1. PiGRRL 2
2. Pocket PiGRRL
3. PiGRRL Zero
4. Cupcade (horizontal screen)
5. Cupcade (vertical screen)
6. Configure options manually

SELECT 1-6: 5

Device: pitft28-resistive
HDMI framebuffer rotate: 1
TFT MADCTL rotate: 90

Starting installation...
```

After a reboot the screen should be active and functional on boot.

### Configuring App to Load on Bootup

Edit `/etc/xdg/lxsession/LXDE-pi/autostart` and add a line to open chromium on localhost.

```
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```
Append this line to the end.

`/usr/lib/chromium-browser/chromium-browser --kiosk --disable-restore-session-state http://localhost`
