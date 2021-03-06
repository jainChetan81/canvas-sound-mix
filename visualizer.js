"use strict";
function main() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = +window.innerWidth;
    canvas.height = +window.innerHeight;
    window.addEventListener("resize", () => {
        canvas.width = +window.innerWidth;
        canvas.height = +window.innerHeight;
    });
    class Bars {
        constructor(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        update(micInput) {
            const sound = micInput * 1000;
            if (sound > this.height) {
                this.height = sound;
            }
            else {
                this.height -= this.height * 0.03;
            }
        }
        draw(context, volume) {
            context.strokeStyle = this.color;
            context.save();
            context.translate(0, 0);
            context.rotate(this.index * 0.03);
            context.scale(1, 1);
            context.beginPath();
            context.scale(1 + volume * 0.8, 1 + volume * 0.8);
            context.moveTo(this.x, this.y);
            context.lineTo(this.y, this.height);
            context.stroke();
            context.strokeRect(this.y, this.height, this.height / 2, 5);
            context.restore();
        }
    }
    const microphone = new Microphone();
    let bars = [];
    const barWidth = canvas.width / 256;
    function createBars() {
        for (let i = 0; i < 256; i++) {
            const color = "hsl(" + i * 2 + ", 100%, 50%)";
            bars.push(new Bars(0, i * 1.5, 5, 50, color, i));
        }
    }
    createBars();
    let angle = 0;
    function animate() {
        if (microphone.initialized) {
            ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
            const samples = microphone.getSamples();
            const volume = microphone.getVolume();
            angle -= 0.001 + volume * 0.05;
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle);
            bars.forEach((bar, i) => {
                bar.update(samples[i]);
                bar.draw(ctx, volume);
            });
            ctx.restore();
        }
        requestAnimationFrame(animate);
    }
    animate();
}
