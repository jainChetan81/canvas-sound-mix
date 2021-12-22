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
		draw(context: CanvasRenderingContext2D) {
			// context.fillStyle = this.color;
			// context.fillRect(this.x, this.y, this.width, this.height);
			context.strokeStyle = this.color;
			context.save();

			context.translate(canvas.width / 2, canvas.height / 2);
			context.rotate(this.index * 0.05);
			context.beginPath();
			// context.moveTo(this.x, this.height);
			context.moveTo(this.x, this.y);
			context.lineTo(this.y, this.height);
			context.stroke();

			context.restore();
		}
	}

	// const bar1 = new Bars(10, 10, 100, 200, "blue");
	const microphone: Microphone = new Microphone();
	let bars: Bars[] = [];
	console.log(`microphone`, microphone);
	const barWidth: number = canvas.width / 256;
	function createBars() {
		for (let i = 0; i < 256; i++) {
			const color = "hsl(" + i + ", 100%, 50%)";
			bars.push(new Bars(i * barWidth, canvas.height / 2, 1, 20, color, i));
		}
	}
	createBars();
	console.log(bars);
	function animate() {
		if (microphone.initialized) {
			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			//TODO: generate audio samples for canvas
			const samples: number[] = microphone.getSamples();
			// TODO: animate bars based on microphone data
			bars.forEach((bar: Bars, i: number) => {
				bar.update(samples[i]);
				bar.draw(ctx);
			});
		}
		requestAnimationFrame(animate);
	}
	animate();
}
