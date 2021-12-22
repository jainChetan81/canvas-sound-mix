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
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }
        update(micInput) {
            this.height = micInput * 1000;
        }
        draw(context) {
            context.fillStyle = this.color;
            context === null || context === void 0 ? void 0 : context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    const microphone = new Microphone();
    let bars = [];
    console.log(`microphone`, microphone);
    const barWidth = canvas.width / 256;
    function createBars() {
        for (let i = 0; i < 256; i++) {
            const color = "hsl(" + i + ", 100%, 50%)";
            bars.push(new Bars(i * barWidth, canvas.height / 2, 1, 20, color));
        }
    }
    createBars();
    console.log(bars);
    function animate() {
        if (microphone.initialized) {
            ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
            const samples = microphone.getSamples();
            bars.forEach((bar, i) => {
                bar.update(samples[i]);
                bar.draw(ctx);
            });
        }
        requestAnimationFrame(animate);
    }
    animate();
}
