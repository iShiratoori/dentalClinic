function countdownTimer(titleText, hours, minutes, seconds) {
    const clock = document.getElementById('clock');
    const hoursCounter = document.getElementById('hours-counter');
    const minutesCounter = document.getElementById('minutes-counter');
    const secondsCounter = document.getElementById('seconds-counter');
    //first time
    secondsCounter.innerText = `${seconds.toString().padStart(2, '0')}`;
    minutesCounter.innerText = `${minutes.toString().padStart(2, '0')}`;
    hoursCounter.innerText = `${hours.toString().padStart(2, '0')}`;


    const title = document.getElementById('title');
    title.innerText = titleText
    function updateClock() {
        secondsCounter.innerText = `${seconds.toString().padStart(2, '0')}`;

        if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(timerInterval);
            clock.innerText = 'We are open!';
            return;
        }

        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
                minutesCounter.innerText = `${minutes.toString().padStart(2, '0')}`;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                    hoursCounter.innerText = `${hours.toString().padStart(2, '0')}`;
                }
            }
        }
    }

    const timerInterval = setInterval(updateClock, 1000);
}

// Example usage: countdownTimer(hours, minutes, seconds);

function getOpeningOrClosinTime() {
    $.ajax({
        url: 'http://localhost:3000/api/getclock',
        method: 'GET',
        success: function (response) {
            countdownTimer(response.title, response.time.hour, response.time.minute, response.time.second);
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
        }
    });
}

getOpeningOrClosinTime()