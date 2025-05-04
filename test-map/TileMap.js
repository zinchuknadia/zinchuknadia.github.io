export default class TileMap{
    constructor(tileSize) {
    this.tileSize = tileSize;
    this.wall = this.#image("wall.png");
    this.dot = this.#image("yellowDot.png");
    this.pacman = this.#image("pacman.png");
    this.ghost = this.#image("ghost.png");
  }

  #image(fileName){
    const img = new Image();
    img.src = `images/${fileName}`;
    return img; 
  }

  //1 - wall
  //0 - dots
  //2 - pacman
  //3 - ghost
  map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,2,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];


  draw(canvas, ctx) {
    this.#setCanvasSize(canvas);
    this.#clearCanvas(canvas, ctx);
    this.#drawMap(ctx);
  }

  #drawMap(ctx){
    for(let row = 0; row < this.map.length; row++){
      for(let col = 0; col < this.map[row].length; col++){
        const tile = this.map[row][col];
        let image = null;
        switch(tile){
          case 1:
            image = this.wall;
            break;
          case 0:
            image = this.dot;
            break;
          case 2:
            image = this.pacman;
            break;
          case 3:
            image = this.ghost;
            break;
        }
        if(image != null){
          ctx.drawImage(
            image, 
            col * this.tileSize, 
            row * this.tileSize, 
            this.tileSize, 
            this.tileSize
          );
        }
      }
    }
  }

  #clearCanvas(canvas, ctx){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
    
  #setCanvasSize(canvas){
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }
}