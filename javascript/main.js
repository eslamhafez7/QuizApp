let questionsCounter = document.querySelector(".quiz-info .counter span");
let bulletsContainer = document.querySelector(".spans_container");
let questionsErea = document.querySelector(".questions-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.getElementById("submit_answer");
let bullets = document.querySelector(".options-box");
let submitInfo = document.querySelector(".submit_info");
let countDownElement = document.querySelector(".count-down");
let counter = document.querySelector(".counter");
let RightAnswers = 0;
let currentIndex = 0;
let timerInterval;



function getQuestions() {
    let request = new XMLHttpRequest();
    request.onload = function(){
        if(this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.response);
            let questionslength = data.length;
            createBullets(questionslength);
            addData(data[currentIndex], questionslength);
            window.onload = function() {
                Swal.fire({
                    position: 'top',
                    title: 'Hello!',
                    text: 'Time Out will Start After 5 seconds',
                    icon: 'info',
                    showConfirmButton: true,
                    timer: 2000
                });
                setTimeout(() => {
                    countDown(20, questionslength); 
                }, 5000);
            };
            submitButton.addEventListener("click", () => {
                let rightAnswer = data[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rightAnswer, questionslength);
                questionsErea.innerHTML = '';
                answersArea.innerHTML = '';
                addData(data[currentIndex], questionslength);
                handleActive();
                clearInterval(timerInterval);
                countDown(20, questionslength); 
                showResults(questionslength);
            });
        };
    };
    request.open("GET", "./questions.json", true);
    request.send();
}
getQuestions();



function createBullets(num) {
    counter.innerHTML = num;
    for(let i = 0; i < num; i++) {
        let bullet = document.createElement("span");
        if(i === 0) {
            bullet.classList.add ("active");
        }
        bulletsContainer.appendChild(bullet);
    }
}



function addData(obj, count) {
    if(currentIndex < count) {
        let questionsTitle = document.createElement("h2");
        let titleText = document.createTextNode(obj.title);
        questionsTitle.appendChild(titleText);
        questionsErea.prepend(questionsTitle);
        for(let i = 1; i <= 4; i++) {
            let answerDiv = document.createElement("div");
            answerDiv.classList.add("answer");
            let radioButton = document.createElement("input");
            radioButton.setAttribute("type", "radio");
            radioButton.setAttribute("name", "answers");
            radioButton.setAttribute("id", `answer_${i}`);
            radioButton.setAttribute("data-answer", obj[`answer_${i}`]);
            let queslabel = document.createElement("label");
            queslabel.setAttribute("for", `answer_${i}`);
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            queslabel.appendChild(labelText);
            answerDiv.appendChild(radioButton);
            answerDiv.appendChild(queslabel);
            answersArea.appendChild(answerDiv);
        }
    }
}



function checkAnswer(ranswer, rcount) {
    let radios = document.getElementsByName("answers");
    let choosenAnswer;
    for(let i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            choosenAnswer = radios[i].dataset.answer;
        }
    }
    console.log(`The Right Answer Is ${ranswer}`);
    console.log(`Choosen Answer Is ${choosenAnswer}`);
    if(choosenAnswer === ranswer) {
        RightAnswers++;
    }
}



function handleActive() {
    let bullets = document.querySelectorAll(".spans_container span");
    let bulletsArray = Array.from(bullets);
    bulletsArray.forEach((span, index) => {
    if(currentIndex === index) {
            span.classList.add("active");
        }
    })
}



function showResults(count) {
    if(currentIndex === count) {
        questionsErea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        submitInfo.remove();
        if(RightAnswers > count / 2 && RightAnswers < count) {
            Swal.fire({
                title: 'Not Bad',
                text: `Result Is ${RightAnswers} out of ${count}`,
                icon: 'info',
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
            }else if(RightAnswers === count) {
                    Swal.fire({
                        title: 'Perfect!',
                        text: `Result Is ${RightAnswers} out of ${count}`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                        }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                });
        }else {
            Swal.fire({
                title: 'Opps..Try Again!',
                text: `Result Is ${RightAnswers} out of ${count}`,
                icon: 'error',
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }
    }
}


function countDown(duration, count) {
    if(currentIndex < count){
        let minutes, seconds;
        timerInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;
            countDownElement.innerHTML = `${minutes}: ${seconds}`;
            if(--duration < 0) {
                clearInterval(timerInterval);
                submitButton.click();
            }
        }, 1000);
    }
}