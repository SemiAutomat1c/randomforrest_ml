// Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    // Remove active class from all tabs
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab
    btn.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Single Message Detection
document.getElementById("predictBtn").addEventListener("click", async () => {
  const message = document.getElementById("message").value.trim();
  const resultDiv = document.getElementById("result");

  if (!message) {
    resultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Please enter a message</p>';
    resultDiv.className = "result-box";
    return;
  }

  resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Analyzing message...</p>';
  resultDiv.className = "result-box";

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<i class="fas fa-times-circle"></i><p>Error: ${data.error}</p>`;
      resultDiv.className = "result-box";
    } else {
      if (data.prediction === "Spam") {
        resultDiv.innerHTML = '<i class="fas fa-ban"></i><p>This message is SPAM</p>';
        resultDiv.className = "result-box spam";
      } else {
        resultDiv.innerHTML = '<i class="fas fa-check-circle"></i><p>This message is SAFE</p>';
        resultDiv.className = "result-box not-spam";
      }
    }
  } catch (error) {
    resultDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>Server error occurred</p>';
    resultDiv.className = "result-box";
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("message").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("result").className = "result-box";
});

// Batch Detection - File Upload
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFileBtn = document.getElementById('removeFile');
const batchAnalyzeBtn = document.getElementById('batchAnalyzeBtn');

let selectedFile = null;

uploadArea.addEventListener('click', () => {
  fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect(files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0]);
  }
});

function handleFileSelect(file) {
  const validTypes = ['.csv', '.txt'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!validTypes.includes(fileExtension)) {
    alert('Please upload a CSV or TXT file');
    return;
  }
  
  selectedFile = file;
  fileName.textContent = file.name;
  uploadArea.style.display = 'none';
  fileInfo.style.display = 'flex';
  batchAnalyzeBtn.style.display = 'block';
}

removeFileBtn.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  uploadArea.style.display = 'block';
  fileInfo.style.display = 'none';
  batchAnalyzeBtn.style.display = 'none';
  document.getElementById('batchResults').innerHTML = '';
  document.getElementById('batchProgress').style.display = 'none';
});

batchAnalyzeBtn.addEventListener('click', async () => {
  if (!selectedFile) return;
  
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    const content = e.target.result;
    let messages = [];
    
    // Parse file based on type
    if (selectedFile.name.endsWith('.csv')) {
      const lines = content.split('\n').filter(line => line.trim());
      // Skip header if it exists
      const startIndex = lines[0].toLowerCase().includes('message') ? 1 : 0;
      messages = lines.slice(startIndex).map(line => {
        // Handle CSV with quotes
        const match = line.match(/"([^"]*)"|([^,]+)/);
        return match ? (match[1] || match[2]).trim() : line.trim();
      });
    } else {
      // TXT file - one message per line
      messages = content.split('\n').filter(line => line.trim());
    }
    
    if (messages.length === 0) {
      alert('No messages found in file');
      return;
    }
    
    await processBatch(messages);
  };
  
  reader.readAsText(selectedFile);
});

async function processBatch(messages) {
  const progressSection = document.getElementById('batchProgress');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const resultsDiv = document.getElementById('batchResults');
  
  progressSection.style.display = 'block';
  resultsDiv.innerHTML = '';
  
  const results = [];
  let spamCount = 0;
  let safeCount = 0;
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      const isSpam = data.prediction === 'Spam';
      
      results.push({
        message: message,
        prediction: data.prediction,
        isSpam: isSpam
      });
      
      if (isSpam) spamCount++;
      else safeCount++;
      
    } catch (error) {
      results.push({
        message: message,
        prediction: 'Error',
        isSpam: false
      });
    }
    
    // Update progress
    const progress = ((i + 1) / messages.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Processing: ${Math.round(progress)}% (${i + 1}/${messages.length})`;
  }
  
  displayResults(results, spamCount, safeCount);
  progressSection.style.display = 'none';
}

function displayResults(results, spamCount, safeCount) {
  const resultsDiv = document.getElementById('batchResults');
  
  const total = results.length;
  const spamPercent = ((spamCount / total) * 100).toFixed(1);
  const safePercent = ((safeCount / total) * 100).toFixed(1);
  
  let html = `
    <div class="results-header">
      <h3><i class="fas fa-list-check"></i> Analysis Complete</h3>
      <button class="export-btn" onclick="exportResults()">
        <i class="fas fa-download"></i> Export Results
      </button>
    </div>
    
    <div class="results-summary">
      <div class="summary-card">
        <h4>Total Messages</h4>
        <div class="value">${total}</div>
      </div>
      <div class="summary-card">
        <h4>Spam Detected</h4>
        <div class="value">${spamCount} (${spamPercent}%)</div>
      </div>
      <div class="summary-card">
        <h4>Safe Messages</h4>
        <div class="value">${safeCount} (${safePercent}%)</div>
      </div>
    </div>
    
    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Message</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  results.forEach((result, index) => {
    const badgeClass = result.isSpam ? 'badge-spam' : 'badge-safe';
    const icon = result.isSpam ? '<i class="fas fa-ban"></i>' : '<i class="fas fa-check"></i>';
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${result.message.substring(0, 100)}${result.message.length > 100 ? '...' : ''}</td>
        <td><span class="badge ${badgeClass}">${icon} ${result.prediction}</span></td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  resultsDiv.innerHTML = html;
  
  // Store results for export
  window.batchResults = results;
}

function exportResults() {
  if (!window.batchResults) return;
  
  let csv = 'Message,Prediction\n';
  window.batchResults.forEach(result => {
    const message = result.message.replace(/"/g, '""'); // Escape quotes
    csv += `"${message}","${result.prediction}"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spam_detection_results_${new Date().getTime()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
