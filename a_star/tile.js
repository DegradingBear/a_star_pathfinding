class TileClass{

    constructor(col, x, y, cellSize){
        this.col = col;
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.isWall = false;
        this.h = Infinity;
        this.g = Infinity;
        this.prevTile = null;
        this.endTile = null;
    }

    draw(){
        stroke(this.col);
        fill(this.col);
        rect(this.x*this.cellSize, this.y*this.cellSize, this.cellSize);
        return //comment this if you want to see the cost values
        if(this.g == Infinity || this.h == Infinity || this.isWall){
            return
        }
        stroke(0,0,0);
        fill(0,0,0);
        textSize(floor(this.cellSize/2));
        text(floor((this.g+this.h)), floor((this.x)*this.cellSize), floor((this.y+0.5)*this.cellSize));
    }


    calculateCost(parent){
        if(parent === this){
            this.g = 0;
            this.h = 10 * (sqrt((this.x-this.endTile.x)**2 + (this.y - this.endTile.y)**2));
            return
        }
        let g = parent.g;
        this.endTile = parent.endTile;
        if(parent.x == this.x || parent.y == this.y){
            g += 10;
        }else{
            g += 14;
        }
        let xDif = abs(this.endTile.x - this.x);
        let yDif = abs(this.endTile.y - this.y);
        let h = 14*(max(xDif, yDif)-abs(xDif-yDif)) + 10*(max(xDif,yDif)-min(xDif, yDif));
        this.h = h;

        if(g < this.g){
            this.g = g;
            this.prevTile = parent;
        }
    }

    getCost(){
        return floor(this.g + this.h);
    }

}