const imageUpload = document.getElementById('image-upload');
const analyzeBtn = document.getElementById('analyze-btn');
const previewImage = document.getElementById('preview-image');
const resultsDiv = document.getElementById('results');
const loader = document.getElementById('loader');

let model;

// Load MobileNet model
async function loadModel() {
    try {
        resultsDiv.innerHTML = '<p>Loading model, please wait...</p>';
        model = await mobilenet.load();
        console.log('✅ MobileNet model loaded successfully');
        resultsDiv.innerHTML = '<p class="placeholder">Model loaded. Now select an image.</p>';
    } catch (error) {
        console.error('Error loading model:', error);
        resultsDiv.innerHTML = '<p style="color:red;">Failed to load model. Try reloading.</p>';
    }
}

// Handle image upload
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        analyzeBtn.disabled = false;
        resultsDiv.innerHTML = '<p class="placeholder">Click "Analyze" to identify objects</p>';
    };
    reader.readAsDataURL(file);
});

// Analyze image
analyzeBtn.addEventListener('click', async () => {
    if (!model) {
        resultsDiv.innerHTML = '<p style="color:red;">Model not loaded yet.</p>';
        return;
    }

    resultsDiv.innerHTML = '';
    loader.style.display = 'flex';
    analyzeBtn.disabled = true;

    try {
        const predictions = await model.classify(previewImage);
        loader.style.display = 'none';
        displayResults(predictions);
    } catch (error) {
        console.error('Error analyzing image:', error);
        loader.style.display = 'none';
        resultsDiv.innerHTML = '<p style="color:red;">Error analyzing image.</p>';
    }

    analyzeBtn.disabled = false;
});

// Display top predictions
function displayResults(predictions) {
    resultsDiv.innerHTML = '<h3>Results:</h3>';
    predictions.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <strong>${index + 1}. ${p.className}</strong>
            <span style="float:right">${(p.probability * 100).toFixed(2)}%</span>
        `;
        resultsDiv.appendChild(div);
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', loadModel);
