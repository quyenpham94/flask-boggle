from boggle import Boggle
from flask import Flask, render_template, session, request

boggle_game = Boggle()

app = Flask(__name__)
app.config["SECRET_KEY"] = 'thisissecretkey'

@app.route("/")
def home_page():
    """Displaying the board"""

    board = boggle_game.make_board()
    session['board'] = board

    return render_template("index.html", board=board)

@app.route("/check-word")
def check_word():
    """Check if word is in dictionary"""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board,word)
    
    return jsonify({'result': response})