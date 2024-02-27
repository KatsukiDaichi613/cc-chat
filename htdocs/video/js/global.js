let roomId = '';

let myID = '';

let myName = '';

let myX = 0;

let myY = 0;

let myV = 0;

let myGroup = 0;

let myIcon = Math.floor( Math.random() * (16 + 1 - 1) ) + 1 ;

let introVolume = 0.1;

let manager = false;
let manager_mute = false;

let managerID = "";

let cameraman = false;

let step = 0;

let TEST = 0;

let group_mode = "O";

let video_mode = "I";

let uStyle = [];

let onUser = [];

let onUserID = [];

let markStyle = [{ width:100, height:100, centerX:320, centerY:350},
                 { width:100, height:100, centerX:880, centerY:350},
                 { width:100, height:100, centerX:600, centerY:180},
                 { width:100, height:100, centerX:600, centerY:520}];

let iconLength = 100;
let shadowLength = 200;
let voiceLength = 300;
let B_shadowLength = 300;
let B_shadowCenter = 150;
let D_shadowLength = 400;


let test_mode = "O";
let test_val = 0;
let test_time = 0;
let current_time = 0;
let time_counter = 0;
let recording = false;