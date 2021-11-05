class BoggleGame {

    // make a new game
    constructor(boardId, secs = 60) { // set default to 60 (required)
        this.secs = secs; // time to finish the game
        this.showTimer();
        this.score = 0; // set at 0 at beginning
        this.words = new Set();
        this.board = $('#' + boardId);

        // every 100ms, "tick"
        this.timer = setInterval(this.tick.bind(this), 1000);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    // show word in list of words
    showWord(word) {
        $(".words", this.board).append($("<li>", { text:word }));
    }

    // show score in html
    showScore() {
        $(".score", this.board).text(this.score);
    }

    // show a status message
    showMessage(message, cls) {
        $(".message", this.board)
        .text(message)
        .removeClass()
        .addClass(`message ${cls}`);
    }

    // handle submission of word: if unique and valid, score & show

    async handleSubmit(event){
        event.preventDefault(); // make an HTTP request without refreshing the page
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word) return;

        // check if this word is already found
        if (this.words.has(word)){
            this.showMessage(`Already found ${word}`, "err")
            return;
        }

        // check server for validity
        const res = await axios.get("/check-word", {params: {word:word}});
        if (res.data.result === "not-word") {
            this.showMessage(`${word} is not a valid English word`, "err");
        } else if (res.data.result === "not-on-board") {
            this.showMessage(`${word} is not a valid word on this board`, "err");
        } else {
            this.showWord(word);
            this.score += word.length; //score is corresponding by number of valid words
            this.showScore();
            this.words.add(word);
            this.showMessage(`Added: ${word}`, "ok");
        }

        $word.val("").focus();
    }

    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    // Tick: handle a second passing in game

    async tick() {
        this.secs -= 1; // time will countdown
        this.showTimer();

        if(this.secs === 0) {
            clearInterval(this.timer);
            await this.scoreGame();
        }

    }
    // end of game: score and update message
    async scoreGame() {
        $(".add-word", this.board).hide();
        const response = await axios.post("/post-score", { score: this.score});
        if (response.data.brokeRecord) {
            this.showMessage(`New record: ${this.score}`, "ok");
        } else {
            this.showMessage(`Final score: ${this.score}`, "ok");
        }
    }
}
