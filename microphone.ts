class Microphone {
	initialized: boolean;
	analyser!: AnalyserNode;
	dataArray!: Uint8Array;
	microphone!: MediaStreamAudioSourceNode;
	audioContext!: AudioContext;
	constructor() {
		this.initialized = false;
		// HTML5 Audio API built in property to provide access to connected media inputs
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream: MediaStream) => {
				// Web audio API, to allow us to generate, play and analyze audio
				this.audioContext = new AudioContext();
				// takes raw audio data and converts it to audio node
				this.microphone = this.audioContext.createMediaStreamSource(stream);
				// creates analyzer nodes, which can be used to expose audio time and frequency data to create visualization
				this.analyser = this.audioContext.createAnalyser();
				// Fast Fourier Transform algorithm to slice up audio into equal number of samples. Default "2048"
				this.analyser.fftSize = 512;
				const bufferLength: number = this.analyser.frequencyBinCount; //frequencyBinCount : always equal to half of fftSize
				// contains 256 audio samples and each will be represented from 0-255
				this.dataArray = new Uint8Array(bufferLength);
				this.microphone.connect(this.analyser);
				this.initialized = true;
			}) //FIXME: add .bind(this) here
			.catch((err: Error) => {
				console.log(err);
			});
	}

	//to get audio samples array from microphone
	getSamples(): number[] {
		//copies the current waveform or time domain data into an Uint8Array
		this.analyser.getByteTimeDomainData(this.dataArray);
		const normSamples: number[] = [...this.dataArray].map((sample: number) => sample / 128 - 1);
		return normSamples;
	}
	getVolume(): number {
		this.analyser.getByteTimeDomainData(this.dataArray);
		let normSamples: number[] = [...this.dataArray].map((sample: number) => sample / 128 - 1);
		let sum: number = 0;
		// to measure the magnitude of a set of number of both positive and negative values
		for (let i: number = 0; i < normSamples.length; i++) {
			sum += normSamples[i] * normSamples[i];
		}
		let volume: number = Math.sqrt(sum / normSamples.length);
		return volume;
	}
}

const microphone: Microphone = new Microphone();
// console.log(`microphone`, microphone);
