function main(): void {
	const canvas = document.getElementById("myCanvas")! as HTMLCanvasElement;
	const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
	canvas.width = +window.innerWidth;
	canvas.height = +window.innerHeight;
	window.addEventListener("resize", () => {
		canvas.width = +window.innerWidth;
		canvas.height = +window.innerHeight;
	});

	class Bars {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		index: number;
		constructor(x: number, y: number, width: number, height: number, color: string, index: number) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.color = color;
			this.index = index;
		}
		update(micInput: number) {
			const sound: number = micInput * 1000;
			if (sound > this.height) {
				this.height = sound;
			} else {
				this.height -= this.height * 0.03;
			}
			// this.height = micInput * 300;
		}
		draw(context: CanvasRenderingContext2D, volume: number) {
			// context.fillStyle = this.color;
			// context.fillRect(this.x, this.y, this.width, this.height);
			context.strokeStyle = this.color;
			context.save();

			context.translate(0, 0);
			context.rotate(this.index * 0.03);
			context.scale(1, 1);
			context.beginPath();
			context.scale(1 + volume * 0.8, 1 + volume * 0.8);
			// context.moveTo(this.x, this.height);
			context.moveTo(this.x, this.y);
			context.lineTo(this.y, this.height);
			context.stroke();
			context.strokeRect(this.y, this.height, this.height / 2, 5);

			context.restore();
		}
	}

	// const bar1 = new Bars(10, 10, 100, 200, "blue");
	const microphone: Microphone = new Microphone();
	let bars: Bars[] = [];
	const barWidth: number = canvas.width / 256;
	function createBars() {
		for (let i = 0; i < 256; i++) {
			const color = "hsl(" + i * 2 + ", 100%, 50%)";
			bars.push(new Bars(0, i * 1.5, 5, 50, color, i));
		}
	}
	createBars();
	let angle: number = 0;
	function animate() {
		if (microphone.initialized) {
			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			//TODO: generate audio samples for canvas
			const samples: number[] = microphone.getSamples();
			const volume: number = microphone.getVolume();
			// TODO: animate bars based on microphone data
			angle -= 0.001 + volume * 0.05;
			ctx.save();
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate(angle);
			bars.forEach((bar: Bars, i: number) => {
				bar.update(samples[i]);
				bar.draw(ctx, volume);
			});
			ctx.restore();
		}
		requestAnimationFrame(animate);
	}
	animate();
}
