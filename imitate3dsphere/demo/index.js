import Stats from 'stats.js';

var stats = new Stats();
document.body.appendChild( stats.dom );

class Point extends F3.Obj {
    constructor(radius=5) {
        super();
        this.radius = radius;
        this.color = 'rgba('+[Math.random()*255|0,Math.random()*255|0,Math.random()*255|0, Math.random()].join(',')+')';
        this.prevCrood = null;
    }
    render(ctx) {
        // this.prevCrood = this.prevCrood || this.croods2D.position.clone();

        // ctx.fillStyle = this.color;
        // ctx.beginPath();


        // console.log(
        //     this.croods2D.position.x, 
        //     this.croods2D.position.y,
        //     this.radius * this.croods2D.scale + 1, 
        //     this.radius * this.croods2D.scale + 1
        // );

        // if (this.croods2D.scale < 5)
        ctx.fillStyle = '#fff';
        // ctx.fillRect(this.croods2D.position.x, 
        //     this.croods2D.position.y,1,1);
        ctx.fillRect(
            this.croods2D.position.x, 
            this.croods2D.position.y,
            this.radius * this.croods2D.scale * this.yScale, 
            this.radius * this.croods2D.scale * this.yScale
        );

        // ctx.beginPath();
        // ctx.moveTo(
        //     this.croods2D.position.x, 
        //     this.croods2D.position.y
        // );
        // ctx.arc(
        //     this.croods2D.position.x, 
        //     this.croods2D.position.y, 
        //     this.radius * this.croods2D.scale * this.yScale, 0, Math.PI * 2);
        // ctx.fill();

        // ctx.strokeStyle = '#fff'//this.color;
        // ctx.lineWidth = this.radius * this.croods2D.scale// * this.zScale;
        // ctx.lineCap = "round";
        // ctx.beginPath();
        // ctx.moveTo(this.croods2D.position.x, this.croods2D.position.y);
        // ctx.lineTo(this.croods2D.position.x, this.croods2D.position.y);
        // // ctx.lineTo(this.prevCrood.x, this.prevCrood.y);
        // ctx.stroke();
        // this.prevCrood = this.croods2D.position.clone();
    }
}

class Effect extends F3.Time {
    constructor(renderer, scene, camera,  cvs) {
        super();
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.cvs = cvs;
        
        this.xOffset = 0;
        this.waveHeight = 0.4; // 波高
        this.waveWidth = 8; // 波长

        this.col = 33;
        this.colPointNum = 33;
        
        this.flyTime = 2000;
        this.timePass = 0;

        this.scale = 1;
        this.scaleStep = 0.01;

        this.pointGroup = new F3.Obj();
        this.scene.add(this.pointGroup);

        this.resize(cvs.width, cvs.height);
        this.init();
    }
    resize(width, height) {
        this.cvs.width = width;
        this.cvs.height = height;
        // this.pointGroup.position.set(this.cvs.width/2, this.cvs.height, 0);
        this.stepWidth = width * 1.8 / this.col;
        this.pointGroup.setPosition(this.cvs.width/2, this.cvs.height * 1.2, -this.col * this.stepWidth/2);
        this.pointGroup.setRotation(0.1, 0, 0);
        // this.waveHeight = height/2;
        // this.waveWidth = this.waveHeight * 4;
        // console.log(this.stepWidth);
    }
    init() {
        // create point
        var point;
        for (let x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
            for (let z = -(this.colPointNum-1) / 2; z <= (this.colPointNum-1) / 2 ; z++ ) {    
                point = new Point(10);
                this.pointGroup.add(point);
                /*point.initPos = new F3.Vector3(
                     x + Math.random() * -2 + 1,
                     -30 + -10 * Math.random(),
                     z + Math.random() * -2 + 1
                );*/
                point.initPos = new F3.Vector3(0,0,0);
                point.flyDelay = 0//Math.random() * 1000 | 0;
            }
        }
    }
    update(delta) {
        this.timePass += delta;
        this.xOffset = this.timePass / 500;

        let point;
        let flyPecent;
        
        // if (this.timePass < 100)
        for (let x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
            for (let z = -(this.colPointNum-1) / 2; z <= (this.colPointNum-1) / 2 ; z++ ) {    

                // let y = Math.cos(x*Math.PI/this.waveWidth + this.xOffset)*Math.sin(z*Math.PI/this.waveWidth + this.xOffset) * this.waveHeight;
                
                let v = 2;//1 + (this.timePass % 1000)/1000; 
                let y = Math.sin(Math.sqrt(Math.pow(x/v, 2)+Math.pow(z/v, 2)) - this.xOffset) * 1

                point = this.pointGroup.children[count]
                point.yScale = 1;//(-y + 0.6)/(this.waveHeight) * 1.5;

                flyPecent = (this.timePass-point.flyDelay) / this.flyTime;
                flyPecent = flyPecent > 1 ? 1: (flyPecent < 0? 0: flyPecent);

                point.setPosition(
                    x * this.stepWidth,
                    y * this.stepWidth,
                    z * this.stepWidth
                );
                count++;
            }
        }
        // if (this.timePass > this.flyTime)
        // this.pointGroup.setRotation(
        //     this.pointGroup.rotation.x +0.0000,
        //     this.pointGroup.rotation.y +0.001,
        //     this.pointGroup.rotation.z +0.000   
        // );
    }
    animate() {
        this.addTick((delta)=>{
            stats.update();
            this.update(delta);
            this.renderer.render(this.scene, this.camera);
        });
    }
}

window.bannerInit = function(cvs) {
    let ctx = cvs.getContext('2d');

    let scene = new F3.Scene();
    let camera = new F3.Camera();
    camera.origin = new F3.Vector3(cvs.width/2, cvs.height/3);
    camera.p = 800;

    let renderer = new F3.Renderer(ctx, cvs);
    let effect = new Effect(renderer, scene, camera, cvs);

    effect.animate();

    F3.TIME.start();
}