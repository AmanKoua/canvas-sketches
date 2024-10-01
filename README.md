# How to set up the project

- Install node js (I'm runing 20.17.0 and it works fine).
- Open a terminal in the directory, and run "npm install". This will install all of the required 3rd party dependencies.
- Start the animated sketch with "npx canvas-sketch circular2 --open --output=output/data --stream". This will start a local dev server, allowing you to modify the code and see the updates in real-time in the browser.
    - "--open" will open the file in the browser
    - "--output=output/data" will set the output directory to output/data (if you choose to save videos / images)
    - "--stream" will save a video instead of a PNG
- Press "ctrl + shift + s" in the browser to start recording videos. This feature is unstable, and might be broken :(

- All docs for the canvas-sketch library are here: https://github.com/mattdesl/canvas-sketch/blob/master/docs/README.md
- Very helpful docs for the canvas API : https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D api.

- HMU with any questions
