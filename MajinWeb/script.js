document.addEventListener('DOMContentLoaded', function() {
    // Get references to the DOM elements
    const colorModeBtn = document.getElementById('colorMode');
    const simpleImageModeBtn = document.getElementById('simpleImageMode');
    const complexImageModeBtn = document.getElementById('complexImageMode');
    const binaryModeBtn = document.getElementById('binaryMode');
    const predictionModeBtn = document.getElementById('predictionMode'); // New Prediction Mode Button
    const resetScoreBtn = document.getElementById('resetScore'); 
    const imageDisplay = document.getElementById('imageDisplay');
    const randomImage = document.getElementById('randomImage');
    const correctScoreElement = document.getElementById('correctScore');
    const wrongScoreElement = document.getElementById('wrongScore');
    const predictionCorrectScoreElement = document.getElementById('predictionCorrectScore'); // New Prediction Correct Score
    const predictionWrongScoreElement = document.getElementById('predictionWrongScore'); // New Prediction Wrong Score
    const scoreboardDivs = document.querySelectorAll('.scoreboard div'); // Div elements for scores

    // Arrays holding your data
    const colors = ['colors/c1.png', 'colors/c2.png', 'colors/c3.png', 'colors/c4.png', 'colors/c5.png', 'colors/c6.png', 'colors/c7.png'];
    const simpleImages = Array.from({ length: 10 }, (_, i) => `simple images/${i + 1}.png`);
    const complexImages = Array.from({ length: 50 }, (_, i) => `images/${i + 1}.png`);
    const binaryColors = ['colors/c6.png', 'colors/c7.png'];

    // Scoring variables
    let correctScore = 0;
    let wrongScore = 0;
    let predictionCorrectScore = 0; // Prediction Correct Score
    let predictionWrongScore = 0; // Prediction Wrong Score
    let currentColor = ''; // To keep track of the currently displayed binary color
    let prediction = null; // To keep track of user prediction in Prediction Mode

    // Mode flags
    let isBinaryMode = false; // Track if Binary Mode is active
    let isPredictionMode = false; // Track if Prediction Mode is active

    // Function to get a random item from an array
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Update the score display
    function updateScores() {
        correctScoreElement.textContent = correctScore;
        wrongScoreElement.textContent = wrongScore;
        predictionCorrectScoreElement.textContent = predictionCorrectScore; // Update Prediction Correct Score
        predictionWrongScoreElement.textContent = predictionWrongScore; // Update Prediction Wrong Score
    }

    // Function to toggle the visibility of the scoreboard
    function toggleScoreVisibility(binaryModeVisible, predictionModeVisible) {
        // Show/Hide the correct/wrong score texts for Binary Mode
        correctScoreElement.parentElement.style.display = binaryModeVisible ? 'block' : 'none';
        wrongScoreElement.parentElement.style.display = binaryModeVisible ? 'block' : 'none';

        // Show/Hide the prediction correct/wrong score texts for Prediction Mode
        predictionCorrectScoreElement.parentElement.style.display = predictionModeVisible ? 'block' : 'none';
        predictionWrongScoreElement.parentElement.style.display = predictionModeVisible ? 'block' : 'none';
    }

    // Event listeners for buttons
    colorModeBtn.addEventListener('click', () => {
        isBinaryMode = false;
        isPredictionMode = false;
        const colorPath = getRandomItem(colors);
        randomImage.src = colorPath;
        imageDisplay.style.display = 'block';
        toggleScoreVisibility(false, false); // Hide all scores
    });

    simpleImageModeBtn.addEventListener('click', () => {
        isBinaryMode = false;
        isPredictionMode = false;
        const imagePath = getRandomItem(simpleImages);
        randomImage.src = imagePath;
        imageDisplay.style.display = 'block';
        toggleScoreVisibility(false, false); // Hide all scores
    });

    complexImageModeBtn.addEventListener('click', () => {
        isBinaryMode = false;
        isPredictionMode = false;
        const imagePath = getRandomItem(complexImages);
        randomImage.src = imagePath;
        imageDisplay.style.display = 'block';
        toggleScoreVisibility(false, false); // Hide all scores
    });

    // Event listener for Binary button
    binaryModeBtn.addEventListener('click', () => {
        isBinaryMode = true;
        isPredictionMode = false;
        currentColor = getRandomItem(binaryColors);
        randomImage.src = currentColor;
        imageDisplay.style.display = 'block';
        toggleScoreVisibility(true, false); // Show Binary Mode scores, hide Prediction scores
    });

    // Event listener for Prediction Mode button
    predictionModeBtn.addEventListener('click', () => {
        isBinaryMode = false;
        isPredictionMode = true;
        prediction = null; // Reset prediction for a new test
        currentColor = getRandomItem(binaryColors);
        imageDisplay.style.display = 'none'; // Hide the image until the user presses 2
        toggleScoreVisibility(false, true); // Show Prediction Mode scores, hide Binary scores
    });

    // Event listener for numberpad key 2 (Binary and Prediction mode trigger)
    document.addEventListener('keydown', function(event) {
        if (event.key === '2' && (isBinaryMode || isPredictionMode)) { // Only works in Binary or Prediction Mode
            if (prediction !== null && isPredictionMode) { // If we're in Prediction Mode
                currentColor = getRandomItem(binaryColors);
                randomImage.src = currentColor;
                imageDisplay.style.display = 'block';

                // Check if the prediction was correct
                if ((prediction === '1' && currentColor === 'colors/c6.png') || 
                    (prediction === '3' && currentColor === 'colors/c7.png')) {
                    predictionCorrectScore++;
                } else {
                    predictionWrongScore++;
                }
                updateScores();
                prediction = null; // Reset prediction after checking
            } else if (isBinaryMode) { // Normal Binary mode
                currentColor = getRandomItem(binaryColors);
                randomImage.src = currentColor;
                imageDisplay.style.display = 'block';
            }
        }
    });

    // Event listener for numberpad keys 1 and 3 (Prediction and Binary Mode input)
    document.addEventListener('keydown', function(event) {
        if (isPredictionMode && prediction === null && (event.key === '1' || event.key === '3')) { // Only allow prediction in Prediction Mode
            prediction = event.key; // Store the prediction (1 for c6 or 3 for c7)
        } else if (isBinaryMode && currentColor) { // Scoring for Binary mode
            if (event.key === '1' && currentColor === 'colors/c6.png') {
                correctScore++;
            } else if (event.key === '3' && currentColor === 'colors/c7.png') {
                correctScore++;
            } else if (event.key === '1' && currentColor === 'colors/c7.png') {
                wrongScore++;
            } else if (event.key === '3' && currentColor === 'colors/c6.png') {
                wrongScore++;
            }
            updateScores();
        }
    });

    // Event listener for Reset Score button
    resetScoreBtn.addEventListener('click', () => {
        correctScore = 0;
        wrongScore = 0;
        predictionCorrectScore = 0; // Reset Prediction Correct Score
        predictionWrongScore = 0; // Reset Prediction Wrong Score
        updateScores(); // Reset the score display
    });

    // Event listener for numberpad key 5 (Image Reset, only in Prediction Mode)
    document.addEventListener('keydown', function(event) {
        if (event.key === '5' && isPredictionMode) { // Only works in Prediction Mode
            randomImage.src = ''; // Clear the image
            imageDisplay.style.display = 'none'; // Hide the image element
            imageDisplay.insertAdjacentHTML('beforeend', '<p id="resetText">IMAGE RESET</p>'); // Display "IMAGE RESET"
            setTimeout(() => {
                document.getElementById('resetText').remove(); // Remove the message after a short period
            }, 1500); // Display the message for 1.5 seconds
        }
    });

    // Event listener for numberpad key 9 (Reset score functionality)
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Numpad9') { // Check if Numpad 9 is pressed
            correctScore = 0;
            wrongScore = 0;
            predictionCorrectScore = 0;
            predictionWrongScore = 0;
            updateScores(); // Reset the score display
        }
    });
});
