# Image Microwaver API

Backend API for [Image Microwaver](https://github.com/khakomaki/image_microwaver/).

Provides simple image processing capabilities.

## Features

Select mode and intensity to control the outcome of the processed image.

- Mode tells what effect will be used on the image.
- Intensity tells how strongly the effect will be applied.

Modes:

- Normal: Streches image horizontally.
  - positive values make the image wider, negative values thinner.
  - min value -99.
- Defrosting: Changes image saturation.
  - positive values increase saturation, negative values decrease.
  - min value -100 (black & white).
- Grill: Reduces jpeg quality.
  - min value 1
  - max value 100.
- Popcorn: Reduces image resolution.
  - Min value 0

## How to Setup

1. Check that [requirements](#requirements) are satisfied
2. Clone project to desired directory:

```bash
git clone https://github.com/khakomaki/image_microwaver_api .
```

3. install dependencies:

```bash
npm install
```

4. Setup ready!

### Requirements

<a name="requirements"></a>

- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) installed

## How to Use

### Starting the server

Run the following command in the root directory:

```bash
node index.js
```

The API will become available at 'http://localhost:3001'

### API endpoints

The API will have 2 endpoints, 1 for testing and 1 for the image processing.

#### GET /

Used to test if API is working, returns simple message.

#### POST /process-image

Processes given image with given mode and intensity.

Example request:

```json
{
  "image": {image data in base-64},
  "mode": "Grill",
  "intensity": 95
}
```

API responds with processed image (.jpeg).

# TODO

The project is work in a progess, here's planned tasks:

- [ ] Add more modes
- [ ] Implement better error handling and data validation for varying user input
- [ ] Write tests for modes and request handling
- [ ] Skip processing with functions & intensitys which don't affect the image (e.g. Normal, 0)
