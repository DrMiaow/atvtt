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

```
`/usr/lib/chromium-browser/chromium-browser --kiosk --disable-restore-session-state http://localhost`
```


### Install LIRC

```
sudo apt install lirc
```

#### Starting LIRCD

```
sudo /etc/init.d/lircd start
```

### Configuring

Power up the Pi and SSH into it.

Enter the following in the terminal to download and install LIRC. Answer 'Yes' to any questions when prompted. Note: Do not copy the '$' sign as that denotes the terminal prompt. This is to help differentiate what is a command and what are contents of a file.

```
$ sudo apt-get install lirc
```

Next we need to add two lines to '/etc/modules', but first make a backup of the modules file.

```
$ cd /etc/
$ sudo cp modules  modules.bak
```

Then using your favorite Linux editor of choice (nano, vim, or even emacs), add the follow two lines to the bottom of the /etc/modules file.

```
lirc_dev
lirc_rpi gpio_in_pin=23 gpio_out_pin=22
```

We also need to update boot configuration file 'boot/config.txt'. As we did for modules, we should make a back up first.

```
$ cd /boot
$ sudo cp config.txt config.txt.bak
```
Then change line 51 of config.txt from

```
#dtoverlay=lirc-rpi
```

to

```
dtoverlay=lirc-rpi,gpio_in_pin=23,gpio_out_pin=22
```

A fresh install of LIRC does not contain a hardware configuration file so you have to create it. User your editor of choice and create the file '/etc/lirc/hardware.conf' with the following contents:

```
########################################################
# /etc/lirc/hardware.conf
#
# Arguments which will be used when launching lircd
LIRCD_ARGS="--uinput --listen"
# Don't start lircmd even if there seems to be a good config file
# START_LIRCMD=false
# Don't start irexec, even if a good config file seems to exist.
# START_IREXEC=false
# Try to load appropriate kernel modules
LOAD_MODULES=true
# Run "lircd --driver=help" for a list of supported drivers.
DRIVER="default"
# usually /dev/lirc0 is the correct setting for systems using udev
DEVICE="/dev/lirc0"
MODULES="lirc_rpi"
# Default configuration files for your hardware if any
LIRCD_CONF=""
LIRCMD_CONF=""
######################################################## 
```

Next we need to update the '/etc/lirc/lirc_options.conf' file, but as always, make a backup first just incase.

```
$ cd /etc/lirc
$ sudo cp lirc_options.conf lirc_options.conf.bak
```

Update line 11 of lirc_options.conf from

```
driver = devinput
```

to

```
driver=default
```

Reboot the Pi by entering the following. You will lose connection so SSH back in when the Pi is done booting up.

```
$ sudo shutdown -r now
```

To test if lirc driver is working

```
$ sudo /etc/init.d/lircd stop
$ mode2 -d /dev/lirc0
```

<press a key in remote and you should see multple lines like below>

```
pulse 560
space 1706
pulse 535
```

to record a custom remote/register a remote device

```
$ sudo /etc/init.d/lircd stop
$ sudo irrecord -d /dev/lirc0 ~/lircd.conf
```

Follow the instruction prompted by the above command carefully and at the end at least configure the ```KEY_POWER```.  At the end ```~/<device-name>.lircd.conf``` file will be generated

backup the original lircd.conf

```
$ sudo mv /etc/lirc/lircd.conf /etc/lirc/lircd_original.conf
$ sudo cp ~/<device-name>.lircd.conf /etc/lirc/lircd.conf.d/
$ sudo /etc/init.d/lircd start
```

you can test if the recorded remote works by

```
$ irsend SEND_ONCE <device-name> KEY_POWER
$ irsend SEND_ONCE <device-name> KEY_VOLUMEUP
```



