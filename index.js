    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");

    const backgroundImage = new Image();
    backgroundImage.src = "./background/background1.png";
    backgroundImage.width = canvas.width;
    backgroundImage.height = canvas.height;

    let rotation;

    const step = 3;

    let position = {
        horizontal : 120,
        vertical : 120
    };
    let rotations = {
        left: 0,
        right: 1,
        up: 2,
        down: 3
    };


    var car = {
        current: createImage("./car/car_left_64px.png", drawCar),
        left: createImage("./car/car_left_64px.png", drawCar), 
        right: createImage("./car/car_right_64px.png", drawCar),
        down: createImage("./car/car_down_64px.png", drawCar),
        up: createImage("./car/car_up_64px.png", drawCar),
    }

    function createImage(src, onload) {
        let img = new Image();
        img.src = src;
        img.onload = onload;
        return img;
    }


    function drawGame() {
        if(canvas.getContext) {
            window.addEventListener('keydown', keyListenerDown, true);
            window.addEventListener('keydown', e=>{
                if(e.code === 'KeyP') {
                    if(game_running) {
                        game_running = false;
                    } else {
                        game_running = true;
                        gameLoop();
                    }
                }
            }, true);
            window.addEventListener('keyup', keyListenerUp, true);
            window.addEventListener('mousedown', e=>{
                console.log(e.offsetX + "," +e.offsetY);
            }, true)

            changeRotation(rotations.left);
        }
    }
    function changeRotation(rot) {
        rotation = rot;
        switch(rotation) {
            case rotations.left:
                car.current = car.left;
                break;
            case rotations.right:
                car.current = car.right;
                break;
            case rotations.up:
                car.current = car.up;
                break;
            case rotations.down:
                car.current = car.down;
                break;
        }
    }

    let pressedKeys = [];
    function keyListenerUp(event) {
        let key = event.keyCode;
        switch(key) {
            case 37:
            case 38:
            case 39:
            case 40:
                let int = setInterval(()=>{
                    if(presMap[key]>0) {
                        presMap[key]--;
                        press(key);
                    } else {
                        clearInterval(int);
                    }
                }, 30);
                setTimeout(()=>{
                    pressedKeys = pressedKeys.filter(e => e !== key);
                    clearInterval(int);
                    presMap[key] = 0;
                },presMap[key] > 100 ? presMap[key]/50*1000 : 1000);
        }
    }


    let presMap = {};
    function keyListenerDown (event) {
        event.preventDefault();
        
        if(!pressedKeys.includes(event.keyCode)) {
            pressedKeys.push(event.keyCode);
        }

        if(!presMap[event.keyCode])
            presMap[event.keyCode] = 0;
        presMap[event.keyCode]++;


        pressedKeys.forEach(e=>{
            press(e);
        });
    }

    function press(key) {
        let cstep = Math.max(presMap[key], step);
        switch(key) {
            case 37: // left
                {
                    let direction = {
                        rotation : rotations.left,
                        horizontal : position.horizontal-cstep,
                        vertical : position.vertical 
                    };
                    moveCar(direction);    
                }                
                break;           
            case 39:  // right                    
                {
                    let direction = {
                        rotation : rotations.right,
                        horizontal : position.horizontal+cstep,
                        vertical : position.vertical
                    };
                    moveCar(direction);
                }
                break;
            case 40: // down
                {
                    let direction = {
                        rotation : rotations.down,
                        horizontal : position.horizontal,
                        vertical : position.vertical+cstep
                    };                 
                    moveCar(direction); 
                } 
                break;
            case 38: // up
                {
                    let direction = {
                        rotation : rotations.up,
                        horizontal : position.horizontal,
                        vertical : position.vertical-cstep
                    };
                    moveCar(direction);
                }
                break;            
        }
    }

    let map = [  
        //[0, 206], [274, 206], [274, 450], [0, 450]
        [0, 274, 210, 455],
        [0, 274, 0, 105],
        [380, 925, 0, 110]

    ];
    function moveCar(direction) {
        // direction: { rotation, horizontal, vertical}    // { rotations.left, 250, 300 }
        
        let maxHoz = canvas.width - car.current.width;
        let maxVer = canvas.height - car.current.height;
        if(direction.horizontal > maxHoz) {
            direction.horizontal = 0;//maxHoz;
        }
        if(direction.vertical > maxVer) {
            direction.vertical = 0;//maxVer;
        }
        if(direction.horizontal < 0 ) {
            direction.horizontal = maxHoz;
        }
        if(direction.vertical < 0 ) {
            direction.vertical = maxVer;
        }


        let carx1 = direction.horizontal;
        let carx2 = carx1 + car.current.width;
        let cary1 = direction.vertical;
        let cary2 = cary1 + car.current.height;


        map.forEach(point =>{
            let x1 = point[0];
            let x2 = point[1];
            let y1 = point[2];
            let y2 = point[3];

            if(x1 < carx1 && carx1 < x2 && y1 < cary1 && cary1 < y2) {
                if(y2-y1 > y2-cary1 || x2-x1 > x2-carx1) {
                    if(direction.rotation === rotations.up || direction.rotation === rotations.down) {
                        cary1 += y2-cary1;
                    } else {
                        carx1 += x2-carx1;
                    }
                }
            } else if( x1 < carx2 && carx2 < x2 && y1 < cary2 && cary2 < y2) {
                if(y2-y1 > y2-cary2 || x2-x1 > x2-carx2) {
                    if(direction.rotation === rotations.up || direction.rotation === rotations.down) {
                        cary1 -= cary2-y1;
                    } else {
                        carx1 -= carx2-x1;
                    }
                }

            }
        });


        changeRotation(direction.rotation);
        position.horizontal = carx1;//direction.horizontal;
        position.vertical = cary1;//direction.vertical;
    }

    function drawCar() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //context.drawImage(backgroundImage, 0, 0);
        context.drawImage(car.current, position.horizontal, position.vertical);
        //context.drawImage(car.current,  position.horizontal - car.current.width/2, position.vertical - car.current.height/2);
            
    }
    var fps = 0;

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame   || 
        window.mozRequestAnimationFrame      || 
        window.oRequestAnimationFrame        || 
        window.msRequestAnimationFrame       || 
        function(callback, element){
            window.setTimeout(function(){
            
                callback(+new Date);
            }, 1000 / 60);
        };
    })();

    var lastRun;
    let game_running = true;
    var    width        = canvas.width,
            height       = canvas.height,
             show_fps     = true;

    function showFPS(){
        context.fillStyle = "Black";
        context.font      = "normal 16pt Arial";

        context.fillText(fps + " fps", 10, 26);
    }
    function gameLoop(){
        if(!lastRun) {
            lastRun = new Date().getTime();
            requestAnimFrame(gameLoop);
            return;
        }
        var delta = (new Date().getTime() - lastRun)/1000;
        lastRun = new Date().getTime();
        fps = Math.floor(1/delta);
        //Clear screen
        //context.clearRect(0, 0, width, height);

        drawCar();
        
        if (show_fps) showFPS();
        if (game_running) requestAnimFrame(gameLoop);
    }            
        gameLoop();