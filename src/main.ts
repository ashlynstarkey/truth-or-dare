class PromptQueue {
    prompts: Array<string>;
    nextIndex: number;

    constructor(prompts: Array<string>) {
        this.prompts = Array.from(prompts);
        this.nextIndex = 0;
        this.shuffle();
    }

    next(): string {
        let result:string = this.prompts[this.nextIndex++];

        if (this.nextIndex == this.prompts.length) {
            this.nextIndex = 0;
            this.shuffle();
        }

        return result;
    }

    shuffle(): void {
        let current: number = this.prompts.length;

        while (current != 0) {
            let random: number = Math.floor(Math.random() * current);
            current--;

            let temp: string = this.prompts[current];
            this.prompts[current] = this.prompts[random];
            this.prompts[random] = temp;
        }
    }
}

let truths: Array<string> = [
    "What is your biggest fear?",
    "What is the most embarrassing thing you've ever done?",
    "What's a secret you've never told anyone?",
    "What is your biggest fantasy?",
    "When was the last time you cried?"
];

let dares: Array<string> = [
    "Yell out the first word that comes to your mind.",
    "Hold your nose while you sing the chorus of your favorite song.",
    "Call your dad and say you got engaged.",
    "Dance for 30 seconds to a Snoop Dogg song.",
    "Eat a whole raw clove of garlic."
];

let truthQueue: PromptQueue = new PromptQueue(truths);
let dareQueue: PromptQueue = new PromptQueue(dares);

function setTruths(array: Array<string>) {
    truths = array;
    truthQueue = new PromptQueue(truths);
}

function setDares(array: Array<string>) {
    dares = array;
    dareQueue = new PromptQueue(dares);
}

function restoreState() {
    let storedTruths: any = window.localStorage.getItem("truths");
    let storedDares: any = window.localStorage.getItem("dares");

    if (storedTruths != null) setTruths(JSON.parse(storedTruths));
    if (storedDares != null) setDares(JSON.parse(storedDares));
}

function saveState() {
    window.localStorage.setItem("truths", JSON.stringify(truths));
    window.localStorage.setItem("dares", JSON.stringify(dares));
}

window.addEventListener("load", (ev: Event) => {
    restoreState();
});

function displayTruth() {
    (<HTMLElement> document.querySelector("#prompt-header")).innerText = "TRUTH";
    (<HTMLElement> document.querySelector("#prompt-result")).innerText = truthQueue.next();
}

function displayDare() {
    (<HTMLElement> document.querySelector("#prompt-header")).innerText = "DARE";
    (<HTMLElement> document.querySelector("#prompt-result")).innerText = dareQueue.next();
}

document.querySelector("#truth-btn")!.addEventListener("click", displayTruth);
document.querySelector("#dare-btn")!.addEventListener("click", displayDare);
document.querySelector("#random-btn")!.addEventListener("click", (ev: Event) => {
    Math.random() < 0.5 ? displayTruth() : displayDare();
});
document.querySelector("#show-editor-btn")!.addEventListener("click", (ev: Event) => {
    showEditor();
});



const editor = <HTMLElement> document.querySelector("#editor");
const main = <HTMLElement> document.querySelector("#main");
const truthTextArea = <HTMLTextAreaElement> document.querySelector("#truth-text-area");
const dareTextArea = <HTMLTextAreaElement> document.querySelector("#dare-text-area");
const editorSaveBtn = <HTMLButtonElement> document.querySelector("#editor-save-btn");
editorSaveBtn.addEventListener("click", hideEditor);


function showEditor() {
    editor.style.display = "block";
    main.style.display = "none";
    truthTextArea.value = truths.join("\n");
    dareTextArea.value = dares.join("\n");
}

function hideEditor() {
    editor.style.display = "none";
    main.style.display = "block";
    setTruths(truthTextArea.value.split("\n"));
    setDares(dareTextArea.value.split("\n"));
    saveState();
}