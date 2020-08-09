(function(){

    let answerButton;

    // build all pasrt to start quiz
    function buildQuiz(){
        // variable to store the HTML output
        const output = [];

        // for each question...
        questions.forEach(
            (currentQuestion, questionNumber) => {

                // variable to store the list of possible answers
                const answers = [];

                // and for each available answer...
                for(let letter in currentQuestion.options){
                    answers.push(
                        `<div class="selecting" name="div${questionNumber}">` +
                            `<input type="hidden" value="${letter}">` +
                            `<span class="answer-text">${currentQuestion.options[letter]}</span>` +
                        '</div>'
                    )
                }

                let button =''
                if (questionNumber !== 0){
                    button = '<button class="previous">Previous Question</button>'
                }

                output.push(
                    `<div class="slide">
                        <div class="image"><img class="image" src="${currentQuestion.image}" alt=""></div>
                        <div class="question"> ${currentQuestion.text}</div>
                        <div class="answers"> ${answers.join("")} </div>
                        <div class="button">${button}</div>
                    </div>`
                );
            }
        );

        //console.log(output);

        // finally combine our output list into one string of HTML and put it on the page
        quizContainer.innerHTML = output.join('');

        answerButton = document.getElementsByClassName("selecting");

        //console.log(answerButton)

        for (let i=0; i < answerButton.length;i++) {
            answerButton[i].addEventListener("click", setAnswer);
        }

        let previousButton = document.querySelectorAll("[class^=previous]");
        previousButton.forEach(function (item) {
            item.addEventListener("click", showPreviousSlide);
        })


    }

    // Show slide results
    function showResults(){

        // gather answer containers from our quiz
        const answerContainers = quizContainer.querySelectorAll('.answers');

        console.log('answerContainers' ,answerContainers)

        // keep track of user's answers
        let numCorrect = 0;
        let pointsUser=0;
        let pointsSummary=0;

        // for each question...
        questions.forEach((currentQuestion, questionNumber) => {

            // find selected answer
            const answerContainer = answerContainers[questionNumber];
            //console.log(answerContainer)

            const selector = `div[name=div${questionNumber}][class$="choosed"]`;
            let div = answerContainer.querySelector(selector)
            //console.log(div)

            const userAnswer = div.getElementsByTagName('input')[0].value;

            //if answer is correct
            if(userAnswer === currentQuestion.answer){
                // add to the number of correct answers
                numCorrect++;
                pointsUser=pointsUser+currentQuestion.points
            }

            pointsSummary = pointsSummary+currentQuestion.points

        });

        // show number of correct answers out of total
        resultsContainer.innerHTML = `You have set ${numCorrect} correct ${ numCorrect>1? 'answers':'answer'} out of ${questions.length}<br>`+
        `You have collect ${pointsUser} ${pointsUser > 1 ? 'points' : 'point'} out of ${pointsSummary}`;

        document.getElementById('quiz').innerHTML = null
        document.querySelector('[class^="quiz-container"]').style.display= 'none' ;

    }

    // Show current slide
    function showSlide(n) {
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;
    }

    // Show current slide
    function setAnswer(event) {

        //console.log('set answer', currentSlide, questions.length, event.target)

        // Remove prev value if exists
        let all_answers = document.querySelectorAll('[name="div'+currentSlide.toString()+'"]')

        all_answers.forEach(function (item) {
            item.classList.remove("choosed");
        });

        //console.log(event.target);

        let button =event.target
        if (!event.target.className.includes('selecting')){
            button = event.target.closest("div[name]");
        }

        console.log(button)

        // Set checked on input
        //button.getElementsByTagName('input').checked = true;

        // Add class to selected
        button.className+=' choosed'

        console.log(all_answers)

        if (currentSlide < questions.length-1) {
            showSlide(currentSlide + 1);
        } else {
            showResults()
        }

        drawBar(1);
    }


    // // Go to next slide
    // function showNextSlide() {
    //     showSlide(currentSlide + 1);
    // }

    // Go to perv slide
    function showPreviousSlide() {
        showSlide(currentSlide - 1);
        drawBar(-1);
    }

    // Variables
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');

    let progress = document.querySelector("#progress");
    let reporter = document.querySelector("p > span");
    let i = 0;


    // Kick things off
    buildQuiz();

    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    // Show the first slide
    showSlide(currentSlide);

    function drawBar(n){
        i = i  + n*Math.floor(1/questions.length*100);
        progress.style.width = i + "%";
        reporter.textContent = currentSlide;
    }

    document.querySelector('[class^=all').innerHTML=questions.length.toString();

})();
