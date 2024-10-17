document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start-btn");
  const buttonAudio = document.getElementById("button-audio");
  var homeSection = document.getElementById("home");
  const frame1 = document.querySelector(".frame1");
  const frame2 = document.querySelector(".frame2");
  const confetti = document.getElementById("confetti-3");
  const headphone = document.getElementById("headphone");
  const scoreDisplay = document.querySelector(".score-view");
  const scoreDisplay2 = document.getElementById("score-display");
  const sentenceImage = document.getElementById("sentenceImage");
  const option1 = document.getElementById("option1");
  const option2 = document.getElementById("option2");
  const option3 = document.getElementById("option3");
  const img_list = document.getElementById("img-list");
  const question_1_text = document.querySelector(".question_1_text");
  const optionButtons = document.querySelectorAll(".option");
  const draggableWords = document.querySelectorAll(".draggable-word");
  const droppableWords = document.querySelectorAll(".droppable-word");
  const sentenceArrangedwords = document.querySelectorAll(
    ".sentence-arranged-words"
  );
  const sentencearrangedwordscontainer = document.querySelectorAll(
    ".sentence-arranged-words-container"
  );

  const englishDragAudio = document.getElementById("english_drag");
  const arabicDragAudio = document.getElementById("arabic_drag");

  let correctWordsCount = 0;
  let score = 0;

  function showSection(id) {
    var sections = document.querySelectorAll(".section");
    console.log("Trying to show section with ID:", id);

    sections.forEach(function (section) {
      section.classList.remove("active");
      section.style.display = "none";
    });

    var activeSection = document.getElementById(id);
    if (activeSection) {
      activeSection.classList.add("active");
      activeSection.style.display = "block";
      console.log("Successfully showed section with ID:", id);

      if (id === "page-2") {
      }

      if (id === "page-3") {
        handlePage3SoundAndScore(false);
      }
      if (id === "page-4") {
        calculateTotalScore();
      }
    }
  }

  function handlePage3SoundAndScore(isRestarting = false) {
    console.log("Handling page 3 sound and score. Restarting:", isRestarting);

    const storedScore = localStorage.getItem("score");
    let score = 0;
    if (storedScore !== null) {
      score = parseInt(storedScore);
    }

    scoreDisplay2.textContent = `${score}`;

    const draggableWords = document.querySelectorAll(".draggable-word");
    draggableWords.forEach((word) => {
      word.setAttribute("draggable", false);
    });

    if (!isRestarting) {
      console.log("Playing English and Arabic audios (not restarting)");

      englishDragAudio.play().then(() => {
        englishDragAudio.onended = () => {
          arabicDragAudio.play().then(() => {
            arabicDragAudio.onended = () => {
              playCorrectVoiceTwice();
            };

            enableDragForWords(draggableWords);
          });
        };
      });
    } else {
      enableDragForWords(draggableWords);
    }
  }

  function enableDragForWords(draggableWords) {
    draggableWords.forEach((word) => {
      word.setAttribute("draggable", true); // Re-enable dragging
      word.addEventListener("dragstart", dragStart);
      word.addEventListener("dragend", dragEnd);
      word.addEventListener("dragstart", playWordAudio);
    });
  }

  document
    .getElementById("question-btn1")
    .addEventListener("click", function (e) {
      stopAllSounds();
      e.preventDefault();
      console.log("Resetting game and score");

      score = 0;
      localStorage.setItem("score", score);
      console.log("Score after reset:", score);

      scoreDisplay.textContent = `${score}`;
      if (showSection("page-3")) {
        resetAnswers(true);
      }
      currentQuestionIndex = 0;
      loadQuestion(currentQuestionIndex);
      showSection("page-2");
    });

  if (startBtn) {
    startBtn.addEventListener("click", function (event) {
      event.preventDefault();

      startBtn.style.transform = "scale(0.95)";
      setTimeout(() => {
        startBtn.style.transform = "scale(1)";
      }, 300);

      if (buttonAudio) {
        buttonAudio.muted = false;
        buttonAudio.play();
      }
      setTimeout(() => {
        if (homeSection) {
          homeSection.style.transition = "opacity 0.5s ease";
          homeSection.style.opacity = "0";
        }
      }, 800);
      frame1.classList.add("animate-frame");
      frame2.classList.add("animate-frame");
      homeSection.style.display = "none";
      setTimeout(() => {
        showSection("page-2");
      }, 1600);
    });
  }

  const questions = [
    {
      img: "images/img-1.png",
      questionText:
        'This is my <span class="word-space"> <span> </span> </span> , Ted',
      options: ["Friend", "Mother"],
      correctAnswer: 0, // Friend
      audioCorrect: "voices/friend.mp3",
      sentenceAudio: "voices/this_ted.mp3",
      audioExcellent: "voices/great.mp3",
      audioArabicExcellent: "voices/arabic_great.mp3",
      clappingAudio: "voices/happy_Kids_Sound_Effect.mp3",
      audioTryAgain: "voices/wrong_try_again.mp3",
      audioArabicTryAgain: "voices/arabic_try_again.mp3",
    },
    {
      img: "images/img-2.png",
      questionText:
        'Nice to meet <span class="word-space"> <span> </span></span>',
      options: ["me", "you"],
      correctAnswer: 1, // Cousin
      audioCorrect: "voices/you.mp3",
      sentenceAudio: "voices/nice_you.mp3",
      audioExcellent: "voices/great.mp3",
      audioArabicExcellent: "voices/arabic_great.mp3",
      clappingAudio: "voices/happy_Kids_Sound_Effect.mp3",
      audioTryAgain: "voices/wrong_try_again.mp3",
      audioArabicTryAgain: "voices/arabic_try_again.mp3",
    },
    {
      img: "images/img-3.png",
      questionText:
        'Nice to meet you <span class="word-space"> <span> </span></span>',
      options: ["too", "two"],
      correctAnswer: 0, // Cousin
      audioCorrect: "voices/too.mp3",
      sentenceAudio: "voices/nice_too.mp3",
      audioExcellent: "voices/great.mp3",
      audioArabicExcellent: "voices/arabic_great.mp3",
      clappingAudio: "voices/happy_Kids_Sound_Effect.mp3",
      audioTryAgain: "voices/wrong_try_again.mp3",
      audioArabicTryAgain: "voices/arabic_try_again.mp3",
    },
  ];

  let currentQuestionIndex = 0;

  function updateScore(isCorrect) {
    if (isCorrect) {
      score++;
    } else {
      score = Math.max(0, score - 1);
    }

    localStorage.setItem("score", score);

    scoreDisplay.textContent = `${score}`;
  }

  function updateScore2(isCorrect) {
    const storedScore = localStorage.getItem("score");
    if (storedScore !== null) {
      score = parseInt(storedScore);
    } else {
      score = 0;
    }

    if (isCorrect) {
      score++;
    } else {
      score = Math.max(0, score - 1);
    }

    localStorage.setItem("score", score);

    scoreDisplay2.textContent = `${score}`;
  }

  function showConfetti() {
    if (confetti) {
      console.log("Showing confetti");
      confetti.style.display = "block";

      setTimeout(() => {
        console.log("Hiding confetti");
        confetti.style.display = "none";

        frame1.classList.remove("animate-frame");
        frame2.classList.remove("animate-frame");
      }, 2000);
    } else {
      console.error("Confetti element not found!");
    }
  }

  function loadQuestion(index) {
    const question = questions[index];

    img_list.src = question.img;
    question_1_text.innerHTML = question.questionText;

    option1.textContent = question.options[0];
    option2.textContent = question.options[1];

    let delay;
    if (currentQuestionIndex === 0) {
      delay = 3000;
    } else {
      delay = 1000;
    }

    setTimeout(() => {
      playAudioTwice(question.sentenceAudio, () => {
        console.log("Finished playing sentenceAudio twice");
      });
    }, delay);
  }

  function playAudioSequentially(audioSrc, callback) {
    const audio = new Audio(audioSrc);
    audio.play();
    audio.onended = callback;
  }

  function playAudioTwice(audioSrc, callback) {
    const audio = new Audio(audioSrc);
    audio.play();
    optionButtons.forEach((button) => (button.disabled = true));

    audio.onended = () => {
      const audioSecondPlay = new Audio(audioSrc);
      audioSecondPlay.play();
      audioSecondPlay.onended = callback;
      optionButtons.forEach((button) => (button.disabled = false));
    };
  }

  function checkAnswer(optionIndex) {
    const question = questions[currentQuestionIndex];
    optionButtons.forEach((button) => (button.disabled = true));

    if (optionIndex === question.correctAnswer) {
      document.querySelector(".word-space span").textContent =
        question.options[optionIndex];
      updateScore(true);

      playAudioSequentially(question.audioCorrect, () => {
        playAudioSequentially(question.audioExcellent, () => {
          playAudioSequentially(question.audioArabicExcellent, () => {
            const clappingAudio = new Audio(question.clappingAudio);
            clappingAudio.play();

            showConfetti();

            clappingAudio.onended = () => {
              console.log("Clapping ended");

              frame1.classList.add("animate-frame");
              frame2.classList.add("animate-frame");

              setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                  loadQuestion(currentQuestionIndex);
                } else {
                  showSection("page-3");
                }
                optionButtons.forEach((button) => (button.disabled = false));
              }, 900);
            };
          });
        });
      });
    } else {
      updateScore(false);
      playAudioSequentially(question.audioTryAgain, () => {
        playAudioSequentially(question.audioArabicTryAgain, () => {
          console.log("حاول مرة أخرى");

          playAudioSequentially(question.sentenceAudio, () => {
            optionButtons.forEach((button) => (button.disabled = false));
          });
        });
      });
    }
  }

  option1.addEventListener("click", () => checkAnswer(0));
  option2.addEventListener("click", () => checkAnswer(1));

  loadQuestion(currentQuestionIndex);

  const sentences = [
    {
      id: "qrag-q-1",
      imgsentence: "images/img-2-1.png",
      sentenceWords: ["Friend", "This", "my", "Ted", "is"],
      wordAudios: {
        This: new Audio("voices/this.mp3"),
        is: new Audio("voices/is.mp3"),
        my: new Audio("voices/my.mp3"),
        Friend: new Audio("voices/friend.mp3"),
        Ted: new Audio("voices/ted.mp3"),
      },
      correctvoice: "voices/this.mp3",
      correctOrder: ["This", "is", "my", "Friend", "Ted"],
    },
    {
      id: "qrag-q-2",
      imgsentence: "images/img-2-2.png",
      sentenceWords: ["to", "Nice", "you", "meet"],
      wordAudios: {
        Nice: new Audio("voices/nice.mp3"),
        to: new Audio("voices/to.mp3"),
        meet: new Audio("voices/meet.mp3"),
        you: new Audio("voices/you.mp3"),
      },
      correctvoice: "voices/nice_you.mp3",
      correctOrder: ["Nice", "to", "meet", "you"],
    },
    {
      id: "qrag-q-3",
      imgsentence: "images/img-2-3.png",
      sentenceWords: ["you", "meet", "Nice", "too", "to"],
      wordAudios: {
        Nice: new Audio("voices/nice.mp3"),
        to: new Audio("voices/to.mp3"),
        meet: new Audio("voices/meet.mp3"),
        you: new Audio("voices/you.mp3"),
        too: new Audio("voices/too.mp3"),
      },
      correctvoice: "voices/nice_too.mp3",
      correctOrder: ["Nice", "to", "meet", "you", "too"],
    },
  ];

  const successAudioEn = new Audio("voices/great.mp3");
  const successAudioAr = new Audio("voices/arabic_great.mp3");
  const failureAudioEn = new Audio("voices/wrong_try_again.mp3");
  const failureAudioAr = new Audio("voices/arabic_try_again.mp3");
  const applauseAudio = new Audio("voices/happy_Kids_Sound_Effect.mp3");

  let currentSentenceIndex = 0;
  let currentOrder = [];

  draggableWords.forEach((word) => {
    word.addEventListener("dragstart", dragStart);
    word.addEventListener("dragend", dragEnd);
  });

  droppableWords.forEach((dropZone) => {
    dropZone.addEventListener("dragover", dragOver);
    dropZone.addEventListener("drop", drop);
  });

  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.word);
    e.target.classList.add("dragging");
  }

  function dragEnd(e) {
    e.target.classList.remove("dragging");
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function drop(e) {
    const word = e.dataTransfer.getData("text/plain");
    const target = e.target;

    if (target.dataset.word === word) {
      playSuccessSounds();
      updateScore2(true);

      target.textContent = word;
      target.classList.add("sentence-word");
      target.classList.remove("sentence-arranged-words");

      const draggableWord = document.querySelector(
        `.draggable-word[data-word="${word}"]`
      );
      draggableWord.style.cursor = "default";
      if (draggableWord) {
        draggableWord.remove();
      }
      currentOrder.push(word);
      checkCompletion();
    } else {
      updateScore2(false);

      failureAudioEn.play();
      failureAudioAr.play();
    }
  }

  let previousScore = 0;

  const wordBank = document.getElementById("wordBank");
  const dropzones = document.getElementById("dropzones");

  function loadNewSentence(isRestarting = false) {
    previousScore = score;
    const currentSentence = sentences[currentSentenceIndex];

    wordBank.innerHTML = "";
    dropzones.innerHTML = "";

    document.getElementById("dragtext").style.display = "none";
    document.getElementById("score-container").style.display = "none";
    headphone.style.display = "none";
    sentenceImage.style.display = "none";

    if (!isRestarting) {
      frame1.classList.remove("animate-frame");
      frame2.classList.remove("animate-frame");

      requestAnimationFrame(() => {
        setTimeout(() => {
          frame1.classList.add("animate-frame");
          frame2.classList.add("animate-frame");
        }, 100);
      });

      setTimeout(() => {
        frame1.classList.remove("animate-frame");
        frame2.classList.remove("animate-frame");

        showGameElements(currentSentence);
      }, 2000);
    } else {
      showGameElements(currentSentence);
    }
  }

  function showGameElements(currentSentence) {
    document.getElementById("dragtext").style.display = "block";
    document.getElementById("score-container").style.display = "block";
    sentenceImage.style.display = "block";
    headphone.style.display = "block";

    currentSentence.sentenceWords.forEach((word) => {
      const wordElement = document.createElement("p");
      wordElement.classList.add("sentence-word", "draggable-word");
      wordElement.dataset.word = word;
      wordElement.textContent = word;

      wordElement.setAttribute("draggable", false);
      wordBank.appendChild(wordElement);
    });

    currentSentence.correctOrder.forEach((word) => {
      const dropzone = document.createElement("p");
      dropzone.classList.add("sentence-arranged-words", "droppable-word");
      dropzone.dataset.word = word;
      dropzone.textContent = "";

      dropzone.addEventListener("dragover", dragOver);
      dropzone.addEventListener("drop", drop);
      dropzones.appendChild(dropzone);
    });

    sentenceImage.src = currentSentence.imgsentence;
    currentOrder = [];
    playSoundsAndEnableDrag();
  }

  function playSoundsAndEnableDrag() {
    console.log("Starting English audio playback");

    const draggableWords = document.querySelectorAll(".draggable-word");
    draggableWords.forEach((word) => {
      word.setAttribute("draggable", false);
    });

    englishDragAudio.play().then(() => {
      englishDragAudio.onended = () => {
        arabicDragAudio.play().then(() => {
          arabicDragAudio.onended = () => {
            playCorrectVoiceTwice();
          };
        });
      };
    });
  }

  function checkCompletion() {
    if (
      currentOrder.length ===
      sentences[currentSentenceIndex].correctOrder.length
    ) {
      if (
        JSON.stringify(currentOrder) ===
        JSON.stringify(sentences[currentSentenceIndex].correctOrder)
      ) {
        console.log("الجملة صحيحة!");

        playApplause();

        setTimeout(() => {
          currentSentenceIndex++;

          if (currentSentenceIndex < sentences.length) {
            loadNewSentence();
          } else {
            showSection("page-4");
          }
        }, 4000);
      }
    }
  }

  // Play applause sound directly
  function playApplause() {
    applauseAudio.play();
    showConfettiquestion2();
  }

  function playWordAudio(e) {
    const word = e.target.dataset.word;
    const audio = sentences[currentSentenceIndex].wordAudios[word];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    } else {
      console.log(`Audio not found for word: ${word}`);
    }
  }

  draggableWords.forEach((word) => {
    word.addEventListener("dragstart", playWordAudio);
  });

  function showConfettiquestion2() {
    const confetti2 = document.getElementById("confetti-4");
    if (confetti2) {
      console.log(
        "Element found, current display style:",
        confetti2.style.display
      );
      confetti2.style.display = "block";
      console.log("Confetti should be visible now.");

      setTimeout(() => {
        console.log("Hiding confetti");
        confetti2.style.display = "none";
      }, 2000);
    } else {
      console.error("Confetti element not found!");
    }
  }

  function playSuccessSounds() {
    successAudioEn.play();
    successAudioEn.onended = () => {
      successAudioAr.play();
    };
  }

  draggableWords.forEach((word) => {
    word.addEventListener("dragstart", () => {
      const audio =
        sentences[currentSentenceIndex].wordAudios[word.dataset.word];
      if (audio) {
        audio.play();
      }
    });
  });

  function calculateTotalScore() {
    const totalScoreDisplay = document.getElementById("total-score");
    const storedScore1 = parseInt(localStorage.getItem("score")) || 0;
    console.log("Stored Score 1 (السؤال الأول):", storedScore1);

    const totalScore = storedScore1;

    console.log("Total Score (السكور الكلي):", totalScore);

    totalScoreDisplay.textContent = `${totalScore}`;
  }
  window.onload = function () {
    // calculateTotalScore();
  };

  function resetAnswers(isRestarting, isRestartingGame = false) {
    if (isRestartingGame) {
      if (showSection("page-3")) {
        currentSentenceIndex = 0;
        stopAllSounds();
      }
    }
    currentOrder = [];
    scoreDisplay2.textContent = "0";
    const wordBank = document.getElementById("wordBank");
    const dropzones = document.getElementById("dropzones");
    wordBank.innerHTML = "";
    dropzones.innerHTML = "";

    loadNewSentence(isRestarting);
  }

  function stopAllSounds() {
    const sounds = document.querySelectorAll("audio");
    sounds.forEach((sound) => sound.pause());
    sounds.forEach((sound) => (sound.currentTime = 0));
  }

  function getSelectedSentenceByIndex(index) {
    return sentences[index];
  }

  headphone.addEventListener("click", () => {
    const selectedSentence = getSelectedSentenceByIndex(currentSentenceIndex);

    const firstAudio = new Audio(selectedSentence.correctvoice);
    firstAudio.play();

    firstAudio.onended = () => {
      const secondAudio = new Audio(selectedSentence.correctvoice);
      secondAudio.play();
    };
  });

  function playCorrectVoiceTwice() {
    const correctVoiceAudio = new Audio(
      sentences[currentSentenceIndex].correctvoice
    );
    let playCount = 0; // Counter for the number of plays

    const draggableWords = document.querySelectorAll(".draggable-word");
    draggableWords.forEach((word) => {
      word.setAttribute("draggable", false); // Disable dragging
    });

    const playAudio = () => {
      correctVoiceAudio
        .play()
        .then(() => {
          playCount++; // Increase the play count

          if (playCount < 2) {
            correctVoiceAudio.onended = playAudio;
            correctVoiceAudio.onended = null;
          }
        })
        .finally(() => {
          if (playCount >= 2) {
            draggableWords.forEach((word) => {
              word.setAttribute("draggable", true);

              word.addEventListener("dragstart", dragStart);
              word.addEventListener("dragend", dragEnd);
              word.addEventListener("dragstart", playWordAudio);
            });
          }
        });
    };

    playAudio();
  }
});
