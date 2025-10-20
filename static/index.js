document.getElementById("predictBtn").addEventListener("click", async () => {
  const message = document.getElementById("message").value.trim();
  const resultDiv = document.getElementById("result");

  if (!message) {
    resultDiv.textContent = "⚠️ Please enter a message.";
    resultDiv.className = "";
    return;
  }

  resultDiv.textContent = "Analyzing...";
  resultDiv.className = "";

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (data.error) {
      resultDiv.textContent = "❌ Error: " + data.error;
      resultDiv.className = "";
    } else {
      resultDiv.textContent =
        data.prediction === "Spam" ? "🚫 Spam" : "✅ Not Spam";
      resultDiv.className =
        data.prediction === "Spam" ? "spam" : "not-spam";
    }
  } catch (error) {
    resultDiv.textContent = "❌ Server error.";
    resultDiv.className = "";
  }
});

const clearBtn = document.getElementById("clearBtn");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    const messageBox = document.getElementById("message");
    const resultDiv = document.getElementById("result");

    messageBox.value = "";
    resultDiv.textContent = "";
    resultDiv.className = "";

    messageBox.focus();
  });
}
