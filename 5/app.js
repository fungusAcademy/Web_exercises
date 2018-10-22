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
var maxSize = 30, commonDir = DIRECTION.RANDOM, commonSpeed = 5, spawnNumber = 10;

/* Actions when page is loaded or resized*/
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
    
    let dir  = (commonDir == "RANDOM") ? GetRandomDir() : commonDir;    
    let item = new TBall(GetMousePos(evt).x, GetMousePos(evt).y, dir)
    
    if (!IsClashed(item))
    {
        item.Draw();
        item.Move();
        items.push(item);
    }
}

/* Animation */
function MoveItems()
{
    DrawBackground();
    
    for (let i = 0; i < items.length; i++)
    {
        if (items[i].size >= maxSize) items.splice(i, 1);
        
        if (IsClashed(items[i]))      SetOppositeDirection(items[i]);
        
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
    
    keys.length -= 1; // del random

    return DIRECTION[keys[Math.floor(keys.length * Math.random())]];
}

function GetRandomSize() 
{
    return Math.random() * (maxSize - MINSIZE) + MINSIZE;
}

/* Utility functions */
function SetOppositeDirection(item)
{
    item.speed += 1; //bug fix
    
    switch(item.dir)
    {
        case DIRECTION.UP:
            item.dir = DIRECTION.DOWN;
            break;
        case DIRECTION.DOWN:
            item.dir = DIRECTION.UP;
            break;
        case DIRECTION.LEFT:
            item.dir = DIRECTION.RIGHT;
            break;
        case DIRECTION.RIGHT:
            item.dir = DIRECTION.LEFT;
            break;
        case DIRECTION.DIAGONAL:
            item.dirX *= -1;
            item.dirY *= -1;
            break;
        default:
            break;
    }
}

function GetMousePos(evt) 
{
    return( 
    {
        x: evt.clientX - canvas.offsetLeft,
        y: evt.clientY - canvas.offsetTop
    });
}

//Collision check
function IsClashed(item)
{
    let x    = item.posX;
    let y    = item.posY;
    let size = item.size;
    
    if (x+size > canvas.width || x-size < 0 || y-size < 0 || y+size > canvas.height) return true;
    else                                                                             return false;
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
    
    if (maxSize > 50) maxSize = 100;
    
    if (maxSize < 30) maxSize = 30;
}

function ChangeSpeed()
{
    commonSpeed = Number(document.getElementById("speed").value);
    
    if (commonSpeed > 10) commonSpeed = 10;
}

function ChangeSpawnNumber()
{
    spawnNumber = Number(document.getElementById('spawn').value);
    
    //if
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

function SpawnItems()
{
    let dir  = (commonDir == "RANDOM") ? GetRandomDir() : commonDir;    
    
    for (let i = 0; i < spawnNumber; i++)
    {
        let x    = Math.random() * canvas.width-maxSize + maxSize;
        let y    = Math.random() * canvas.height-maxSize + maxSize;
        let item = new TBall(x, y, dir)

        if (!IsClashed(item))
        {
            item.Draw();
            item.Move();
            items.push(item);
        }
    }
}