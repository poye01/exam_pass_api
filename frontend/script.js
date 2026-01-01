document
  .getElementById("predictForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      age: Number(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      course: document.getElementById("course").value,
      study_hours: Number(document.getElementById("study_hours").value),
      class_attendance: Number(
        document.getElementById("class_attendance").value
      ),
      internet_access: document.getElementById("internet_access").value,
      sleep_hours: Number(document.getElementById("sleep_hours").value),
      sleep_quality: document.getElementById("sleep_quality").value,
      study_method: document.getElementById("study_method").value,
      facility_rating: document.getElementById("facility_rating").value,
      exam_difficulty: document.getElementById("exam_difficulty").value,
    };

    const model = document.getElementById("model").value;
    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "Predicting...";

    try {
      const response = await fetch(
        `https://exam-pass-api-1.onrender.com/predict?model=${model}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }

      const result = await response.json();
      if (result.prediction) {
        resultDiv.innerText = `This student has ${result.prediction.toUpperCase()}.`;
      } else if (result.error) {
        resultDiv.innerText = `Error: ${result.error}`;
      }
    } catch (err) {
      resultDiv.innerText = "Error connecting to backend.";
      console.error(err);
    }
  });
