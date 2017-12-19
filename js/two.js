/**
 * Created by wb-shenpan on 2015/12/9.
 */
/**
 * Created by jljsj on 15/5/15.
 */
var jQuery = jQuery || {}, TweenMax = TweenMax || {};
(function ($, T) {
    var towFun={
        init:function (){
            this.main=$(".main");
            this.loadData();
            var self=this;
            setInterval(function (){
                var d=new Date();
                if(d.getHours()==8){
                    self.loadData()
                }
            },360000);

        },
        ajaxData: function (str, call,errorcall) {
            $.ajax({
                url: str,
                dataType:"json",
                type: "GET",
                success: call,
                error:errorcall
            })
        },
        loadData:function (){
            var self=towFun;
            self.ajaxData(jsonUrly + "?r=" + Math.random(), function (data) {
                self.jsonData=data;
                self.loadTopData();

            },function (jqXHR, textStatus, errorThrown){

                if(self.jsonData)
                    self.loadTopData();
                else
                    alert("没有数据");
            });
        },
        loadTopData:function(){
            var self=towFun;
            self.ajaxData(leftJsonUrl + "?r=" + Math.random(), function (data) {
                self.leftJsonData=data;
                self.start();
            },function (jqXHR, textStatus, errorThrown){

                if(self.jsonData)
                    self.start();
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

        start:function (){
            var self=this;
            if(!self.main.children().length){
                    var m=$("#farmer").attr("id",domData[0].id);
                    console.log(domData[0].id)
                    m.find("#img").attr("src",domData[0].img);
                    self.addSum(m);
                    m.find("#title span").text(domData[0].title);
                    self.addImgBg.init(m);

                    var n=$("#students").attr("id",domData[1].id);
                    n.find("#img").attr("src",domData[1].img);
                    self.addSum(n);
                    n.find("#title span").text(domData[1].title);
                    self.addImgBg.init(n);
            }else{
                /*for(var i=0;i<domData.length;i++){
                 var m=$("#"+domData[i].id);
                 self.addImgBg.init(m);
                 }*/
            }
            self.main.find("em").removeClass("tween3d");
            clearInterval(self.setInter);
            self.setInter=setInterval(self.imgTween,5000);
        },
        imgTween:function (){
            var self=towFun;
            var len=self.main.find("em").length,
                num=Math.round(Math.random()*len);
            self.main.find("em").eq(num).addClass("tween3d");
            setInterval(function (){
                self.main.find("em").eq(num).removeClass("tween3d");
            },2500)
        },
        addBarBg:{
            parent:null,
            init:function(m){
                var self=this;
                self.parent=towFun;
                self.mc=m;
                self.id=self.mc.attr("id");
                self.data=self.parent.lineJsonData[self.id];
                self.addBar();
            },
            addBar:function(){
                var self=this;
            }
        },
        addImgBg:{
            parent:null,
            iconData:{
                "3C数码":"&#xe621;",
                "书籍音像":"&#xe604;",
                "其他行业":"&#xe620;",
                "家居":"&#xe614;",
                "家装家饰":"&#xe60a;",
                "服装":"&#xe607;",
                "母婴":"&#xe61e;",
                "汽车配件":"&#xe613;",
                "游戏/话费":"&#xe618;",
                "玩乐/收藏":"&#xe602;",
                "珠宝/配饰":"&#xe625;",
                "生活服务":"&#xe623;",
                "美容护理":"&#xe619;",
                "行业服务市场":"&#xe61c;",
                "运动/户外":"&#xe61d;",
                "食品/保健":"&#xe61b;",
                "电器":"&#xe606;",
                "农业":"&#xe61a;",
                "加工":"&#xe611;",
                "商务服务":"&#xe624;",
                "化工":"&#xe626;",
                "安全、防护":"&#xe622;",

                "鞋/箱包":"&#xe603;",
                "建材":"&#xe605;",
                "食品":"&#xe607;",
                "母婴玩具":"&#xe608;",
                "鞋/包":"&#xe609;",
                "居家":"&#xe60b;",
                "医药保键":"&#xe60c;",
                "男装":"&#xe60d;",
                "鞋":"&#xe60e;",
                "家纺":"&#xe60f;",
                "粮油副食":"&#xe610;",
                "女包":"&#xe600;",
                "女鞋":"&#xe617;",
                "沙发":"&#xe601;",
                "食品饮料":"&#xe616;",
                "生鲜水果":"&#xe615;",
                "女装内衣":"&#xe612;",

                "没有":"&#xe61f;"
            },
            init:function (m){
                var self=this;
                self.parent=towFun;
                self.mc=m;
                self.id=self.mc.attr("id");
                self.data=self.parent.jsonData[self.id];
                self.addImg();

            },
            addImg:function(){
                var self=this;
                for(var i in self.data){
                    var box=self.data[i],
                        t_mc=self.mc.find("#"+i);
                    t_mc.empty();
                    for(var j=0;j<box.length;j++){
                        //var c_mc=t_mc.find("li").eq(j);
                        var html="<li>";
                        if(box[j].url){
                            html+="<em style='background-image:url("+box[j].url+") '></em>";
                        }else if(box[j].icon){
                            var str=box[j].icon;
                            if(str=="农、林、牧、渔业"||str=="农、林、牧产品批发"){
                                str="农业"
                            }else if(str=="居民服务、修理和其他服务业"||str=="货摊、无店铺及其他零售业"){
                                str="生活服务"
                            }else if(str=="住宿和餐饮业"||str=="交通运输、仓储和邮政业"||str=="科学研究和技术服务业"||str=="文化、体育和娱乐业"){
                                str="行业服务市场"
                            }else if(str=="信息传输、软件和信息技术服务业"){
                                str="安全、防护 "
                            }else if(str=="租赁和商务服务业"){
                                str="商务服务"
                            }else if(str=="文化、体育用品及器材批发"||str=="文化、体育用品及器材专门零售"){
                                str="书籍音像"
                            }else if(str=="综合零售"){
                                str="食品/保健"
                            }else if(str=="家用电器及电子产品专门零售"){
                                str="电器"
                            }else if(str=="五金、家具及室内装饰材料专门零售"){
                                str="建材"
                            }else if(str=="汽车、摩托车、燃料及零配件专门零售"){
                                str="汽车配件"
                            }else if(str=="厨房用具及日用杂品零售"||str=="厨房、卫生间用具及日用杂货批发"||str=="其他日用品零售"||str=="其他家庭用品批发"){
                                str="家居用品"
                            }else if(str=="服装零售"||str=="鞋帽零售"||str=="箱、包零售"||str=="服装批发"||str=="鞋帽批发"){
                                str="服饰鞋包"
                            }else if(str=="纺织品及针织品零售"||str=="纺织品、针织品及原料批发"||str=="灯具、装饰物品批发"||str=="包装"||str=="电子元器件"||str=="纸业"||str=="照明工业"||str=="LED"||str=="钢铁"){
                                str="家装家饰"
                            }else if(str=="家用电器批发"){
                                str="电器"
                            }else if(str=="钟表、眼镜零售"||str=="自行车零售"||str=="化妆品及卫生用品零售"||str=="化妆品及卫生用品批发"){
                                str="居家"
                            }
                            var text=self.iconData[str]||self.iconData["没有"];
                            html+="<i class='iconfont'>"+text+"</i>" +
                                "<span>"+box[j].icon+"</span>";

                        }
                        if(box[j].name){
                            html+="<span>"+box[j].name+"</span>";
                        }
                        html+="</li>";
                        t_mc.append(html);
                    }
                }
            }
        }
    };
    var columnFun={
        c_w: 1920,
        c_h: 1080,
        num:0,
        init:function (){
            var self=this;
            self.listTitle=$(".list-title").eq(self.num*2+1);
            //console.log(self.listTitle);
            self.listBox=self.listTitle.parent();
            self.columnStyle=self.listBox.find(".colum-style");
            self.columnBox=self.listBox.find('#colum');
            self.column=self.listBox.find(".colum-box");
            self.columnCirc=self.listBox.find(".colum-circ");
            self.columnDate=self.listBox.find(".colum-date");
            self.leftS = self.listBox.find(".left-standard");
            self.rightS = self.listBox.find(".right-standard");
            self.title = self.listBox.find("#title span");
            self.loadData();
            setInterval(function (){
                var d=new Date();
                if(d.getHours()==12){
                    self.loadData()
                }
            },3600000);
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
            //console.log("jsonUrl:"+jsonUrl)
            self.ajaxData(jsonBottomUrl + "?r=000" + Math.random(), function (data) {

                self.jsonData=data;
                data=eval(data);
                //console.log(data[self.num].title);
                self.title.html(data[self.num].title);
                //console.log("json00000"+self.num);
                self.num = 0;
                self.start(self.jsonData);
                /*self.num = 1;
                 console.log("json11111"+self.num);
                 self.start(self.jsonData);*/

            },function (jqXHR, textStatus, errorThrown){
                console.log(self.jsonData+"++");
                if(self.jsonData)
                    self.start(self.jsonData);
                else
                    alert("没有数据");
            });
            /*            self.ajaxData(jsonUrl + "?r=111" + Math.random(), function (data) {
             self.jsonData=data;
             self.num = 1;
             console.log("json11111"+self.num);
             self.start(self.jsonData);
             },function (jqXHR, textStatus, errorThrown){
             console.log(self.jsonData+"++");
             if(self.jsonData)
             self.start(self.jsonData);
             else
             alert("没有数据");
             });*/
        },
        start:function (_data){
            var self=this;
            var _data=eval(_data);
            var __data=_data[self.num];
            //console.log("__data"+self.num);
            var data=__data.data;
            if(__data.bluetext) self.columnStyle.find("li").eq(0).find("span").text(__data.bluetext);
            if(__data.redtext) self.columnStyle.find("li").eq(1).find("span").text(__data.redtext);
            self.lenNum=data.length;
            self.allmaxNum=0;
            self.allminNum=data[0].all;
            self.f_maxNum=0;
            self.f_minNum=data[0].farmer;
            self.standard = 500;
            self.allStandard = 1000;
            self.f_Standard = 500;
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
                self.f_Standard= Number(self.f_Standard) + Number(self.standard);
                //console.log(self.f_minNum+self.f_maxNum);
                //console.log(self.f_Standard*6*10000);
            }
            /*            for(;self.f_minNum+self.f_maxNum>self.f_Standard*6;){
             self.f_Standard+=self.standard;
             console.log(self.f_minNum+self.f_maxNum);
             console.log(self.f_Standard*6);
             }*/
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
                    var n=$("<div class='cir' style='opacity: 0'></div>");
                    var l=$("<div class='lin' style='opacity: 0' ></div>");
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
                //console.log("Time1");
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
                var circ=self.columnCirc.find(".cir").eq(i),line=self.columnCirc.find(".lin").eq(i);
                var r_h=self.column.height()-self.column.find("div").eq(i).find(".re").position().top,
                    s=40,
                    b=self.column.width()*.99/self.lenNum,
                    w=b*i+b/2,
                    ww=i<self.lenNum-1?b*(i+1)+b/2: w,
                    rr_h=i<self.lenNum-1?self.column.height()-self.column.find("div").eq(i+1).find(".re").position().top:r_h,
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
                var r_h1=self.column.height()-self.column.find("div").eq(j).find(".blu").position().top,
                    s1=40,
                    b1=self.column.width()*.99/self.lenNum,
                    w1=b1*j+b1/2,
                    ww1=j<self.lenNum-1?b1*(j+1)+b1/2: w,
                    rr_h1=j<self.lenNum-1?self.column.height()-self.column.find("div").eq(j+1).find(".blu").position().top:r_h1,
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
            var n=$("<div class='fn-left' style='position:relative;height: 100%;width:"+ (.99/self.lenNum)*100+"%;line-height:"+self.columnDate.height()/1.2+"px'>" +date+"</div>")
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
            var h=Number(data.all)/(self.allStandard*6*100)*.8,
                r_h=Number(data.farmer)/(self.f_Standard*6*100)*.8;

            var n=$("<div class='fn-left' style='position:relative;height: 100%;width:"+ (.99/self.lenNum)*100+"%' data-date="+data.date+">" +
                "<span class='colum blu' style='bottom:"+(h-75)+"%'></span>"+
                "<span class='colum re' style='bottom:"+(r_h-75)+"%'></span>"+
                "</div>");
            return n
        }
    };
    var columnFun1= {
        c_w: 1920,
        c_h: 1080,
        num: 1,
        init: function () {
            var self=this;
            //console.log(self.num);
            self.listTitle=$(".list-title").eq(self.num*2+1);
            //console.log(self.listTitle);
            self.listBox=self.listTitle.parent();
            self.columnStyle = self.listBox.find(".colum-style");
            self.columnBox = self.listBox.find('#colum');
            self.column = self.listBox.find(".colum-box");
            self.columnCirc = self.listBox.find(".colum-circ");
            self.columnDate = self.listBox.find(".colum-date");
            self.leftS = self.listBox.find(".left-standard");
            self.rightS = self.listBox.find(".right-standard");
            self.title = self.listBox.find("#title span");
            self.loadData();
            setInterval(function (){
                var d=new Date();
                if(d.getHours()==12){
                    self.loadData()
                }
            },3600000);
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
            self.ajaxData(jsonBottomUrl + "?r=000" + Math.random(), function (data) {
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
            self.standard = 500;
            self.allStandard = 1000;
            self.f_Standard = 500;
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
                console.log(self.f_minNum + self.f_maxNum);
                console.log(self.f_Standard * 6 * 10000);
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
                    var n = $("<div class='cir' style='opacity: 0'></div>");
                    var l = $("<div class='lin' style='opacity: 0' ></div>");
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
                })//,onUpdate:self.drawCrircAndLineY,onUpdateParams:[n,l,i]

            }
            if (self.num == 0) {
                console.log("Time");
                self.InterTimer = setInterval(self.drawCrircAndLineY, 3);
            }
            else {
                //console.log("Time1");
                self.InterTimer1 = setInterval(self.drawCrircAndLineY, 3);
            }
            //console.log("endendendendendendendendend");
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
                var circ = self.columnCirc.find(".cir").eq(i), line = self.columnCirc.find(".lin").eq(i);
                var r_h = self.column.height() - self.column.find("div").eq(i).find(".re").position().top,
                    s = 40,
                    b = self.column.width() * .99 / self.lenNum,
                    w = b * i + b / 2,
                    ww = i < self.lenNum - 1 ? b * (i + 1) + b / 2 : w,
                    rr_h = i < self.lenNum - 1 ? self.column.height() - self.column.find("div").eq(i + 1).find(".re").position().top : r_h,
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
                var r_h1 = self.column.height() - self.column.find("div").eq(j).find(".blu").position().top,
                    s1 = 40,
                    b1 = self.column.width() * .99 / self.lenNum,
                    w1 = b1 * j + b1 / 2,
                    ww1 = j < self.lenNum - 1 ? b1 * (j + 1) + b1 / 2 : w,
                    rr_h1 = j < self.lenNum - 1 ? self.column.height() - self.column.find("div").eq(j + 1).find(".blu").position().top : r_h1,
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
            var n = $("<div class='fn-left' style='position:relative;height: 100%;width:" + (.99 / self.lenNum) * 100 + "%;line-height:" + self.columnDate.height()/1.2 + "px'>" + date + "</div>")
            return n
        },
        addColumn: function (data) {
            var self = this;
            var h = Number(data.all) / (self.allStandard * 6 * 100) * .8,
                r_h = Number(data.farmer) / (self.f_Standard * 6 * 100) * .8;

            var n = $("<div class='fn-left' style='position:relative;height: 100%;width:" + (.99 / self.lenNum) * 100 + "%' data-date=" + data.date + ">" +
                "<span class='colum blu' style='bottom:" + (h - 75) + "%'></span>" +
                "<span class='colum re' style='bottom:" + (r_h -75) + "%'></span>" +
                "</div>");
            return n
        }
    };
    function fun1(){
        columnFun.init();
        columnFun1.init();
    }
    $().ready(function () {
        towFun.init();
        fun1();

    })
})(jQuery, TweenMax);
