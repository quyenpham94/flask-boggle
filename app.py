from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify



app = Flask(__name__)
app.config["SECRET_KEY"] = 'thisissecretkey'

boggle_game = Boggle()

@app.route("/")
def home_page():
    """Displaying the board"""

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    return render_template("index.html", board=board,
                                         highscore=highscore,
                                         nplays=nplays)

@app.route("/check-word")
def check_word():
    """Check if word is in dictionary"""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board,word)
    
    return jsonify({'result': response})

@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive score, update nplays, update highscore"""

    score = request.json["score"] # sending this data as JSON when make an axios request
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    # update nplays and highscore into new json ??
    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)