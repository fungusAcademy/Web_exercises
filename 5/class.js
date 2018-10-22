//Items classes in separate file

/* 
    -- Warning --
   I'm not really good with JS inheritance, so be aware:
   lots of copy-paste !
*/

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
        // for diagonal direction
        this.dirX  = Math.random() < 0.65 ? -1 : 1;
        this.dirY  = Math.random() < 0.25 ? -1 : 1;
    }
    
    Draw()
    {
        ctx.fillStyle = this.SetGradient();
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
    
    SetGradient() 
    {
        let gradient = ctx.createRadialGradient(this.posX + this.size / 4,
                                                this.posY - this.size / 6, this.size / 8,
                                                this.posX, this.posY, this.size);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);

        return gradient;
    } 
}