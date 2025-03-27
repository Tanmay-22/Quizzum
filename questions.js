let score = 0;
document.addEventListener("DOMContentLoaded", function () {
    const quizSection = document.querySelector(".quiz-section");
    const resultSection = document.querySelector(".result-section");
    const nextButton = document.getElementById("nextBtn");
    const restartButton = document.getElementById("restartBtn");
    const homeButton = document.getElementById("homeBtn");
  
    let currentQuestionIndex = 0;
    let questions = [];
  

    async function fetchQuestions() {
      try {
          console.log("Requesting questions from server...");
  
          const response = await fetch("http://localhost:3000/getquestions");
          console.log(response);
  
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
          console.log("Received response from server");
  
          const data = await response.json();  // Convert response to JSON
          console.log("Received questions from server:", data);
  
          if (!data || !data.results) throw new Error("Invalid data format");
  
          questions = data.results.map((q) => ({
              question: q.question,
              correct: q.correct_answer,
              options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          }));
  
          console.log("Processed questions:", questions);
          showQuestion();  // Call function to display questions
      } catch (error) {
          console.error("Error fetching questions:", error);
          alert("Failed to load questions. Please try again.");
      }
  }
  

  
  
  
   
    function showQuestion() {
      const question = questions[currentQuestionIndex];
      const options = shuffleArray(question.options);
  
      document.getElementById("question-text").innerHTML = question.question;
      const optionList = document.getElementById("option-list");
      optionList.innerHTML = "";
      options.forEach((option) => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option-item");
        optionDiv.textContent = option;
        optionDiv.addEventListener("click", function () {
          selectOption(optionDiv);
        });
        optionList.appendChild(optionDiv);
      });
      document.getElementById("question-progress").textContent = `Question ${
        currentQuestionIndex + 1
      } of ${questions.length}`;
    }
  
   
    function selectOption(selectedOption) {
      const options = document.querySelectorAll(".option-item");
      const correctAnswer = questions[currentQuestionIndex].correct;
      options.forEach((option) => {
        option.style.pointerEvents = "none";
        if (option.textContent === correctAnswer) {
          option.style.backgroundColor = "#90EE90";
        }
        if (option === selectedOption && option.textContent !== correctAnswer) {
          option.style.backgroundColor = "#FFB6C1";
        }
      });
      if (selectedOption.textContent === correctAnswer) {
        score++;
      }
      nextButton.style.display = "block";
    }
  
    nextButton.addEventListener("click", () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        resetOptions();
        showQuestion();
      } else {
        quizSection.classList.remove("active");
        resultSection.classList.add("active");
        showResult();
      }
    });
  

    function resetOptions() {
      const options = document.querySelectorAll(".option-item");
      options.forEach((option) => {
        option.style.backgroundColor = "white";
        option.style.pointerEvents = "auto";
      });
      nextButton.style.display = "none";
    }
  

    function showResult() {
      document.getElementById("score").textContent = score;
      document.getElementById("total-questions").textContent = questions.length;
    }
  

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  
  
    restartButton.addEventListener("click", () => {
      console.log("Restart Clicked - Score Before Update:", score);
    updateScore(); 
    setTimeout(() =>window.location.href = "categories.html", 100); 
    });

    homeButton.addEventListener("click", () => {
      console.log("Home Clicked - Score Before Update:", score); 
    updateScore(); 
    setTimeout(() => window.location.href = "index.html", 100);
    });
  
 
    fetchQuestions();
  });
  

  function updateScore() {
    let csvData = JSON.parse(localStorage.getItem("csvData")) || [];

    if (typeof score === "undefined") {
        // console.error(" Score is undefined! Make sure it is declared globally.");
        return;
    }


    if (csvData.length > 0) {
        console.log("Before Updating Score:", csvData); 
        csvData[csvData.length - 1][2] = parseInt(score, 10) || 0; 

        localStorage.setItem("csvData", JSON.stringify(csvData));
        console.log("Updated Score:", localStorage.getItem("csvData")); 
    } else {
        // console.warn(" No data found in localStorage.");
    }
}


