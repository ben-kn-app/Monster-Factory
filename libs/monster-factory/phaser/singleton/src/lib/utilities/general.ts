export class General {
    static debugLog(...debugObject) {
        console.log(debugObject);
    }

    static getRandomInt(max, min = 0) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }
}
