//-----------------------------VARIABLES----------------------------------//

const NAV_BAR = document.querySelector('#nav-bar');

const SVG_WRAPPER = document.querySelector('#svg-wrapper');
const WHEEL_OUTER_RING = document.querySelector('#wheel-outer-ring');
const WHEEL_WHITE_LINE = document.querySelector('#wheel-white-line');
const WHEEL_OUTER_CIRCLE = document.querySelector('#wheel-outer-circle');
const GREY_LINES = document.querySelectorAll('.grey-lines');
const HOUR_MARKERS_1 = document.querySelectorAll('.hour-markers-1');
const HOUR_MARKERS_2 = document.querySelectorAll('.hour-markers-2');
const ADD_HABIT_BUTTON = document. querySelector('#add-habit-button');
const ADD_HABIT_BUTTON_SIGN = document.querySelector('#add-habit-button-sign');
const ADD_HABIT_BUTTON_WRAPPER = document.querySelector('#add-habit-button-wrapper');
const HABIT_WRAPPER = document.querySelector('#habit-wrapper');
const HABIT_BUTTON_TEXT_ADD = document.querySelector('#habit-button-text-add');
const HABIT_BUTTON_TEXT_HABIT = document.querySelector('#habit-button-text-habit');

const ADD_HABIT_FORM_WRAPPER = document.querySelector('#add-habit-form-wrapper');
const CREATE_HABIT_FORM_CLOSE = document.querySelector('#create-habit-form-close');
const ADD_HABIT_FORM = document.querySelector('#add-habit-form');
const HABIT_NAME = document.querySelector('#habit-name');
const START_TIME_HOUR = document.querySelector('#start-time-hour');
const START_TIME_MIN = document.querySelector('#start-time-min');
const END_TIME_HOUR = document.querySelector('#end-time-hour');
const END_TIME_MIN = document.querySelector('#end-time-min');

const SAVE_HABIT_BUTTON = document.querySelector('#save-habit-button');
const LOAD_HABIT_BUTTON = document.querySelector('#load-habit-button');
const REMOVE_HABIT_BUTTON = document.querySelector('#remove-habit-button');
const CLEAR_MEMORY_BUTTON = document.querySelector('#clear-memory-button');

const HABIT_PATHS_ARRAY = [];
const HABIT_TIMES_ARRAY = [];
const HABIT_NAMES_ARRAY = [];

//----------------------------FUNCTIONS--------------------------------------//

let WHEEL_RADIUS = window.visualViewport.width*12/32;
let centerX = null;
let centerY = 400;

function wheelSizeAdjust(){
    WHEEL_RADIUS = window.visualViewport.width*12/32;
    SVG_WRAPPER.style.width = window.visualViewport.width;
    centerX = window.visualViewport.width/2;
    if(window.visualViewport.width < 450){
        WHEEL_RADIUS = 170;
    } else if(WHEEL_RADIUS >= 350) {
        WHEEL_RADIUS = 350;
    }
    WHEEL_OUTER_CIRCLE.setAttribute('r', WHEEL_RADIUS);
    WHEEL_OUTER_RING.setAttribute('r', WHEEL_RADIUS+25);
    WHEEL_WHITE_LINE.setAttribute('r', WHEEL_RADIUS+5);
    GREY_LINES.forEach( line => {
        line.setAttribute('d', `M ${window.visualViewport.width/2} 400 L ${window.visualViewport.width/2+WHEEL_RADIUS+49} 400`);
        line.style.transformOrigin = `${centerX}px 400px`;
    })
    HOUR_MARKERS_2.forEach( marker => {
        marker.setAttribute('x', `${window.visualViewport.width/2+WHEEL_RADIUS+10}`);
    })
    HOUR_MARKERS_1.forEach( marker => {
        marker.setAttribute('x', `${window.visualViewport.width/2-WHEEL_RADIUS-50}`);
    }) 
    HABIT_PATHS_ARRAY.forEach( habit => {
        let habitIndex = HABIT_PATHS_ARRAY.indexOf(habit);
        let startCoordinate = timeToCoordinate(centerX, centerY, WHEEL_RADIUS, 1*HABIT_TIMES_ARRAY[habitIndex*4], 1*HABIT_TIMES_ARRAY[habitIndex*4+1]);
        let endCoordinate = timeToCoordinate(centerX, centerY, WHEEL_RADIUS, 1*HABIT_TIMES_ARRAY[habitIndex*4+2], 1*HABIT_TIMES_ARRAY[habitIndex*4+3]);
        habit.setAttribute('d', `M ${centerX} 400 L ${Math.round(startCoordinate[0])} ${Math.round(startCoordinate[1])} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 1 0 1 ${Math.round(endCoordinate[0])} ${Math.round(endCoordinate[1])} z`);
    })
    HABIT_NAMES_ARRAY.forEach( name => {
        let nameIndex = HABIT_NAMES_ARRAY.indexOf(name);
        if(0 <= HABIT_TIMES_ARRAY[nameIndex*4] < 12 && HABIT_TIMES_ARRAY[nameIndex*4+2] < 12){
            name.setAttribute('x', `${window.visualViewport.width/2-WHEEL_RADIUS+15}`);
        } else {
            name.setAttribute('x', `${window.visualViewport.width/2+WHEEL_RADIUS-50}`);
        }
    })
    ADD_HABIT_BUTTON_SIGN.setAttribute('x', `${window.visualViewport.width/2-17}`);
    HABIT_BUTTON_TEXT_ADD.setAttribute('x', `${window.visualViewport.width/2-9}`);
    HABIT_BUTTON_TEXT_HABIT.setAttribute('x', `${window.visualViewport.width/2-12}`);
    SAVE_HABIT_BUTTON.setAttribute('d', `M ${window.visualViewport.width/2} 400 L ${window.visualViewport.width/2} 328 A 72 72 1 0 1 ${window.visualViewport.width/2+72} 400 z`);
    LOAD_HABIT_BUTTON.setAttribute('d', `M ${window.visualViewport.width/2} 400 L ${window.visualViewport.width/2} 328 A 72 72 1 0 0 ${window.visualViewport.width/2-72} 400 z`);
    REMOVE_HABIT_BUTTON.setAttribute('d', `M ${window.visualViewport.width/2} 400 L ${window.visualViewport.width/2} 472 A 72 72 1 0 0 ${window.visualViewport.width/2+72} 400 z`);
    CLEAR_MEMORY_BUTTON.setAttribute('d', `M ${window.visualViewport.width/2} 400 L ${window.visualViewport.width/2} 472 A 72 72 1 0 1 ${window.visualViewport.width/2-72} 400 z`);
}

function timeToRotation(hour, min){
    let time = hour*1+min/60;
    return time*15-90;
}

function timeToCoordinate(centerX, centerY, radius, hour, min){
    let angle = timeToRotation(hour, min);
    let radAngle = angle*Math.PI/180;
    console.log(radAngle);
    return [centerX-radius*Math.cos(radAngle), centerY-radius*Math.sin(radAngle)];
}

function createHabitPath(centerX, centerY, radius, startHour, startMin, endHour, endMin){
    let startCoordinate = timeToCoordinate(centerX, centerY, radius, startHour, startMin);
    let endCoordinate = timeToCoordinate(centerX, centerY, radius, endHour, endMin);
    let habitEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    habitEl.setAttribute('class', 'habit-path');
    habitEl.setAttribute('role', 'button');
    habitEl.setAttribute('d', `M ${centerX} 400 L ${Math.round(startCoordinate[0])} ${Math.round(startCoordinate[1])} A ${radius} ${radius} 1 0 1 ${Math.round(endCoordinate[0])} ${Math.round(endCoordinate[1])} z`);
    HABIT_WRAPPER.append(habitEl);
    HABIT_PATHS_ARRAY.push(habitEl);
    return habitEl;
}

function createHabitName(name, startHour, startMin, endHour, endMin){
    let habitName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    habitName.textContent = `${name}`;
    habitName.setAttribute('y', '405');
    habitName.setAttribute('class', 'habit-name');
    let startRot = timeToRotation(startHour, startMin);
    let endRot = timeToRotation(endHour, endMin);
    let textSize = Math.abs(endRot-startRot)*6.5;
    if(0 <= startHour < 12 && endHour < 12){
        habitName.setAttribute('x', `${window.visualViewport.width/2-WHEEL_RADIUS+15}`);
        habitName.setAttribute('style', `transform: rotate(${(startRot+endRot)/2}deg);`);
    } else {
        habitName.setAttribute('x', `${window.visualViewport.width/2+WHEEL_RADIUS-50}`);
        habitName.setAttribute('style', `transform: rotate(${(startRot+endRot)/2+180}deg);`);
    }
    HABIT_NAMES_ARRAY.push(habitName);
    return habitName;
}

function createHabit(name, centerX, centerY, radius, startHour, startMin, endHour, endMin){
    let habitEl = createHabitPath(centerX, centerY, radius, startHour, startMin, endHour, endMin);
    let habitName = createHabitName(name, startHour, startMin, endHour, endMin);
    let habitContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    habitContainer.setAttribute('class', 'habit-container');
    habitContainer.append(habitEl);
    habitContainer.append(habitName);
    HABIT_WRAPPER.append(habitContainer);
}


//------------------------------------------------------------------------------//

wheelSizeAdjust();

window.addEventListener('resize', () => {
    wheelSizeAdjust();
})

ADD_HABIT_BUTTON_WRAPPER.addEventListener('click', () => {
    ADD_HABIT_FORM_WRAPPER.style.display = 'block';
})

CREATE_HABIT_FORM_CLOSE.addEventListener('click', () => {
    ADD_HABIT_FORM_WRAPPER.style.display = 'none';
})

ADD_HABIT_FORM.addEventListener('submit', e => {
    e.preventDefault();
    createHabit(HABIT_NAME.value, centerX, 400, WHEEL_RADIUS, START_TIME_HOUR.value, START_TIME_MIN.value, END_TIME_HOUR.value, END_TIME_MIN.value);
    ADD_HABIT_FORM_WRAPPER.style.display = 'none';
    HABIT_TIMES_ARRAY.push(START_TIME_HOUR.value, START_TIME_MIN.value, END_TIME_HOUR.value, END_TIME_MIN.value);
})

// ADD_HABIT_BUTTON_WRAPPER.addEventListener('mouseover', () => {
//     ADD_HABIT_BUTTON.style.fill = 'white';
//     ADD_HABIT_BUTTON.style.stroke = 'var(--theme-color-2)';
//     ADD_HABIT_BUTTON_SIGN.style.fill = 'var(--theme-color-2)';
// })
