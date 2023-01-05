"use strict";
class PromptQueue {
    constructor(prompts) {
        this.prompts = Array.from(prompts);
        this.nextIndex = 0;
        this.shuffle();
    }
    next() {
        let result = this.prompts[this.nextIndex++];
        if (this.nextIndex == this.prompts.length) {
            this.nextIndex = 0;
            this.shuffle();
        }
        return result;
    }
    shuffle() {
        let current = this.prompts.length;
        while (current != 0) {
            let random = Math.floor(Math.random() * current);
            current--;
            let temp = this.prompts[current];
            this.prompts[current] = this.prompts[random];
            this.prompts[random] = temp;
        }
    }
}
let truths = [
    "What is your biggest fear?",
    "What is the most embarrassing thing you've ever done?",
    "What's a secret you've never told anyone?",
    "What is your biggest fantasy?",
    "When was the last time you cried?"
];
let dares = [
    "Yell out the first word that comes to your mind.",
    "Hold your nose while you sing the chorus of your favorite song.",
    "Call your dad and say you got engaged.",
    "Dance for 30 seconds to a Snoop Dogg song.",
    "Eat a whole raw clove of garlic."
];
let truthQueue = new PromptQueue(truths);
let dareQueue = new PromptQueue(dares);
function setTruths(array) {
    truths = array;
    truthQueue = new PromptQueue(truths);
}
function setDares(array) {
    dares = array;
    dareQueue = new PromptQueue(dares);
}
function restoreState() {
    let storedTruths = window.localStorage.getItem("truths");
    let storedDares = window.localStorage.getItem("dares");
    if (storedTruths != null)
        setTruths(JSON.parse(storedTruths));
    if (storedDares != null)
        setDares(JSON.parse(storedDares));
}
function saveState() {
    window.localStorage.setItem("truths", JSON.stringify(truths));
    window.localStorage.setItem("dares", JSON.stringify(dares));
}
window.addEventListener("load", (ev) => {
    restoreState();
});
function displayTruth() {
    document.querySelector("#prompt-header").innerText = "TRUTH";
    document.querySelector("#prompt-result").innerText = truthQueue.next();
}
function displayDare() {
    document.querySelector("#prompt-header").innerText = "DARE";
    document.querySelector("#prompt-result").innerText = dareQueue.next();
}
document.querySelector("#truth-btn").addEventListener("click", displayTruth);
document.querySelector("#dare-btn").addEventListener("click", displayDare);
document.querySelector("#random-btn").addEventListener("click", (ev) => {
    Math.random() < 0.5 ? displayTruth() : displayDare();
});
document.querySelector("#show-editor-btn").addEventListener("click", (ev) => {
    showEditor();
});
const editor = document.querySelector("#editor");
const main = document.querySelector("#main");
const truthTextArea = document.querySelector("#truth-text-area");
const dareTextArea = document.querySelector("#dare-text-area");
const editorSaveBtn = document.querySelector("#editor-save-btn");
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
