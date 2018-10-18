const COLORS = Object.freeze(
{
    RED:    "#FF0000",
    WHITE:  "#FFFFFF",
    BLACK:  "#000000",
    YELLOW: "#FFFF00",
    BLUE:   "#0000FF",
});

const DIRECTION = Object.freeze(
{
    UP:     "UP",
    DOWN:   "DOWN",
    LEFT:   "LEFT",
    RIGHT:  "RIGHT",
    RANDOM: "RANDOM",
});

const MINSIZE = 15;

var canvas, ctx;
var items = [];
var timer;
var maxSize = 30;

/* TBall class*/
class TBall
{
    constructor(pX, pY, dir)
    {
        this.size  = GetRandomSize();
        this.color = GetRandomColor();
        this.posX  = pX;
        this.posY  = pY;
        this.dir   = dir;
        this.speed = 5;
    }
    
    Draw()
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    
    Move()
    {
        switch(this.dir)
        {
            case DIRECTION.UP:
                this.posY += this.speed;
                break;
            case DIRECTION.DOWN:
                this.posY -= this.speed;
                break;
            case DIRECTION.LEFT:
                this.posX -= this.speed;
                break;
            case DIRECTION.RIGHT:
                this.posX += this.speed;
                break;
            default:
                //should be random direction
                this.posX += this.speed;
                this.posY += this.speed;
                break;
        }
    }
}

/* Actions when page is loaded*/
function Init()
{
    canvas = document.getElementById("canvas");
    
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight / 2;
    
    if(canvas.getContext)
    {
        ctx = canvas.getContext('2d');
        
        DrawBackground();
        SetTimers();
    }
}

function SetDefault()
{
    
}

/* Draw functions*/
function DrawBackground()
{
    ctx.save();
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

/* On mouse click */
function CreateItem(evt)
{
    let item = new TBall(GetMousePos(evt).x, GetMousePos(evt).y, GetRandomDir());
    
    item.Draw();
    item.Move();
    items.push(item);
}

/* Animation */
function MoveItems()
{
    DrawBackground();
    
    let i = 0;
    
    while (i < items.length)
    {
        items[i].Draw();
        items[i].Move();
        i++;
    }
}

/* Get random attributes */
function GetRandomColor() 
{
    let keys = Object.keys(COLORS);

    return COLORS[keys[Math.floor(keys.length * Math.random())]];
}

function GetRandomDir() 
{
    let keys = Object.keys(DIRECTION);

    return DIRECTION[keys[Math.floor(keys.length * Math.random())]];
}

function GetRandomSize() 
{
    if (maxSize <= MINSIZE) return 15;
    
    return Math.random() * (maxSize - MINSIZE) + MINSIZE;
}

/* Utility functions */
function GetMousePos(evt) 
{
    return( 
    {
        x: evt.clientX - canvas.offsetLeft,
        y: evt.clientY - canvas.offsetTop
    });
}

/* Set animation */
function SetTimers()
{
    timer = setInterval(MoveItems, 30);
}

/* Input handlers */
function ChangeMaxSize()
{
    maxSize = Number(document.getElementById("size").nodeValue);
}