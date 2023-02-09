var canH, canW;

var bgSprite, bgImg;
var boat, boatImg, boatMoveImg;
var lineL, lineR, line, lineStart, lineEnd;

var moving= false;
var gameState= 0;
var btn, inst;

var bagImg, bottleImg, rocksImg, batteryImg;
var bagsGrp, bottleGrp, rocksGrp, batteryGrp;
var bagObject, bottleObject, rocksObject, batteryObject;
var power, icon;
var waitBg;
var fuel= 500;
var collected= 0;
var score=0;
var page, pageimg;
var start= false;
var life= 3;
var lifeD1, lifeD2, lifeD3;
var lifeimg, nolife;
var waitS, playS, crash, move, bagS, bottleS;


function preload() {
  bgImg= loadImage("./assets/bg.jpg");
  boatImg= loadImage("./assets/boat.png");
  boatMoveImg= loadImage("./assets/boatmove.png");
  bagImg= loadImage("./assets/bag.png");
  bottleImg= loadImage("./assets/bottle.png");
  rocksImg= loadImage("./assets/rocks.png");
  batteryImg= loadImage("./assets/battery.png");
  power= loadImage("./assets/power.png");
  icon= loadImage("./assets/icon.png");
  waitBg= loadImage("./assets/waitbg2.gif");
  pageimg= loadImage("./assets/page.png");
  lifeimg= loadImage("./assets/bolt.png");
  nolife= loadImage("./assets/noBolt.png");

  waitS= loadSound("./assets/playbg.mp3");
  playS= loadSound("./assets/waitbg.mp3");
  move= loadSound("./assets/move.mp3");
  crash= loadSound("./assets/crash.mp3");
  bagS= loadSound("./assets/bag.mp3");
  bottleS= loadSound("./assets/bottle.mp3");
}

function setup() {
  var isMobile= /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    canW= displayWidth;
    canH= displayHeight;
    createCanvas(displayWidth+50, displayHeight);
  }
  else{
    canW= windowWidth;
    canH= windowHeight;
    createCanvas(windowWidth, windowHeight-5);
  }
  boat= createSprite(width/2, height-150);
  boat.addImage("boat", boatImg);
  boat.addImage("boatMove", boatMoveImg);
  boat.scale= 0.7;
  //boat.debug= true;
  boat.setCollider("rectangle", 0, -30, boat.width-20, boat.height-150)

  lineL= new Boundary(width/4+50, -height, 20, height * 10);
  lineR= new Boundary(width/2+400, -height, 20, height * 10);
  lineStart= new Boundary(width/2, height-400, width, 20);
  lineEnd= new Boundary(width/2, -height*6+400, width, 20);

  line= new Boundary(width/2, height, width, 20);

  btn= createButton("Play");
  btn.position(width/2-200, height/2-300);
  btn.class("play");

  inst= createButton("Instructions");
  inst.position(width/2-200, height/2-450);
  inst.class("btn");

  logo= createImg("./assets/logo.png");
  logo.position(width/2-300, height/2+270);

  page= createImg("./assets/page.png");
  page.position(200, 10);
  page.class("gameTitleAfterEffect2");
  page.hide();

  bagsGrp= new Group();
  bottleGrp= new Group();
  rocksGrp= new Group();
  batteryGrp= new Group();

  bagsObject= new Materials(bagsGrp, 25, bagImg, 0.07);
  bottleObject= new Materials(bottleGrp, 20, bottleImg, 0.1);
  rocksObject= new Materials(rocksGrp, 10, rocksImg, 0.5);
  batteryObject= new Materials(batteryGrp, 3, batteryImg, 0.04);

  bagsObject.spawnMaterials();
  bottleObject.spawnMaterials();
  rocksObject.spawnObstacles();
  batteryObject.spawnMaterials();

  lifeD1= createSprite(width-100, camera.position.y+200);
  lifeD2= createSprite(width-200, camera.position.y+200);
  lifeD3= createSprite(width-300, camera.position.y+200);

  lifeD1.addImage("life", lifeimg);
  lifeD2.addImage("life", lifeimg);
  lifeD3.addImage("life", lifeimg);
  lifeD1.addImage("nolife", nolife);
  lifeD2.addImage("nolife", nolife);
  lifeD2.addImage("nolife", nolife);
  lifeD1.scale= 0.3
  lifeD2.scale= 0.3
  lifeD3.scale= 0.3

}


function draw() 
{


  if (gameState===0) {

    if(!waitS.isPlaying()){
      waitS.loop();
    }

    background("lightblue");
    background(waitBg);
    btn.mousePressed(()=>{
      gameState= 1;
      page.hide();
    })

    inst.mousePressed(()=>{
      page.show();
      btn.position(width/2+500, height/2-300);
      logo.position(width/2+450, height/2+270);
    })

  }
  else if (gameState===1) {

    if(waitS.isPlaying()){
      waitS.stop();
    }

    if(!playS.isPlaying()){
      playS.loop();
      playS.setVolume(0.5);
    }

    background("lightblue");
    btn.hide();
    inst.hide();
    logo.position(10, 10);
    logo.class("gameTitleAfterEffect");

    image(bgImg, 25, -height * 6, width-50, height * 7);
    handlePlayerControl();
  
    camera.position.y = boat.position.y-100;
    lifeD1.position.y= camera.position.y+200;
    lifeD2.position.y= camera.position.y+200;
    lifeD3.position.y= camera.position.y+200;

    if (moving === true || start=== true) {
      boat.position.y-=3;
      fuel -= 0.07;
      collected+= 10;
    }
  
    lineL.display();
    lineR.display();
    lineStart.display();
    lineEnd.display();
    line.display();
  
    lineL.collisionWboat();
    lineR.collisionWboat();
    line.collisionWboat();

    
    drawSprites();

    lives();

   /* textSize(30);
    fill("red");
    text("Score: "+ score, width-200, camera.position.y-200);*/

    energyBar();
    collectedBar();
  
    handleCollisionwithObstacles();
    handleCollisionwithPlastic();
    if (fuel <= 0) {
      gameState=2;
        swal({
          title: "Game Over",
          text: "You ran out of power!",
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFAsFzRRacEftC0n5O2S_TKsTCOHdFHr2Y8fLc2Zmli3lItLbpyoi15Tj_50XBg2cDG4&usqp=CAU",
          imageSize: "300x300",
          confirmButtonText: "Play Again"
        },
        function (isConfirm) {
          if (isConfirm) {
            location.reload();
          }
        })
    }
  } 

function handlePlayerControl() {
  if (keyIsDown(UP_ARROW)) {
    boat.position.y -= 10;
    moving=true;
    boat.changeImage("boatMove");
    fuel -= 1;
    if (!move.isPlaying()) {
      move.loop();
      move.setVolume(1);
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    boat.position.x -= 5;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    boat.position.x += 5;
  }

 /* if (keyIsDown(DOWN_ARROW)) {
    boat.position.y += 20;
  }*/
}

function energyBar(){
  push();
  image(power, width/2-250, camera.position.y-400, 40, 40);

  fill("white");
  rect(width/2-200, camera.position.y-400, 500, 30);

  fill("#FFD732");
  rect(width/2-200, camera.position.y-400, fuel, 30);

  noStroke();

  pop();
}

function collectedBar(){
  push();
  image(icon, width/2-250, camera.position.y-350, 40, 40);

  fill("white");
  rect(width/2-200, camera.position.y-350, 500, 30);

  fill("#B1C635");
  rect(width/2-200, camera.position.y-350, score, 30);

  noStroke();

  pop();
}

function handleCollisionwithObstacles() {

  boat.overlap(rocksGrp, function(collection, collected){
   collected.remove();
    life= life-1;
    console.log("LIVES:", life);
      crash.play();
      crash.setVolume(12)
  })
}

function handleCollisionwithPlastic() {
  boat.overlap(bagsGrp, function(collection, collected){
    collected.remove();
    score= score + 12
      bagS.play();
  })

  boat.overlap(bottleGrp , function(collection, collected){
    collected.remove();
    score= score + 10
    bagS.play();
  })

  boat.overlap(batteryGrp , function(collection, collected){
    collected.remove();
    bottleS.play();
    if (fuel<=450) {
      fuel+=50;
    } else{
      fuel=500;
    }

  
  })
}

function lives(){
  if(life == 2){
    lifeD1.changeImage("nolife");
    lifeD1.scale=0.3;
  }
  if(life == 1){
    lifeD2.changeImage("nolife");
    lifeD2.scale=0.3;
  }
  if(life == 0){
    lifeD3.changeImage("nolife");
    lifeD3.scale=0.3;
    fuel=0;
    gameState=2;
 
    if (score>=10) {
      swal({
        title: "Mission Failed",
        text: "Power ran out! You collected "+score+" pieces of plastic. Well done!",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFAsFzRRacEftC0n5O2S_TKsTCOHdFHr2Y8fLc2Zmli3lItLbpyoi15Tj_50XBg2cDG4&usqp=CAU",
        imageSize: "300x300",
        confirmButtonText: "Play Again"
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
        }
      })
    }else{
      swal({
        title: "Mission Failed",
        text: "Power ran out! The river is still polluted.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFAsFzRRacEftC0n5O2S_TKsTCOHdFHr2Y8fLc2Zmli3lItLbpyoi15Tj_50XBg2cDG4&usqp=CAU",
        imageSize: "300x300",
        confirmButtonText: "Play Again"
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
        }
      })
    }

  }
}
}