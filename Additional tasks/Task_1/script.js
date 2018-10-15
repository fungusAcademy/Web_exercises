function GetRandomNumber(min, max) 
{ 
    return min + Math.random() * (max - min);
}

const Direction = Object.freeze(
{
    LEFT: "LEFT",
    RIGHT: "RIGHT",
});

const Colors = Object.freeze(
{
    RED: "#FF0000",
    WHITE: "#FFFFFF",
    BLACK: "#000000",
    YELLOW: "#FFFF00",
    BLUE: "#0000FF",
});

const SIZE = 15;
const STARTSPEED = 0.25;
const NEXTLEVEL = 200;

var canvas, ctx;
var Items = [], Gun, GunColor;
var idTimer = -1, Timer = -1, GunTimer = -1, reloadGun = 1;
var direction = Direction.LEFT;
var score = 0;
var level = 1;
var randClr = Colors.RED;
//Place in Init()

function GetRandomColor() 
{
    let keys = Object.keys(Colors);

    return Colors[keys[Math.floor(keys.length * Math.random())]];
}

class TBall 
{
    constructor(pX, pY, dir) 
    {
        this.radius = SIZE;
        this.posX = pX;
        this.posY = pY;
        this.speed = STARTSPEED + Math.floor(score/NEXTLEVEL)/4;
        this.dir = dir;
        this.color = GetRandomColor();
    }

    //Delete
    setGradient(ctx) 
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
        if (this.dir == Direction.LEFT) this.posX -= this.speed;
        else                            this.posX += this.speed;
    }

    Draw(ctx) 
    {
        ctx.fillStyle = this.setGradient(ctx);
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}

function CreateItem(x, y) 
{
    GetRandomColor();

    return new TBall(x, y, direction); //From where do I get direction?
}

function DrawBackground(ctx) 
{
    ctx.save();

    let g = ctx.createLinearGradient(0, 0, 0, canvas.height); //Fuck the gradient

    g.addColorStop(1, "#202020");
    g.addColorStop(0, "#aaa")
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, 50, canvas.height);
    
    ctx.restore();
}

function Init() 
{
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2;

    if (canvas.getContext) 
    {
        ctx = canvas.getContext('2d');
        DrawBackground(ctx);
        GunColor = GetRandomColor();
        LBall()
    }
}

function LBall()
{
    for (let i = 11; i > 0; i--) 
    {
        if (Math.floor(Math.random() * 2) == 1)
        {
            let posX = canvas.width;
            let posY = canvas.height - i*33 + 5;
            let item = CreateItem(posX, posY);
            
            item.Draw(ctx);
            Items.push(item);
        }
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

function MakeShot(event) 
{
    if (idTimer != -1 && reloadGun == 1)
    {
        reloadGun = 0;
        
        let item = CreateItem(50, GetMousePos(event).y);
        
        item.color = GunColor;
        item.speed = 5 + level/2;
        item.dir = Direction.RIGHT;
        
        GunColor = GetRandomColor(); //Maybe use new TBall ?
        
        item.Draw(ctx);
        Items.push(item);
        DrawGun();
    }
}

function ChangeSpeed() 
{
    for(let i = 0; i < Items.length; i++)
    {
        if (Items[i].dir == Direction.LEFT) Items[i].speed = STARTSPEED + Math.floor(score/NEXTLEVEL)/8;
        else                                Items[i].speed = 5 + level/2;
    }
}

function Collisions(a, b) 
{
    let result = Math.sqrt((a.posX - b.posX) ** 2 + (a.posY - b.posY) ** 2) <= a.radius + b.radius;

    if (a.color == b.color || a.dir == Direction.LEFT == b.dir)
    {
        return result;
    }
    else if (result)
    {
        a.dir = Direction.LEFT;
        a.speed = STARTSPEED + Math.floor(score/NEXTLEVEL)/4;
        b.dir = Direction.LEFT;
        b.speed = STARTSPEED + Math.floor(score/NEXTLEVEL)/4;
    }
}

function CheckCollisions() 
{
    let collided = new Set();

    for (let i = 0; i < Items.length - 1; ++i) 
    {
        for (let j = i + 1; j < Items.length; ++j) 
        {
            if (Collisions(Items[i], Items[j])) 
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
        score = score + 5/2;
        document.getElementById("Score").value = score;
    }

    if (level < 1 + Math.floor(score/NEXTLEVEL))
    {
        level = 1 + Math.floor(score/NEXTLEVEL);
        ChangeSpeed();
        document.getElementById("Level").value = level;
    }
}

function SetGunPos(evt)
{ 
    Gun = GetMousePos(evt);
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

function MoveItems() //Bad naming
{
    DrawBackground(ctx);
    CheckCollisions();

    for (let i = 0; i < Items.length;) 
    {
        Items[i].Move();
        Items[i].Draw(ctx);

        if (Items[i].posX <= 50 && Items[i].dir == Direction.LEFT)
        {
            clearInterval(idTimer);
            idTimer=-1;
            clearInterval(Timer);
            Items.splice(0, Items.length);
            level = 1; //add function SetDefault()
            score = 0;
            document.getElementById("Level").value = level;
            document.getElementById("Score").value = score;
            alert("Вы проиграли!");
        }
        else if (Items[i].posX - canvas.width > 0 || Items[i].posX < 0 ||
                 Items[i].posY < 0 || Items[i].posY - canvas.height > 0)
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

function SetTimers() 
{
    if (idTimer === -1)
    {
        idTimer = setInterval(MoveItems, 30);
        Timer = setInterval(LBall, 2000 + level*3000);
        GunTimer = setInterval(GetBullet, 500);
    }
}

function ResetTimers()
{
    clearInterval(idTimer);
    clearInterval(Timer);
    clearInterval(GunTimer);
    
    idTimer=-1;
}