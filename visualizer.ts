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
		constructor(x: number, y: number, width: number, height: number, color: string) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.color = color;
		}
		update(micInput: number) {
			this.height = micInput * 1000;
		}
		draw(context: CanvasRenderingContext2D) {
			context.fillStyle = this.color;
			context?.fillRect(this.x, this.y, this.width, this.height);
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
			bars.push(new Bars(i * barWidth, canvas.height / 2, 1, 20, color));
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
