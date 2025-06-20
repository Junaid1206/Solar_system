## Overview
This project is an interactive 3D simulation of our solar system built using Three.js. It features all eight planets orbiting the Sun with realistic relative sizes, distances, and orbital speeds. Users can interact with the simulation through mouse/touch controls and view detailed information about each planet.

## Features

1. **Realistic Solar System**:
   - Sun at the center with glowing effect
   - All 8 planets with relative sizes and distances
   - Saturn with visible rings
   - Starry background for space ambiance

2. **Interactive Controls**:
   - Orbit controls to navigate the 3D space
   - Individual speed sliders for each planet
   - Pause/Resume button to freeze the animation
   - Responsive design for both desktop and mobile

3. **Educational Tooltips**:
   - Hover over planets to see detailed information
   - Displays planet name, key facts, diameter, and orbital period
   - Visual highlight when hovering

4. **Technical Features**:
   - Smooth animations using requestAnimationFrame
   - Raycasting for object interaction
   - Responsive design that adapts to screen size
   - Optimized performance with damping controls

## File Structure

1. `index.html` - Main HTML file containing the structure
2. `style.css` - CSS styles for the interface
3. `main.js` - JavaScript code with all the Three.js logic

## How to Use

1. Open `index.html` in a modern web browser
2. Interact with the simulation:
   - Left-click and drag to rotate the view
   - Right-click and drag to pan
   - Scroll to zoom in/out
3. Use the control panel to:
   - Adjust planet speeds with individual sliders
   - Pause/resume the animation
4. Hover over planets to see information

## Technical Requirements

- Modern web browser with WebGL support (Chrome, Firefox, Edge, Safari)
- Internet connection (for loading Three.js from CDN)

## Customization Options

You can easily modify:
- Planet colors, sizes, and distances in the `planets` array
- Tooltip content in each planet's `details` property
- Lighting parameters for different visual effects
- Star density in the background

## Mobile Considerations

- The interface automatically adjusts for smaller screens
- Touch controls work for navigation
- Tooltips appear on tap

## Credits

- Built with Three.js (https://threejs.org/)
- Planet data from NASA factsheets
- Developed by [Junaid shah]

sorry for audio it can't be perfect to match the presentation. I hope you can understand my problem and its teeny problem of pc so can't be prefer audio.
