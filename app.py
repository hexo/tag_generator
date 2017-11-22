# coding: utf-8

from datetime import datetime

from flask import Flask
from flask import render_template
from flask_sockets import Sockets

from views.tag import tag_view
from views.mark import mark_view
from views.pic import pic_view
app = Flask(__name__)
sockets = Sockets(app)

# 动态路由
app.register_blueprint(tag_view, url_prefix='/tag')
app.register_blueprint(mark_view, url_prefix='/mark')
app.register_blueprint(pic_view, url_prefix='/pics')

# 首页
@app.route('/')
def index():
    return render_template('test.html')

# 文档页面
@app.route('/doc')
def doc():
    return render_template('document.html')

# pic功能页
@app.route('/pic')
def pic():
    return render_template('pic.html')

@app.route('/time')
def time():
    return str(datetime.now())


@sockets.route('/echo')
def echo_socket(ws):
    while True:
        message = ws.receive()
        ws.send(message)