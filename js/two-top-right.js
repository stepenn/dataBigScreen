/**
 * Created by jljsj on 15/5/12.
 */
var jQuery = jQuery || {}, TweenMax = TweenMax || {};
(function ($, T) {
    var columnFun={
        c_w: 1920,
        c_h: 1080,
        num:0,
        init:function (){
            var self=this;
            //console.log(self.num);
            self.listBox=$(".list-box").eq(self.num);
            //console.log(self.listBox);
            self.columnStyle=self.listBox.find(".column-style");
            self.columnBox=self.listBox.find('#column');
            self.column=self.listBox.find(".column-box");
            self.columnCirc=self.listBox.find(".column-circ");
            self.columnDate=self.listBox.find(".column-date");
            self.leftS = self.listBox.find(".left-standard");
            self.rightS = self.listBox.find(".right-standard");
            self.title = self.listBox.find("#title span");
            self.loadData();
            self.loadSumData();
            //setInterval(function (){
            //    var d=new Date();
            //    if(d.getHours()==8){
            //        self.loadData()
            //    }
            //},3600000);
            //self.loadData1();
        },
        ajaxData: function (str, call,errorcall) {
            $.ajax({
                url: str,
                datatype:"json",
                type: "GET",
                success: call,
                error:errorcall
            })
        },
        loadData:function (){
            var self=columnFun;
            self.ajaxData(jsonUrl + "?r=000" + Math.random(), function (data) {
                self.jsonData=data;
                data=eval(data);
                self.title.html(data[self.num].title);
                self.num = 0;
                self.start(self.jsonData);
            },function (jqXHR, textStatus, errorThrown){
                //console.log(self.jsonData+"++");
                if(self.jsonData)
                    self.start(self.jsonData);
                else
                    alert("没有数据");
            });

        },
        loadSumData:function(){
            var self=columnFun;
            self.ajaxData(jsonUrla + "?r=" + Math.random(), function (data) {
                self.leftJsonData=data;
                var m=$("#farmer");
                self.addSum(m);
                var m=$("#students");
                self.addSum(m);
            },function (jqXHR, textStatus, errorThrown){
                self.leftJsonData=JSON.parse(jqXHR.responseText);
                if(self.leftJsonData){
                    var m=$("#farmer");
                    self.addSum(m);
                    var m=$("#students");
                    self.addSum(m);
                }

                else
                    alert("没有数据");
            });
        },
        addSum: function (m) {
            var self=this;
            var sumData = self.leftJsonData[m.attr("id")];
            for(var i=0;i< sumData.length;i++){
                m.find(".sum").find("."+sumData[i].id).find("span").html(sumData[i].number);
            }
        },
        start:function (_data){
            var self=this;
            var _data=eval(_data);
            var __data=_data[self.num];
            var data=__data.data;
            if(__data.bluetext) self.columnStyle.find("li").eq(0).find("span").text(__data.bluetext);
            if(__data.redtext) self.columnStyle.find("li").eq(1).find("span").text(__data.redtext);
            self.lenNum=data.length;
            self.allmaxNum=0;
            self.allminNum=data[0].all;
            self.f_maxNum=0;
            self.f_minNum=data[0].farmer;
            self.standard = 25;
            self.allStandard = 50;
            self.f_Standard = 20;
            for(var i=0;i<data.length;i++){
                if(Number(data[i].farmer)<self.f_minNum){
                    self.f_minNum=Number(data[i].farmer)
                }
                if(Number(data[i].all)<self.allminNum){
                    self.allminNum=Number(data[i].all)
                }
            }
            for(i=0;i<data.length;i++){
                if(Number(data[i].all)-self.allminNum>self.allmaxNum){
                    self.allmaxNum=Number(data[i].all)-self.allminNum;
                }
                if(Number(data[i].farmer)-self.f_minNum>self.f_maxNum){
                    self.f_maxNum=Number(data[i].farmer)-self.f_minNum;
                }
            }

            for(;Number(self.allminNum)+Number(self.allmaxNum)>self.allStandard*6*10000;){
                self.allStandard= Number(self.allStandard) + Number(self.standard);
                //console.log(self.allminNum+self.allmaxNum);
                //console.log(self.allStandard*6*10000);
            }
            for(;Number(self.f_minNum)+Number(self.f_maxNum)>self.f_Standard*6*10000;){
                self.f_Standard= Number(self.f_Standard) + Number(self.f_Standard);
                //console.log(self.f_minNum+self.f_maxNum);
                //console.log(self.f_Standard*6*10000);
            }
            for(var i=1;i<7;i++){
                self.leftS.find("li").eq(i).html(Number(self.allStandard)*(6-i));
                self.rightS.find("li").eq(i).html(Number(self.f_Standard)*(6-i));
            }
            if(self.column.children().length<=0){

            }
            self.column.empty();
            self.columnDate.empty();
            //self.columnCirc.empty();
            for(var i=0;i<self.lenNum;i++){
                //console.log(i);
                var mc=self.addColumn(data[i]);
                //console.log(mc);
                self.column.append(mc);
                var date=self.addDate(data[i].date);
                //console.log(data[i].date);
                self.columnDate.append(date);
                //self.addCircAndLine(data[i].farmer,i)
                if(self.columnCirc.children().length<self.lenNum*4){
                    var n=$("<div class='circ' style='opacity: 0'></div>");
                    var l=$("<div class='line' style='opacity: 0' ></div>");
                    self.columnCirc.append([n,l]);
                    var n1=$("<div class='circ1' style='opacity: 0'></div>");
                    var l1=$("<div class='line1' style='opacity: 0' ></div>");
                    self.columnCirc.append([n1,l1]);
                }
                    T.from(mc.children(),.5,{top:"100%",delay:0.2*i,yoyo:true,repeat:1,repeatDelay:10,onComplete:self.endTween,onCompleteParams:[i]})//,onUpdate:self.drawCrircAndLineY,onUpdateParams:[n,l,i]

            }
            if(self.num==0){
                //console.log("Time");
                self.InterTimer=setInterval(self.drawCrircAndLineY,3);}
            else{
                console.log("Time1");
                self.InterTimer1=setInterval(self.drawCrircAndLineY,3);}
        },
        endTween:function (i){
            var self=columnFun;
            if(i>=self.lenNum-1){

                //self.num++;
                if(self.num>=self.jsonData.length){
                    self.num=0
                }
                if(self.num==0){
                    clearInterval(self.InterTimer);
                    self.start(self.jsonData);
                }else{
                    clearInterval(self.InterTimer1);
                    self.start(self.jsonData);
                }

            }

        },
        drawCrircAndLineY:function (){
            var self=columnFun;
            for(var i=0;i<self.lenNum;i++){
                var circ=self.columnCirc.find(".circ").eq(i),line=self.columnCirc.find(".line").eq(i);
                var r_h=self.column.height()-self.column.find("div").eq(i).find(".red").position().top,
                    s=40,
                    b=self.column.width()*.99/self.lenNum,
                    w=b*i+b/2,
                    ww=i<self.lenNum-1?b*(i+1)+b/2: w,
                    rr_h=i<self.lenNum-1?self.column.height()-self.column.find("div").eq(i+1).find(".red").position().top:r_h,
                    ss=8;

                var point={x:w,y:r_h},point1={x:ww,y:rr_h};
                var xx1=point1.x-point.x,yy1=point1.y-point.y;
                var line_w=Math.pow(Math.pow(xx1,2)+Math.pow(yy1,2),.5);

                var angle=-Math.atan(yy1/xx1)/Math.PI*180;
                circ.css({"left":w-15,"bottom":r_h-s/2,opacity: 1});
                line.css({"left":w-ss/2,"bottom":r_h-ss/2,opacity: 1,"width":line_w+"px","transform":"rotate("+angle+"deg)"});
            }
            for(var j=0;j<self.lenNum;j++){
                var circ1=self.columnCirc.find(".circ1").eq(j),line1=self.columnCirc.find(".line1").eq(j);
                var r_h1=self.column.height()-self.column.find("div").eq(j).find(".blue").position().top,
                    s1=40,
                    b1=self.column.width()*.99/self.lenNum,
                    w1=b1*j+b1/2,
                    ww1=j<self.lenNum-1?b1*(j+1)+b1/2: w,
                    rr_h1=j<self.lenNum-1?self.column.height()-self.column.find("div").eq(j+1).find(".blue").position().top:r_h1,
                    ss1=8;

                var point2={x:w1,y:r_h1},point3={x:ww1,y:rr_h1};
                var xx2=point3.x-point2.x,yy2=point3.y-point2.y;
                var line_w1=Math.pow(Math.pow(xx2,2)+Math.pow(yy2,2),.5);

                var angle1=-Math.atan(yy2/xx2)/Math.PI*180;
                circ1.css({"left":w1-15,"bottom":r_h1-s1/2,opacity: 1});
                line1.css({"left":w1-ss1/2,"bottom":r_h1-ss1/2,opacity: 1,"width":line_w1+"px","transform":"rotate("+angle1+"deg)"});
            }
        },
        addDate:function (date){
            var self=this;
            var n=$("<div class='fn-left' style='position:relative;height: 100%;width:"+ (.99/self.lenNum)*100+"%;line-height:"+self.columnDate.height()+"px'>" +date+"</div>")
            return n
        },
        addColumn:function (data){
            var self=this;
            //var scale=data.farmer/data.all*100;
            /*console.log(scale);
            console.log(data.farmer/data.all);*/
            /*var h=(Number(data.all)-self.allminNum)/self.allmaxNum*80,
                r_h=(Number(data.farmer)-self.f_minNum)/self.f_maxNum*scale;*/
            //console.log(Number(data.all));
            //console.log(self.allStandard*6*10000);
            //console.log(Number(data.farmer));
            //console.log(self.f_Standard*6*10000);
            var h=Number(data.all)/(self.allStandard*6*10000)*100*.8,
                r_h=Number(data.farmer)/(self.f_Standard*6)*100*.8;
            var n=$("<div class='fn-left' style='position:relative;height: 100%;width:"+ (.99/self.lenNum)*100+"%' data-date="+data.date+">" +
                "<span class='column blue' style='bottom:"+(h-95)+"%'></span>"+
                "<span class='column red' style='bottom:"+(r_h-95)+"%'></span>"+
                "</div>");
            return n
        }
    };
    var columnFun1= {
        c_w: 1920,
        c_h: 1080,
        num: 1,
        init: function () {
            var self = this;
            //console.log(self.num);
            self.listBox = $(".list-box").eq(self.num);
            self.columnStyle = self.listBox.find(".column-style");
            self.columnBox = self.listBox.find('#column');
            self.column = self.listBox.find(".column-box");
            self.columnCirc = self.listBox.find(".column-circ");
            self.columnDate = self.listBox.find(".column-date");
            self.leftS = self.listBox.find(".left-standard");
            self.rightS = self.listBox.find(".right-standard");
            self.title = self.listBox.find("#title span");
            self.loadData();
            //setInterval(function (){
            //    var d=new Date();
            //    if(d.getHours()==8){
            //        self.loadData()
            //    }
            //},3600000);
            //self.loadData1();
        },
        ajaxData: function (str, call, errorcall) {
            $.ajax({
                url: str,
                datatype: "json",
                type: "GET",
                success: call,
                error: errorcall
            })
        },
        loadData: function () {
            var self = columnFun1;
            //console.log("jsonUrl:"+jsonUrl)
            self.ajaxData(jsonUrl + "?r=000" + Math.random(), function (data) {
                self.jsonData = data;
                var data=eval(data);
                self.title.html(data[self.num].title);
                self.start(self.jsonData);

            }, function (jqXHR, textStatus, errorThrown) {
                if (self.jsonData)
                    self.start(self.jsonData);
                else
                    alert("没有数据");
            });
        },
        start: function (_data) {
            var self = this;
            var _data = eval(_data);
            var __data = _data[self.num];

            var data = __data.data;
            //console.log(data);
            self.title.html();
            if (__data.bluetext) self.columnStyle.find("li").eq(0).find("span").text(__data.bluetext);
            if (__data.redtext) self.columnStyle.find("li").eq(1).find("span").text(__data.redtext);
            self.lenNum = data.length;
            self.allmaxNum = 0;
            self.allminNum = data[0].all;
            self.f_maxNum = 0;
            self.f_minNum = data[0].farmer;
            self.standard =10;
            self.allStandard = 10;
            self.f_Standard = 0;
            for (var i = 0; i < data.length; i++) {
                if (Number(data[i].farmer) < self.f_minNum) {
                    self.f_minNum = Number(data[i].farmer)
                }
                if (Number(data[i].all) < self.allminNum) {
                    self.allminNum = Number(data[i].all)
                }
            }
            for (i = 0; i < data.length; i++) {
                if (Number(data[i].all) - self.allminNum > self.allmaxNum) {
                    self.allmaxNum = Number(data[i].all) - self.allminNum;
                }
                if (Number(data[i].farmer) - self.f_minNum > self.f_maxNum) {
                    self.f_maxNum = Number(data[i].farmer) - self.f_minNum;
                }
            }

            for (; Number(self.allminNum) + Number(self.allmaxNum) > self.allStandard * 6 * 10000;) {
                self.allStandard = Number(self.allStandard) + Number(self.standard);
                //console.log(self.allminNum + self.allmaxNum);
                //console.log(self.allStandard * 6 * 10000);
            }
            for (; Number(self.f_minNum) + Number(self.f_maxNum) > self.f_Standard * 6 * 10000;) {
                self.f_Standard = Number(self.f_Standard) + Number(self.standard);
                //console.log(self.f_minNum + self.f_maxNum);
                //console.log(self.f_Standard * 6 * 10000);
            }
            /*            for(;self.f_minNum+self.f_maxNum>self.f_Standard*6;){
             self.f_Standard+=self.standard;
             console.log(self.f_minNum+self.f_maxNum);
             console.log(self.f_Standard*6);
             }*/
            for (var i = 1; i < 7; i++) {
                self.leftS.find("li").eq(i).html(Number(self.allStandard) * (6 - i));
                self.rightS.find("li").eq(i).html(Number(self.f_Standard) * (6 - i));
            }
            if (self.column.children().length <= 0) {

            }
            self.column.empty();
            self.columnDate.empty();
            //self.columnCirc.empty();
            for (var i = 0; i < self.lenNum; i++) {
                var mc = self.addColumn(data[i]);
                self.column.append(mc);
                var date = self.addDate(data[i].date);
                self.columnDate.append(date);
                //self.addCircAndLine(data[i].farmer,i)
                if (self.columnCirc.children().length < self.lenNum * 4) {
                    var n = $("<div class='circ' style='opacity: 0'></div>");
                    var l = $("<div class='line' style='opacity: 0' ></div>");
                    self.columnCirc.append([n, l]);
                    var n1 = $("<div class='circ1' style='opacity: 0'></div>");
                    var l1 = $("<div class='line1' style='opacity: 0' ></div>");
                    self.columnCirc.append([n1, l1]);
                }
                T.from(mc.children(), .5, {
                    top: "100%",
                    delay: 0.2 * i,
                    yoyo: true,
                    repeat: 1,
                    repeatDelay: 10,
                    onComplete: self.endTween,
                    onCompleteParams: [i]
                })
            }
            if (self.num == 0) {
                console.log("Time");
                self.InterTimer = setInterval(self.drawCrircAndLineY, 3);
            }
            else {
                //console.log("Time1");
                self.InterTimer1 = setInterval(self.drawCrircAndLineY, 3);
            }
        },
        endTween: function (i) {
            var self = columnFun1;
            if (i >= self.lenNum - 1) {
                //self.num++;
                if (self.num >= self.jsonData.length) {
                    self.num = 0
                }
                if (self.num == 0) {
                    clearInterval(self.InterTimer);
                    self.start(self.jsonData);
                } else {
                    clearInterval(self.InterTimer1);
                    self.start(self.jsonData);
                }
            }
        },
        drawCrircAndLineY: function () {
            var self = columnFun1;
            for (var i = 0; i < self.lenNum; i++) {
                var circ = self.columnCirc.find(".circ").eq(i), line = self.columnCirc.find(".line").eq(i);
                var r_h = self.column.height() - self.column.find("div").eq(i).find(".red").position().top,
                    s = 40,
                    b = self.column.width() * .99 / self.lenNum,
                    w = b * i + b / 2,
                    ww = i < self.lenNum - 1 ? b * (i + 1) + b / 2 : w,
                    rr_h = i < self.lenNum - 1 ? self.column.height() - self.column.find("div").eq(i + 1).find(".red").position().top : r_h,
                    ss = 8;

                var point = {x: w, y: r_h}, point1 = {x: ww, y: rr_h};
                var xx1 = point1.x - point.x, yy1 = point1.y - point.y;
                var line_w = Math.pow(Math.pow(xx1, 2) + Math.pow(yy1, 2), .5);

                var angle = -Math.atan(yy1 / xx1) / Math.PI * 180;
                circ.css({"left": w - 15, "bottom": r_h - s / 2, opacity: 1});
                line.css({
                    "left": w - ss / 2,
                    "bottom": r_h - ss / 2,
                    opacity: 1,
                    "width": line_w + "px",
                    "transform": "rotate(" + angle + "deg)"
                });
            }
            for (var j = 0; j < self.lenNum; j++) {
                var circ1 = self.columnCirc.find(".circ1").eq(j), line1 = self.columnCirc.find(".line1").eq(j);
                var r_h1 = self.column.height() - self.column.find("div").eq(j).find(".blue").position().top,
                    s1 = 40,
                    b1 = self.column.width() * .99 / self.lenNum,
                    w1 = b1 * j + b1 / 2,
                    ww1 = j < self.lenNum - 1 ? b1 * (j + 1) + b1 / 2 : w,
                    rr_h1 = j < self.lenNum - 1 ? self.column.height() - self.column.find("div").eq(j + 1).find(".blue").position().top : r_h1,
                    ss1 = 8;

                var point2 = {x: w1, y: r_h1}, point3 = {x: ww1, y: rr_h1};
                var xx2 = point3.x - point2.x, yy2 = point3.y - point2.y;
                var line_w1 = Math.pow(Math.pow(xx2, 2) + Math.pow(yy2, 2), .5);

                var angle1 = -Math.atan(yy2 / xx2) / Math.PI * 180;
                circ1.css({"left": w1 - 15, "bottom": r_h1 - s1 / 2, opacity: 1});
                line1.css({
                    "left": w1 - ss1 / 2,
                    "bottom": r_h1 - ss1 / 2,
                    opacity: 1,
                    "width": line_w1 + "px",
                    "transform": "rotate(" + angle1 + "deg)"
                });
            }
        },
        addDate: function (date) {
            var self = this;
            var n = $("<div class='fn-left' style='position:relative;height: 100%;width:" + (.99 / self.lenNum) * 100 + "%;line-height:" + self.columnDate.height() + "px'>" + date + "</div>")
            return n
        },
        addColumn: function (data) {
            var self = this;
            var h = Number(data.all) / (self.allStandard * 6 * 10000) *100 * .8,
                r_h = Number(data.farmer) / (self.f_Standard * 6 ) * 100 *.8;
            var n = $("<div class='fn-left' style='position:relative;height: 100%;width:" + (.99 / self.lenNum) * 100 + "%' data-date=" + data.date + ">" +
                "<span class='column blue' style='bottom:" + (h - 95) + "%'></span>" +
                "<span class='column red' style='bottom:" + (r_h - 95) + "%'></span>" +
                "</div>");
            return n
        }
    };
    $().ready(function (){
        columnFun.init();
        columnFun1.init();
    })
})(jQuery, TweenMax);