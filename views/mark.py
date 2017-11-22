# coding: utf-8

from leancloud import Object
from leancloud import Query
from leancloud import LeanCloudError
from flask import Blueprint
from flask import request
from flask import redirect
from flask import url_for
from flask import render_template
import json
class Mark(Object):
    pass

mark_view = Blueprint('mark', __name__)

Mark = Object.extend('Mark')
query = Query(Mark)

@mark_view.route('', methods=['POST'])
def add():
    pass

# 确认图片是否已经上传成功
@mark_view.route('/confirm', methods=['POST'])
def mark_confirm():
    data = json.loads(request.data.decode('utf-8'))
    name = data['name']
    count = query.equal_to("name", name).count()
    if count:
        mark = query.first().dump()
        info = {
            'content': mark['content'],
            'lines': mark['lines']
        }
    else:
        info = False
    response = json.dumps({
        "status": 200,
        "info": info
    })
    return response

# 增加图片标记信息
@mark_view.route('/addmark', methods=['POST'])
def add_mark():
    data = json.loads(request.data.decode('utf-8'))
    name = data['name']
    content = data['content']
    lines = data['lines']
    query.equal_to("name", name)
    if query.find():
        mark = query.find()[0]
        name = mark.id
        cql = 'update Mark set content = ?, lines = ? where objectId = ?'
        result = Query.do_cloud_query(cql, content, lines, name)
    else:
        mark = Mark(content=content, name=name, lines=lines)
        try:
            mark.save()
        except LeanCloudError as e:
            return e.error, 502
    response = json.dumps({
        "status": 200,
    })
    return response

