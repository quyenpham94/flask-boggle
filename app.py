from boggle import Boggle
from flask import Flask, render_template, session

boggle_game = Boggle()

app = Flask(__name__)
app.config["SECRET_KEY"] = 'thisissecretkey'

@app.route("/")
def home_page():
    """Displaying the board"""

    board = boggle_game.make_board()
    session['board'] = board

    return render_template("index.html", board=board)