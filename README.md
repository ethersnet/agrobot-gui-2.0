# Agrobot GUI

This is a graphical user interface based on React and Typescript for the MIT Bioinstrumentation Lab Agrobot.

## Set Up

As a react project, this depends on npm and Node. <br>
Install both following the instructions here: https://github.com/nodesource/distributions#deb.


Then, install ROS melodic. Follow the insructions here: https://wiki.ros.org/melodic/Installation/Ubuntu.

Install RosbridgeSuite package, WebVideoServer, and their dependencies, as shown below:
```
sudo apt-get install ros-melodic-rosbridge-suite
sudo apt-get install ros-melodic-web-video-server

rosdep update
rosdep install rosbridge_server
rosdep install web_video_server
```

Then, clone this repository and cd into its directory. There run: <br>
```
npm install
npm start
```

This will launch the GUI at http://localhost:3000.

## Structure

Within the src folder:
- /Widgets: Stores all the small individual functional elements of the GUI, such as the camera stream and the map.
- /scss: Stores all the style files.
- /store: Stores all redux files.
- App.tsx: aligns all the main structural elements.
- MapBar.tsx: structural element that controls the white bar at the bottom.
- StatusBar.tsx: structural element that controls the white bar at the top.
