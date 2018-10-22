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
    UP:       "UP",
    DOWN:     "DOWN",
    LEFT:     "LEFT",
    RIGHT:    "RIGHT",
    DIAGONAL: "DIAGONAL",
    RANDOM:   "RANDOM",
});

const MINSIZE = 15;

var canvas, ctx;
var items = [];
var timer;
var maxSize = 30, commonDir = DIRECTION.RANDOM, commonSpeed = 5;

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
        this.speed = commonSpeed;
        
        //test
        this.dirX = Math.random() < 0.65 ? -1 : 1;
        this.dirY = Math.random() < 0.25 ? -1 : 1;
        this.correction = Math.random() * 1.5;
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
                this.posY -= this.speed;
                break;
            case DIRECTION.DOWN:
                this.posY += this.speed;
                break;
            case DIRECTION.LEFT:
                this.posX -= this.speed;
                break;
            case DIRECTION.RIGHT:
                this.posX += this.speed;
                break;
            case DIRECTION.DIAGONAL:
                this.posX += this.speed * this.dirX;
                this.posY += this.speed * this.dirY;
                break;
            default:
                break;
        }
        
        this.size += 0.25;
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
    if (timer == -1) return;
    
    let dir = (commonDir == "RANDOM") ? GetRandomDir() : commonDir;    
    let item = new TBall(GetMousePos(evt).x, GetMousePos(evt).y, dir);
    
    item.Draw();
    item.Move();
    items.push(item);
}

/* Animation */
function MoveItems()
{
    DrawBackground();
    
    for (let i = 0; i < items.length; i++)
    {
        if (items[i].size >= maxSize) items.splice(i, 1);
        
        items[i].Draw();
        items[i].Move();
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
    
    keys.length -= 1;

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

function ResetTimers()
{
    clearInterval(timer);
    timer = -1;
}

/* Input handlers */
function ChangeMaxSize()
{
    maxSize = Number(document.getElementById("size").value);
}

function ChangeSpeed()
{
    commonSpeed = Number(document.getElementById("speed").value);
}

/* Button handlers */
function HandleKeys(evt)
{
    let key = evt.keyCode;
    
    switch(key)
    {
        case 32:
            SetPause();
            break;
        case 49:
            ChangeDirection(DIRECTION.RANDOM);
            break;
        case 50:
            ChangeDirection(DIRECTION.UP);
            break;
        case 51:
            ChangeDirection(DIRECTION.DOWN);
            break;
        case 52:
            ChangeDirection(DIRECTION.LEFT);
            break;
        case 53:
            ChangeDirection(DIRECTION.RIGHT);
            break;
        case 54:
            ChangeDirection(DIRECTION.DIAGONAL);
            break;
        default:
            break;
    }
}

function ChangeDirection(dir)
{
    commonDir = dir;
    
    for (let i = 0; i < items.length; i++)
    {
        if (dir == DIRECTION.RANDOM) items[i].dir = GetRandomDir();
        else                         items[i].dir = dir;
    }
}

function SetPause()
{
    if (timer == -1) SetTimers()
    else             ResetTimers();
}