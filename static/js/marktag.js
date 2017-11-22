
/**
 * Created by airghc on 2017/4/10.
 */
 Vue.config.debug = true;// 开启vue 调试功能

    new Vue({
        el: '#app',
        data: {
            basic_info: [],
            image_info: [],
            image_size: [],
            lines: [],
            flag: 0,
            canvas_width: 1600,
            canvas_height: 80,
            target: 0,
            content: '',
        },
        methods: {
            addPic: function (e) {
                e.preventDefault();
                $('input[type=file]').trigger('click');
                return false;
            },
            onFileChange: function (e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)return;
                this.createImage(files);
            },
            createImage: function (file) {
                if (typeof FileReader === 'undefined') {
                    alert('您的浏览器不支持图片上传，请升级您的浏览器');
                    return false;
                }
                var image = new Image();
                var vm = this;
                var leng = file.length;
                var i = 0
                var func = function(){
                    if(i>=leng){
                        return;
                    }
                    var info = {}
                    info.name = file[i].name
                    vm.basic_info.push(info)
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        image.src = e.target.result;
                        vm.image_info.push(e.target.result);
                        i++
                        // console.log(vm.basic_info, vm.image_info)
                        func()
                    };
                    reader.readAsDataURL(file[i]);
                }
                func()
            },
            delImage: function (index) {
                this.image_info.splice(index, 1);
                this.basic_info.splice(index, 1);
                // console.log(this.target, this.basic_info[this.target].name)
                this.showcanvas(1)
            },
            removeImage: function (e) {
                this.image_info = [];
                this.basic_info = [];
                this.lines = [];
                this.content = '';
                this.target = 0;
                this.showcanvas(0);
            },
            startMark: function () {
                this.showcanvas(1)
            },
            showcanvas: function (type) {
                var vm = this
                // console.log( vm.target, vm.line_tags)
                // console.log(content)
                if (vm.basic_info.length) {
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');
                    var image = new Image();
                    image.src = vm.image_info[vm.target];
                    //console.log(image.width)
                    if(image.width>800){
                        vm.flag = 1
                    } else{
                        vm.flag = 0
                    }
                    canvas.height = vm.canvas_height;
                    canvas.width = vm.canvas_width;
                    image.onload = function() {
                        vm.showname(vm.basic_info[vm.target].name)
                        if(vm.flag == 0){
                            context.drawImage(image, 0, 0, image.width*2, image.height*2)
                        } else {
                            context.drawImage(image, 0, 0, image.width, image.height*2)
                        }
                        vm.reviewtag()
                    }
                    if(type==1){
                         vm.fetchinfo(vm.basic_info[vm.target].name);
                    }
                    canvas.onmouseup = function (e) {
                        e.preventDefault()
                        var pointx = (e.offsetX +2)*1.6
                        var lastpoint = vm.lines[vm.lines.length-1]
                        // console.log(pointx, lastpoint)
                        if (lastpoint != pointx) {
                            vm.lines.push(pointx)
                        }
                        vm.reviewtag()
                        vm.drawone(pointx)
                    };
                }
                else {
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');
                    var image = new Image();
                    canvas.height = vm.canvas_height;
                    canvas.width = vm.canvas_width;
                    image.src = vm.image_info[vm.target];
                    image.onload = function() {
                        context.drawImage(image, 0, 0, image.width*2, image.height*2)
                        vm.reviewtag()
                    }

                }
            },
            windowtocanvas: function (x, y){
                var bbpx = canvas.getBoundingClientRect()
                return {x: x-bbpx.left, y: y-bbpx.top}
            },
            drawbuttom: function (lines){
                var vm = this
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');
                var i = 0
                while(i<vm.lines.length -1){
                    context.moveTo(lines[i], 80)
                    context.lineTo(lines[i+1], 80)
                    context.moveTo(lines[i], 0)
                    context.lineTo(lines[i+1], 0)
                    context.lineWidth = 2
                    context.strokeStyle = "rgb(187, 27, 57)"
                    context.stroke()
                    i = i+2
                }
            },
            drawtext: function (lines) {
                var vm = this
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');
                context.font = '20px serif'
                var i = 0
                while(i<vm.lines.length-1){
                    context.fillText(i/2, lines[i],20)
                    i=i+2
                }
            },
            drawlines: function(lines){
                var vm = this
                // console.log(this.line_tags)
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');
                // var lines = this.line_tags
                var i = 0
                while(i<vm.lines.length){
                    context.moveTo(lines[i], 0)
                    context.lineTo(lines[i], 80)
                    // context.moveTo(lines[i+1], 0)
                    // context.lineTo(lines[i+1], 80)
                    context.lineWidth = 1
                    context.strokeStyle = "rgb(187, 27, 57)"
                    context.stroke()
                    i = i+1
                }
            },
            drawone: function(line){
                var vm = this
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');
                context.moveTo(line, 0)
                context.lineTo(line, 80)
                context.lineWidth = 1
                context.strokeStyle = "rgb(236, 12, 87)"
                context.stroke()
            },
            submittag: function(){
                var vm =this
                var content = vm.content
                // console.log(content)
                if (content) {
                    if(content == '2'){
                        var real_line = []
                        // console.log(vm.lines)
                        if(vm.flag == 0){
                            for(var i in vm.lines){
                            // console.log(i)
                            var j = Math.round(vm.lines[i]/2)
                            real_line.push(j)
                            // console.log(real_line)
                            }
                        } else {
                            for(var i in vm.lines){
                            // console.log(i)
                            var j = Math.round(vm.lines[i])
                            real_line.push(j)
                            // console.log(real_line)
                            }
                        }
                        if(real_line.length%2 ==1){
                            alert('标记线数目为奇数，请重新校验')
                        } else if(real_line.length ==0){
                            alert('标记线为空，请重新校验')
                        } else {
                            var info = {
                            'lines': real_line,
                            'name': vm.basic_info[vm.target].name,
                            'content': content
                            }
                            var obj = JSON.stringify(info);
                            $.ajax({
                                type: 'post',
                                url: "/mark/addmark",
                                data: obj,
                                contentType: "application/json",
                                dataType: "json",
                                success: function (data) {
                                    if (data.status == 200) {
                                        vm.nextpic()
                                    }
                                },
                                error: function (jqXHR) {
                                    alert(JSON.stringify(jqXHR))
                                }
                            });
                        }

                    }
                    else if (content == '0' || content == '1'){
                        if(vm.lines.length>0){
                            alert('此类别不应出现标签，请重新检查')
                        } else{
                            var info = {
                            'lines': [],
                            'name': vm.basic_info[vm.target].name,
                            'content': content
                            }
                            var obj = JSON.stringify(info);
                            $.ajax({
                                type: 'post',
                                url: "/mark/addmark",
                                data: obj,
                                contentType: "application/json",
                                dataType: "json",
                                success: function (data) {
                                    if (data.status == 200) {
                                        vm.nextpic()
                                    }
                                },
                                error: function (jqXHR) {
                                    alert(JSON.stringify(jqXHR))
                                }
                            });
                        }
                    } else {
                        alert('条目类别不存在，请重新检查')
                    }
                    }
                else{
                    alert('条目信息为空，请重新检查')
                }
            },
            removetag: function(e){
                this.lines = [];
                this.content = '';
                this.showcanvas(0);
                this.showinfo();
                // console.log(this.target, this.basic_info[this.target].name)
            },
            lastpic: function(){
                var vm = this;
                vm.content = '';
                vm.lines = [];
                if(vm.target >0) {
                    vm.target = vm.target -1;
                    // console.log(vm.target, vm.basic_info[vm.target].name)
                    vm.showcanvas(1);
                }

            },
            nextpic: function(){
                var vm = this
                vm.content = '';
                vm.lines = []
                if(vm.target <vm.basic_info.length-1) {
                    vm.target = vm.target +1
                    // console.log(vm.target, vm.basic_info[vm.target].name)
                    vm.showcanvas(1)
                } else {
                    alert('已经到最后一张了')
                }

            },
            backtag: function() {
                vm = this
                // lines = this.lines
                vm.lines.pop()
                // console.log(this.lines)
                vm.showcanvas(0)
            },
            fetchinfo: function(name) {
                var vm =this;
                // console.log(name)
                var info = JSON.stringify({'name': name})
                $.ajax({
                    type: 'post',
                    url: "/mark/confirm",
                    data: info,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        if (data.status == 200) {
                            if(data.info.lines) {
                                var real_line = []
                                if(vm.flag == 0){
                                    for (var i in data.info.lines) {
                                        // console.log(data.info.lines)
                                        var j = (data.info.lines[i] * 2)
                                        real_line.push(j)
                                        // console.log(real_line)
                                    }
                                } else {
                                    for (var i in data.info.lines) {
                                        // console.log(data.info.lines)
                                        var j = (data.info.lines[i])
                                        real_line.push(j)
                                        // console.log(real_line)
                                    }
                                }

                                vm.lines = real_line
                            }
                            if(data.info){
                                vm.content = data.info.content
                                // console.log(vm.lines)
                            }
                            vm.drawlines(vm.lines)
                            vm.drawbuttom(vm.lines)
                            vm.drawtext(vm.lines)
                            vm.showinfo()
                        }
                    },
                    error: function (jqXHR) {
                        alert(JSON.stringify(jqXHR))
                    }
                });
            },
            showinfo: function() {
                document.getElementById('input_content').value = this.content;

            },
            setenglish: function(){
                this.content = '1'
                this.showinfo()
            },
            setnormal: function(){
                this.content = '2'
                this.showinfo()
            },
            seterr: function(){
                this.content = '0'
                this.showinfo()
            },
            reviewtag: function(){
                var vm =this
                vm.drawlines(vm.lines)
                vm.drawbuttom(vm.lines)
                vm.drawtext(vm.lines)
                vm.showinfo()
            },
            showname: function(name){
                document.getElementById('showname').innerHTML = '当前图片名字：' + name
            }

        }
    })