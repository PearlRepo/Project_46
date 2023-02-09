class Materials{
    constructor(spriteGroup, noOfSprites, spriteImg, scale){
        

        this.noOfSprites= noOfSprites;
        this.spriteImg= spriteImg;
        this.spriteGroup= spriteGroup;
        this.scale= scale;
    }

    spawnMaterials(){
        for (let i = 0; i < this.noOfSprites; i++) {
            var x, y;
            x= Math.round(random(width/2-250, width/2+300));
            y= Math.round(random(-height*5, height-500));

            var material= createSprite(x, y);
            material.addImage(this.spriteImg);
            material.scale= this.scale;
            this.spriteGroup.add(material);

          //  console.log(i);
        }
    }

    spawnObstacles(){
        for (let i = 0; i < this.noOfSprites; i++) {
            var x, y;
            x= Math.round(random(width/2-250, width/2+300));
            y= Math.round(random(-height*5, height-500));

            var material= createSprite(x, y);
            material.addImage(this.spriteImg);
            material.scale= this.scale;
            material.setCollider("circle", 0, 0, 100);
          //  material.debug= true;
            this.spriteGroup.add(material);

           // console.log(i);
        }
    }
}