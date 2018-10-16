const DIRECTION = Object.freeze(
{
    LEFT:  "LEFT",
    RIGHT: "RIGHT",
});

const COLORS = Object.freeze(
{
    RED:    "#FF0000",
    WHITE:  "#FFFFFF",
    BLACK:  "#000000",
    YELLOW: "#FFFF00",
    BLUE:   "#0000FF",
});

const SIZE       = 15;
const STARTSPEED = 0.5;
const NEXTLEVEL  = 200;
const LEFTBORDER = 50; // ball start pos?
const STARTSCORE = 0;
const STARTLEVEL = 1;

var canvas, ctx;
var Items = [], Gun, GunColor;
var idTimer = -1, Timer = -1, GunTimer = -1, reloadGun = 1;
var best, score, level, randClr;

/* TBall class */
class TBall 
{
    constructor(pX, pY, dir, color) 
    {
        this.radius = SIZE;
        this.posX   = pX;
        this.posY   = pY;
        
        if      (dir == DIRECTION.LEFT)  this.speed = GetCurrentBallSpeed();
        else if (dir == DIRECTION.RIGHT) this.speed = GetCurrentShotSpeed();
        
        this.dir   = dir;
        this.color = color;
    }
    
    //Delete
    setGradient() 
    {
        let gradient = ctx.createRadialGradient(this.posX + this.radius / 4,
                                                this.posY - this.radius / 6, this.radius / 8,
                                                this.posX, this.posY, this.radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);

        return gradient;
    } 

    Move() 
    {
        if (this.dir == DIRECTION.LEFT) this.posX -= this.speed;
        else                            this.posX += this.speed;
    }

    Draw() 
    {
        ctx.fillStyle = this.setGradient(ctx);
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}

/*Starting new game*/
function Init() 
{
    canvas = document.getElementById('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight / 2;

    if (canvas.getContext) 
    {
        ctx = canvas.getContext('2d');
        GunColor = GetRandomColor();
        best = 0;
        
        DrawBackground();
        SetDefault();
        DrawBalls()
    }
}

function SetDefault()
{
    score   = STARTSCORE;
    level   = STARTLEVEL;
    randClr = GetRandomColor();
}

/* Draw */
function DrawBackground() 
{
    ctx.save();

    let g = ctx.createLinearGradient(0, 0, 0, canvas.height); //Get rid of gradient

    g.addColorStop(1, "#202020");
    g.addColorStop(0, "#aaa");
    
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, LEFTBORDER, canvas.height);
    
    ctx.restore();
}

function DrawBalls()
{
    for (let i = 11; i > 0; i--) 
    {
        if (Math.floor(Math.random() * 2) == 1)
        {
            let posX = canvas.width;
            let posY = canvas.height - i*33 + 5;
            let item = new TBall(posX, posY, "LEFT", GetRandomColor());
            
            item.Draw();
            Items.push(item);
        }
    }
}

function DrawGun() 
{
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, Gun.y-15, 40, 35);
    ctx.fillStyle = GunColor;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

/* on mouse move */
function GetMousePos(evt) 
{
    return( 
    {
        x: evt.clientX - canvas.offsetLeft,
        y: evt.clientY - canvas.offsetTop
    });
}

function SetGunPos(evt)
{ 
    Gun = GetMousePos(evt);
}

/* on mouse click */
function MakeShot(event) 
{
    if (idTimer != -1 && reloadGun == 1)
    {
        reloadGun = 0;
        
        let item = new TBall(LEFTBORDER, GetMousePos(event).y, "RIGHT", GunColor);
                
        GunColor = GetRandomColor();
        item.Draw();
        Items.push(item);
        DrawGun();
    }
}

/* Collisions */
function CheckCollisions() 
{
    let collided = new Set();

    for (let i = 0; i < Items.length - 1; ++i)
    {
        for (let j = i + 1; j < Items.length; ++j) 
        {
            if (IsCollided(Items[i], Items[j])) 
            {
                collided.add(i);
                collided.add(j);
            }
        }
    }

    collided = Array.from(collided).sort((a, b) => b - a);

    for (let i of collided) 
    {
        Items.splice(i, 1);
        score += 5/2;
        document.getElementById("Score").value = score;
    }

    if (level < GetCurrentLevel())
    {
        level = GetCurrentLevel();
        document.getElementById("Level").value = level;
        
        ChangeSpeed();
    }
}

function IsCollided(a, b) 
{
    let result = Math.sqrt((a.posX - b.posX) ** 2 + (a.posY - b.posY) ** 2) <= a.radius + b.radius; // Add > 2 collided objecs

    if (a.color == b.color)
    {
        return result;
    }
    
    if (result)
    {
        a.dir   = b.dir   = "LEFT";
        a.speed = b.speed = GetCurrentBallSpeed();
    }
    
    return 0;
}

/* Timer functions */
function MoveItems() 
{
    DrawBackground();
    CheckCollisions();
    
    let i = 0;

    while(i < Items.length) 
    {
        Items[i].Move();
        Items[i].Draw();

        if (Items[i].posX <= LEFTBORDER && Items[i].dir == DIRECTION.LEFT)
        {
            if (best < score) best = score;
            
            ResetTimers();
            SetDefault();
            Items = [];
            
            document.getElementById("best").value = best;
            document.getElementById("Level").value = level;
            document.getElementById("Score").value = score;
            alert("Вы проиграли!"); // Boring
        }
        else if (Items[i].posX > canvas.width)
        {
            Items.splice(i, 1);
        }
        else
        {
            i++;
        }
    }

    DrawGun();
}

function GetBullet() 
{
    reloadGun = 1;
}

/* Timers handling */
function SetTimers() 
{
    if (idTimer === -1)
    {
        idTimer  = setInterval(MoveItems, 30);
        Timer    = setInterval(DrawBalls, 2000 + level*3000);
        GunTimer = setInterval(GetBullet, 500);
    }
}

function ResetTimers()
{
    clearInterval(idTimer);
    clearInterval(Timer);
    clearInterval(GunTimer);
    
    if (idTimer == -1) SetTimers();
    else               idTimer = -1;
}

/* Calc current attributes */
function GetCurrentLevel()
{
    return (1 + Math.floor(score/NEXTLEVEL));
}

function GetCurrentBallSpeed()
{
    return (STARTSPEED + Math.floor(score/NEXTLEVEL) / 4);
}

function GetCurrentShotSpeed()
{
    return (5 + level / 2);
}

/* Utility functions */
function GetRandomColor() 
{
    let keys = Object.keys(COLORS);

    return COLORS[keys[Math.floor(keys.length * Math.random())]];
}

function ChangeSpeed() 
{   
    for(let i = 0; i < Items.length; i++)
    {
        if (Items[i].dir == DIRECTION.LEFT) Items[i].speed = GetCurrentBallSpeed();
        else                                Items[i].speed = GetCurrentShotSpeed();
    }
}

/* Keybord handlers */
function HandleKeys(event)
{
    let key = event.keyCode;
    
    switch(key)
    {
        case 32:
            ResetTimers();
            break;
        default:
            break;
    }
}