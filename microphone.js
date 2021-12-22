"use strict";
class Microphone {
    constructor() {
        this.initialized = false;
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
            this.audioContext = new AudioContext();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 512;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.microphone.connect(this.analyser);
            this.initialized = true;
        })
            .catch((err) => {
            console.log(err);
        });
    }
    getSamples() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        const normSamples = [...this.dataArray].map((sample) => sample / 128 - 1);
        return normSamples;
    }
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map((sample) => sample / 128 - 1);
        let sum = 0;
        for (let i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }
}
const microphone = new Microphone();
