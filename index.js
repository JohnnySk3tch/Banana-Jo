document.addEventListener("DOMContentLoaded", function() {

    //Hier wird der Hintergrund Sound festgelegt
    let backgroundSound = document.getElementById("backgroundSound");
    const gotYouSound = new Audio('Audio/mixkit-arcade-video-game-bonus-2044.wav');
    const newObjektOnTheFiledSound = new Audio('Audio/mixkit-unlock-game-notification-253.wav');
    const catchedNewObjektSound = new Audio('Audio/mixkit-mechanical-crate-pick-up-3154.wav');
    const catchedCoin = new Audio("Audio/mixkit-coin-win-notification-1992.wav");
    const deletApeSound = new Audio("Audio/mixkit-ethereal-fairy-win-sound-2019.wav");
    const newLifPointSound = new Audio("Audio/mixkit-final-level-bonus-2061.wav");

    //Hier werden alle Sounds stumm geschalten
    backgroundSound.muted = true;
    gotYouSound.muted = true;
    newObjektOnTheFiledSound.muted = true;
    catchedNewObjektSound.muted = true;
    catchedCoin.muted = true;
    deletApeSound.muted = true;
    newLifPointSound.muted = true;

    //Das ist der Button zum Ton An- und Ausschalten

    //Die Funktion für das An- und Ausschalten der Töne
    function soundOnOff(sound) {
        if (sound.muted === false) {
            sound.muted = true;
        }
        else {
            sound.muted = false;
        }
    }
    //Der Event-Listener für den Sound
    let soundOnOffBtn = document.getElementById("soundOnOffBtn");
    soundOnOffBtn.addEventListener("click", function() {

        soundOnOff(backgroundSound);
        soundOnOff(gotYouSound);
        soundOnOff(newObjektOnTheFiledSound);
        soundOnOff(catchedNewObjektSound);
        soundOnOff(catchedCoin);
        soundOnOff(deletApeSound);
        soundOnOff(newLifPointSound);

    });

    //Der Startbutton
    let startBtn = document.getElementById("btnContainer");
    startBtn.addEventListener("click", function() {
        btnContainer.style.display = "none"; //Lässt den Startbutton verschinden
        backgroundSound.play(); //Schaltet den Ton an
        animation(); //Beginnt die Animation und somit das Spiel
    });


    //Hier wird die Banane erstellt
    let animationRight; //Die Variable der nach Rechts Bewegung der Banane
    let animationLeft;
    let animationUp;
    let animationDown;
    let speed = 5; //Die Geschwindigkeit mit der die Banane bewegt wird
    let speedRight = speed;
    let speedLeft = speed;
    let speeUp = speed;
    let speedDown = speed;

    //Initialisierung Layer
    let layer_1 = document.getElementById("layer_1");
    let context_1 = layer_1.getContext("2d");
    let layer_2 = document.getElementById("layer_2");
    let context_2 = layer_2.getContext("2d");
    let layer_0 = document.getElementById("layer_0");
    let context_0 = layer_0.getContext("2d");
    let ground = document.getElementById("ground");
    let context_ground = ground.getContext("2d");
    let layer_3 = document.getElementById("layer_3");
    let context_3 = layer_3.getContext("2d");
    let layer_4 = document.getElementById("layer_4");
    let context_4 = layer_4.getContext("2d");
    let layer_5 = document.getElementById("layer_5");
    let context_5 = layer_5.getContext("2d");
    let layer_6 = document.getElementById("layer_6");
    let context_6 = layer_6.getContext("2d");
    let layer_7 = document.getElementById("layer_7");
    let context_7 = layer_7.getContext("2d");

    //Initialisierung Spielfeldgröße
    let windowScale = 1;
    let breite = window.innerWidth * windowScale;
    let hoehe = window.innerHeight * windowScale;

    ground.width = breite;
    ground.height = hoehe;

    layer_0.width = breite;
    layer_0.height = hoehe;

    layer_1.width = breite;
    layer_1.height = hoehe;

    layer_2.width = breite;
    layer_2.height = hoehe;

    layer_3.width = breite;
    layer_3.height = hoehe;

    layer_4.width = breite;
    layer_4.height = hoehe;

    layer_5.width = breite;
    layer_5.height = hoehe;

    layer_6.width = breite;
    layer_6.height = hoehe;

    layer_7.width = breite;
    layer_7.height = hoehe;


    //Diese Variable zählt die Frames und wird verwendet um die Spielzeit anzugeben
    let playTime = 0;
    let boosterCount = 0;

    let spielzeitElement = document.getElementById("spielzeit"); //Hier wird das Element zur Visualisierung der Spielzeit in HTML angesteuert
    

    //Lebenspunkte

    
    let lifePoints = 5;
    let contactCount = false;


    //Hier wird das Spielobjekt für bewegliche Objekte im Spiel initialisiert
    function spielObjekt(srces, x, y, scale, ctx) {
        this.bild = new Image();
        this.bild.onload = function() {
            this.width = this.bild.width * this.scale;
            this.height = this.bild.height * this.scale;
            context_1.drawImage(this.bild, this.x, this.y, this.width, this.height);
        }.bind(this);
        this.bild.src = srces;
        this.x = x;
        this.y = y;
        this.scale = scale * innerWidth / 10000;
    }

    //Hier wird der Wassertropfen initialisiert
    let waterDrop = new spielObjekt("Bilder/water-1560478_1280.png", undefined, -200, 0.30, context_3);
    //Hier wird die Kokosnuss initialisiert
    let coconut = new spielObjekt("Bilder/coconut-575780_1280.png", undefined, undefined, 0.35);   
    //Hier wird die Banane initialisiert
    let bananas = new spielObjekt("Bilder/banana-42793.png", 200, 200, 0.4, context_1);

    //Hier wird die zerquetschte Banane initialisiert
    let smashedBanana = new spielObjekt("Bilder/banana-30055_1280.png", undefined, undefined, 0.6);
    //Diese Funktion zeichnet die zerquetschte Banane
    function drawSmashedBanana() {
        context_0.clearRect(0, 0, layer_0.width, layer_0.height);
        context_0.drawImage(smashedBanana.bild, bananas.x, bananas.y, smashedBanana.width, smashedBanana.height);
    }
    //Hier wird die Münze erstellt
    let coin = new spielObjekt("Bilder/bitcoin-3642042_1280.png", -200, undefined, 0.08);

    
    
    //Die Funktion zur Erstellung der Gegner
    function spielObjektGegner(srces, x, y, SpeedX, SpeedY, beschleunigung, scaleApe, scale, ctx) {
        this.bild = new Image();
        this.bild.onload = function() {
            this.width = this.bild.width * this.scale;
            this.height = this.bild.height * this.scale;
            ctx.drawImage(this.bild, this.x, this.y, this.width, this.height);
        }.bind(this);
        this.bild.src = srces;
        this.x = x;
        this.y = y;
        this.SpeedX = SpeedX;
        this.SpeedY = SpeedY;
        this.beschleunigung = beschleunigung;
        this.scaleApe = scaleApe;
        this.scale = scale * innerWidth / 10000;
        
    }

    //Initialisierung Gegner 1
    let ape1 = new spielObjektGegner("Bilder/Ape_1.png", Math.random() * (innerWidth - 100 + 1), Math.random() * (innerHeight - 100 + 1), 2, 2, 0.02, 0, 1, context_2);
  
 
        drawApe();
    
    
    //Initialisierung Gegner 2
    let ape2 = new spielObjektGegner("Bilder/Ape_4.png", undefined, undefined, 2, 2, 0.02, 0, 1.3, context_5);
    
  

   
    //Die nach Rechts Bewegung der Banane
    addEventListener("keydown", function(event) {
        if (event.key === "ArrowRight") {
            if (!animationRight) {
                animationRight = requestAnimationFrame(moveRight);
            }
        }
    });
    addEventListener("keyup", function(event) {
        if (event.key === "ArrowRight") {
            this.cancelAnimationFrame(animationRight);
            animationRight = false;
        }
    });
    
 
    function moveRight() {
        animationRight = requestAnimationFrame(moveRight);
        context_1.clearRect(0, 0, layer_1.width, layer_1.height);
        context_1.drawImage(bananas.bild, bananas.x, bananas.y, bananas.width, bananas.height);
        bananas.x += speedRight;

        if (bananas.x + speedRight > layer_1.width - bananas.width) {
            speedRight = 0;
        }
        else {
            speedRight = speed;
        }
    }


    //Die nach Links Bewegung der Banane
    addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            if (!animationLeft) {
                animationLeft = requestAnimationFrame(moveLeft);
            }
        }
    });
    addEventListener("keyup", function(event) {
        if (event.key === "ArrowLeft") {
            this.cancelAnimationFrame(animationLeft);
            animationLeft = false;
        }
    });

    function moveLeft() {
        animationLeft = requestAnimationFrame(moveLeft);
        context_1.clearRect(0, 0, layer_1.width, layer_1.height);
        context_1.drawImage(bananas.bild, bananas.x, bananas.y, bananas.width, bananas.height);
        bananas.x -= speedLeft;

        if (bananas.x < 0) {
            speedLeft = 0;
        }
        else {
            speedLeft = speed;
        }
        
    }

    //Die nach Oben Bewegung der Banane
    addEventListener("keydown", function(event) {
        if (event.key === "ArrowUp") {
            if (!animationUp) {
                animationUp = requestAnimationFrame(moveUp);
            }
        }
    });
    addEventListener("keyup", function(event) {
        if (event.key === "ArrowUp") {
            this.cancelAnimationFrame(animationUp);
            animationUp = false;
        }
    });

    function moveUp() {
        animationUp = requestAnimationFrame(moveUp);
        context_1.clearRect(0, 0, layer_1.width, layer_1.height);
        context_1.drawImage(bananas.bild, bananas.x, bananas.y, bananas.width, bananas.height);
        bananas.y -= speeUp;

        if (bananas.y < 0) {
            speeUp = 0;
        }
        else {
            speeUp = speed;
        }
    }

    //Die nach Oben Bewegung der Banane
    addEventListener("keydown", function(event) {
        if (event.key === "ArrowDown") {
            if (!animationDown) {
                animationDown = requestAnimationFrame(moveDown);
            }
        }
    });
    addEventListener("keyup", function(event) {
        if (event.key === "ArrowDown") {
            this.cancelAnimationFrame(animationDown);
            animationDown = false;
        }
    });

    function moveDown() {
        animationDown = requestAnimationFrame(moveDown);
        context_1.clearRect(0, 0, layer_1.width, layer_1.height);
        context_1.drawImage(bananas.bild, bananas.x, bananas.y, bananas.width, bananas.height);
        bananas.y += speedDown;

        if (bananas.y + speedDown > layer_1.height - bananas.height) {
            speedDown = 0;
        }
        else {
            speedDown = speed;
        }

    };
   

    

    function drawApe() {
        window.requestAnimationFrame(drawApe);


        context_2.clearRect(0, 0, layer_2.width, layer_2.height);
        context_2.drawImage(ape1.bild, ape1.x, ape1.y, ape1.width, ape1.height);

        if (ape1.x + ape1.width > layer_2.width || ape1.x < 0) {
            ape1.SpeedX = -ape1.SpeedX;
        }

        if (ape1.y + ape1.height > layer_2.height || ape1.y < 0) {
            ape1.SpeedY = -ape1.SpeedY;
        }
    }


    let ape2IsDrawed = false; //Die Variable zum Prüfen, ob Affe 2 bereits gezeichnet wurde

    let ape2AnimationStop;

    function stopApe2Animation() {
        cancelAnimationFrame(ape2AnimationStop);
    }
    
    function drawApe2() {
        ape2AnimationStop = window.requestAnimationFrame(drawApe2);

        if (ape2.x === undefined) {
            ape2.x = Math.random() * (innerWidth - ape2.width - 1);
            ape2.y = Math.random() * (innerHeight - ape2.height - 1);
        }

        context_5.clearRect(0, 0, layer_5.width, layer_5.height);
        context_5.drawImage(ape2.bild, ape2.x, ape2.y, ape2.width, ape2.height);

        if (ape2.x + ape2.width > layer_5.width || ape2.x < 0) {
            ape2.SpeedX = -ape2.SpeedX;
        }

        if (ape2.y + ape2.height > layer_5.height || ape2.y < 0) {
            ape2.SpeedY = -ape2.SpeedY;
        }

        ape2.x += ape2.SpeedX;
        ape2.y += ape2.SpeedY;

        ape2IsDrawed = true;
    }


    

    //Das ist die Funktion zum Aufploppen des Wassertropfen
    function drawWaterDrop() {
            context_3.clearRect(0, 0, layer_3.width, layer_3.height);
            context_3.drawImage(waterDrop.bild, waterDrop.x, waterDrop.y, waterDrop.width, waterDrop.height);
            waterDrop.y += 5.5;

            if (waterDrop.y >= innerHeight) {
                waterDrop.y = -400;
                waterDrop.x = Math.random() * (innerWidth - 50 +1);
            }
    };

    //Das ist die Funktion zum Aufplaoppen der Kokosnuss
    function drawCoconut() {
        if (countForCoconut === 700) {
            coconut.x = Math.random() * (innerWidth - coconut.width + 1);
            coconut.y = Math.random() * (innerHeight - coconut.height + 1);
            context_4.clearRect(0, 0, layer_4.width, layer_4.height);
            context_4.drawImage(coconut.bild, coconut.x, coconut.y, coconut.width, coconut.height);
            newObjektOnTheFiledSound.play();
            countForCoconut = 0;
        }
    }

    //Hier wird die herabfallende Münze gezeichnet
    function drawCoin() {
        context_6.clearRect(0, 0, layer_6.width, layer_6.height);
        context_6.drawImage(coin.bild, coin.x, coin.y, coin.width, coin.height);
        coin.x += 7;

        if (coin.x >= innerWidth) {
            coin.x = -200;
            coin.y = Math.random() * (innerHeight - 50 +1);
        }
    }

    //Animationsvariable
    let requestForAnimationStop;
    
    //Funktion zum stoppen der Animation
    function stopAnimation() {
        cancelAnimationFrame(requestForAnimationStop);
      }

    let frameCount = 0; //fameCount wird benötigt, um die Frames zu zählen und Aktionen nach bestimmter Zeit zu erstellen
    let countForWaterdrop = 0;
    let countForCoconut = 0;
    let coinCount = 0;
    let beschleunigung = 1; //Variable zur Beschleunigung der Gegner zur Erhöhung der Schwierigkeit nach Spielzeit
    let coconutCatchedCount = 0;

    function animation() {
        requestForAnimationStop = window.requestAnimationFrame(animation);

        playTime++; //Hier wird die Zeit gezählt
        countForWaterdrop++; //Hier wird die Zeit gezählt
        countForCoconut++; //Hier wird die Zeit gezählt
        spielzeitElement.textContent = Math.round(playTime/60) + " Sekunden"; //Hier wird die Zeit ausgegeben

        frameCount++; //Pro Frame wird ein Frame gezählt
        boosterCount++; //boosterCount wird benötigt, um die Länge der Booster für den Spieler zu kontrollieren

        ape1.x += ape1.SpeedX * beschleunigung;
        ape1.y += ape1.SpeedY * beschleunigung;

        //Hier wird die Schwierigkeit erhöht
        if (frameCount > 300) {
            beschleunigung += ape1.beschleunigung;
            ape1.width = ape1.width * ape1.scaleApe;
            ape1.height = ape1.height * ape1.scaleApe;
            frameCount = 0;
        }


        drawWaterDrop(); //Hier wird die Funktion zur Zeichnung des Wassertropfen aufgerufen
        drawCoin(); //Hier wird die Funktion zur Zeichnung der Münze aufgerufen


        

        //Hier fängt der Affe die Kokosnuss
        if (ape1.x < (coconut.x + coconut.width - 20)
            && ape1.x + ape1.width - 20 > coconut.x
            && ape1.y < (coconut.y + coconut.height - 20)
            && ape1.y + ape1.height - 20 > coconut.y) {
            drawApe2();
            context_4.clearRect(0, 0, layer_4.width, layer_4.height);
            catchedNewObjektSound.play();
            coconut.x = undefined;
            coconut.y = undefined;
        }

        if (coinCount === 15) {

            if (ape2IsDrawed === true) {
                ape2IsDrawed = false;
                context_5.clearRect(0, 0, layer_5.offsetWidth, layer_5.height);
                ape2.x = undefined;
                ape2.y = undefined;
                stopApe2Animation();
                countForCoconut = 0;
                drawCoconut();
                coinCount = 0;
                deletApeSound.play();
            }

            else {
                coinCount = 0;
                lifePoints += 1;
                newLifPointSound.play();
            }
            
        }

        if (ape2IsDrawed === true) {
            context_4.clearRect(0, 0, layer_4.width, layer_4.height);
            coconut.x = undefined;
            coconut.y = undefined;
        }

        else if (ape2IsDrawed === false) {
            drawCoconut(); //Hier wird die Funktion zur Zeichnung der Kokosnuss aufgerufen
        }

        //Hier fängt die Banane die Münze
        if (bananas.x < (coin.x + coin.width - 0)
        && bananas.x + bananas.width - 0 > coin.x
        && bananas.y < (coin.y + coin.height - 0)
        && bananas.y + bananas.height - 0 > coin.y) {
            context_6.clearRect(0, 0, layer_3.width, layer_3.height);
            catchedCoin.play();
            coin.y = -500;
            coin.x = Math.random() * innerWidth - 50;
            coinCount++; //Hier werden die eingesammelten Münzen gezählt
        }
        
        //Hier fängt die Banane den Wassertropfen
        if (bananas.x < (waterDrop.x + waterDrop.width - 0)
        && bananas.x + bananas.width - 0 > waterDrop.x
        && bananas.y < (waterDrop.y + waterDrop.height - 0)
        && bananas.y + bananas.height - 0 > waterDrop.y) {
            context_3.clearRect(0, 0, layer_3.width, layer_3.height);
            catchedNewObjektSound.play();
            speed = 9.5;
            boosterCount = 0;
            waterDrop.x = Math.random() * innerWidth - waterDrop.width -1;;
            waterDrop.y = -400;
        }

        if (boosterCount == 300) {
            speed = 5; //Hier muss der Speed nochmal festgelegt werden
        }

        //Hier wird geprüft, ob die Banane die Kokosnus fängt
        if (bananas.x < (coconut.x + coconut.width - 0)
        && bananas.x + bananas.width - 0 > coconut.x
        && bananas.y < (coconut.y + coconut.height - 0)
        && bananas.y + bananas.height - 0 > coconut.y) {
            context_4.clearRect(0, 0, layer_3.width, layer_3.height);
            catchedNewObjektSound.play();
            coconut.x = undefined;
            coconut.y = undefined;

            if (!contactCount) {
                coconutCatchedCount++;
                contactCount = true;
            }   

            if (coconutCatchedCount == 10) {
                beschleunigung = 1;
            }
    
        }
        

        
        //Hier wird geprüft, ob sich Affe und Banane treffen

        if (ape1.x < (bananas.x + bananas.width - 20)
            && ape1.x + ape1.width - 20 > bananas.x
            && ape1.y < (bananas.y + bananas.height - 20)
            && ape1.y + ape1.height - 20 > bananas.y) {

                ape1.bild.src = "Bilder/Ape_1_fressen.png";
            
            
            //Wenn sie sich überschneiden, wird ein Lebenspunkt abgezogen
            if (!contactCount) {
    
                contactCount = true;
                lifePoints -= 1;
                gotYouSound.play();
                drawSmashedBanana();
                drawBackground();
            }            
        }
        

        //Hier wird geprüft, ob sich affe 2 und Banane treffen
        else if (ape2.x < (bananas.x + bananas.width - 20)
        && ape2.x + ape2.width - 20 > bananas.x
        && ape2.y < (bananas.y + bananas.height - 20)
        && ape2.y + ape2.height - 20 > bananas.y) {
        
            ape2.bild.src = "Bilder/Ape_4_gefressen.png";
        
        //Wenn sie sich überschneiden, wird ein Lebenspunkt abgezogen
        if (!contactCount) {
            contactCount = true;
            lifePoints -= 1;
            gotYouSound.play();
            drawSmashedBanana();
            drawBackground();
        }            
    }

    else {
        contactCount = false; 
        ape1.bild.src = "Bilder/Ape_1_grinsend.png"; 
        ape2.bild.src = "Bilder/Ape_4.png";    
    }



        
        //Game Over!
        if (lifePoints == 0) {
            let gameOverElementContent = document.querySelector("#gameoverMassage p");
            let gameOverElement = document.querySelector("#gameoverMassage div");
            gameOverElement.style.display = "flex";
            gameOverElementContent.textContent = "Game over!\n" + "Spielzeit: " + Math.floor(playTime/60) + " Sekunden!";
            stopAnimation();
            //alert("Game over nach " + Math.floor(playTime/60) + " Sekunden!");
        }

        //Die ausgabe der Lebenspunkte
        let lifePointsElement = document.querySelector("h3");
        lifePointsElement.textContent = lifePoints + " Leben";

        //Die Ausgabe der gesammelten Coins
        let coinCountElement = document.getElementById("coinCount");
        coinCountElement.textContent = coinCount + "X";
        
    }


    //Hier wird der Hintergrund festgelegt
    const backGroundImage = new Image();
    backGroundImage.src = "Bilder/5319163.jpg";

    let backgroundWidth;
    let backgroundHeight;
    backGroundImage.onload = function() {
        backgroundWidth = layer_0.width;
        backgroundHeight = layer_0.height;
        drawBackground();
    }

    function drawBackground() {
        context_ground.clearRect(0, 0, layer_0.width, layer_0.height);
        context_ground.drawImage(backGroundImage, 0, 0, backgroundWidth, backgroundHeight);
    }


    




    
    

    

    
    
    

 
});

 
 
 
 



