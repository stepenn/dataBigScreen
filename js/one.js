 /**
 * Created by jljsj on 15/5/8.
 */
var jQuery = jQuery || {}, TweenMax = TweenMax || {};
(function ($, T) {
    var oneFunc = {
        c_w: 1920,
        c_h: 1080,
        w: 0,
        h: 0,
        scale: 1,
        init: function () {
            var self = this;

            self.main = $(".main");
            self.map = $("#map");
            self.title = $("#title");
            self.rigBox = $("#rigBox");
            self.sum =$(".sum");
            //console.log(self.sum);
            self.ajaxData(totalJsonUrl + "?r=" + Math.random(), function (data) {
                console.log(data);
                var numbStr1 = self.translatedNumber(data[0].number);
                var numbStr2 = self.translatedNumber(data[1].numberSecond);
                $('<p>'+ data[0].customer +'<span id="Num">'+parseInt(numbStr1[0])+'</span>'+numbStr1[1]+'人</p>' +
                '<i>'+ data[1].amount +'<span>'+parseInt(numbStr2[0])+'</span>'+numbStr2[1]+'元</i>').appendTo(self.sum);
            });
            self.ajaxData(rightJsonUrl + "?r=" + Math.random(), function (data) {
                self.data = data;
            },function (jqXHR, textStatus, errorThrown){
                //alert(jqXHR+";"+textStatus+";"+errorThrown);
                //如果加载不了再放一下前面这遍
                    alert("one 31 没有数据");
            });
            self.rigBoxFunc.init();
            self.mapBoxFunc.init();
            self.windowResize();
            $(window).bind("resize", self.windowResize);
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
        windowResize: function (e) {
            var self = oneFunc;
            self.w = $(window).width();
            self.h = $(window).height();
            self.scale = self.w / self.c_w > self.h / self.c_h ? self.h / self.c_h : self.w / self.c_w;
            self.title.css("transform", "scale(" + self.scale + ")");
            self.rigBox.css("transform", "scale(" + self.scale + ")");
            var mtop = (self.h - self.map.height() * self.scale) / 2;
            mtop = mtop > 50 ? mtop : "11%";
            self.map.css({"top": mtop, "transform": "scale(" + self.scale +")"});
        },
        translatedNumber:function (num){
            var str=""
            if(num>=100000000){
                num=Number(num)/100000000
                str="亿"
            }
            else if(num>=10000){
                num=Number(num)/10000
                str="万"
            }
            return [Math.round(Number(num)),str]
        },
        rigBoxFunc:{
            parent:null,
            interNUm:5,
            count:-1,
            countMax:0,
            init:function (){
                var self=this;
                self.parent=oneFunc;
                //self.loadData();

                setInterval(function (){
                    var d=new Date();
                    if(d.getHours()==12){
                        self.loadData()
                    }
                },3600000);
                //setInterval(self.loadData, 5230);

            },

            tweenDataFirst:function (html,data,delay){
                var self=this;
                delay=delay?delay:0;
                html.startObj = {number: Number(html.attr("data-number").replace(/[亿,万]/g,"")), money: Number(html.attr("data-money").replace(/[亿,万]/g,""))};

                html.tweenToObj = {
                    name: data.name,
                    number: Number(data.number),
                    money: Number(data.money)
                };
                T.to(html.startObj, 0.5, {
                    delay: delay,
                    number: html.tweenToObj.number,
                    money: html.tweenToObj.money,
                    onUpdate: function (){
                        var n=self.parent.translatedNumber(html.startObj.number);
                        var m=self.parent.translatedNumber(html.startObj.money);
                        html.find("#number").text(Number(n[0])+n[1]);
                        html.find("#money").text(Number(m[0]) + m[1]);
                    },
                    onComplete:function (){
                        html.attr("data-number",data.number);
                        html.attr("data-money",data.money)
                    }
                })
            },
            tweenData:function (html,data,delay){
                var self=this;
                delay=delay?delay:0;
                html.startObj = {number: Number(html.attr("data-number").replace(/[亿,万]/g,"")), money: Number(html.attr("data-money").replace(/[亿,万]/g,""))};

                html.tweenToObj = {
                    name: data.name,
                    number: Number(data.money),
                    money: Number(data.money)
                };
                T.to(html.startObj, 0.5, {
                    delay: delay,
                    number: html.tweenToObj.money,
                    money: html.tweenToObj.money,
                    onUpdate: function (){
                        var n=self.parent.translatedNumber(html.startObj.money);
                        var m=self.parent.translatedNumber(html.startObj.money);
                        html.find("#number").text(Number(n[0])+n[1]);
                        html.find("#money").text(Number(m[0]) + m[1]);
                    },
                    onComplete:function (){
                        html.attr("data-number",data.money);
                        html.attr("data-money",data.money)
                    }
                })
            },
            getHtml:function (name, str){
                return "<li data-name='" + name + "' data-number='0' data-money='0'>" + name +
                    "<span class='t-rig'>" +
                    "<p class='red-data-text txt' id='number'>0</p>" +
                    "<p>"+str+"</p>" +
                    "</span>"+
                    "</li>";
            },
            loadData:function () {
                var self=oneFunc.rigBoxFunc;
                self.count++;
                if(oneFunc.data){
                    self.countMax = oneFunc.data.length;
                    var realdataFirst=oneFunc.data[self.count].city;
                    self.startFirst(realdataFirst);
                    self.rigJsonDataFisrt = realdataFirst;
                    var realdata=oneFunc.data[self.count].city;
                    self.start(realdata);
                    self.rigJsonData = realdata;
                }else{
                    alert("没有数据163");
                }
                //console.log(self.count);
                /*if(self.count == self.countMax)
                {self.count = 0;}*/
                setTimeout(oneFunc.rigBoxFunc.CloadData,5000);
            },
            start:function (data){
                var self=this;
                var title=self.parent.rigBox.find("h3").eq(1);
                title.html("top5市累放金额");
                var dom = self.parent.rigBox.find(".content ul");
                dom.find('li').remove();
                $("#rigBox").css("display","none");
                if (1) {
                    //没有数据时插入dom;
                    for (var i = 0; i < data.length&&i<5; i++) {
                        if(data[i].name2!=""){
                            var html = $(self.getHtml(data[i].name2, "元")).appendTo(dom);
                            self.tweenData(html,data[i],i*0.1);
                        }

                    }
                }
                if(dom.find('li')){
                    $("#rigBox").css("display","block");
                }
            },
            startFirst:function (data){
				//alert(this);
                var self=this;
                var title=self.parent.rigBox.find("h3").eq(0);
                title.html("top5市贷款客户数");
                var dom = self.parent.rigBox.find(".contentFirst ul");
                dom.find('li').remove();
                $("#rigBox").css("display","none");
                if (1) {
                    //没有数据时插入dom;
                    for (var i = 0; i < data.length; i++) {
                        if(data[i].name!==""){
                            var html = $(self.getHtml(data[i].name, '人')).appendTo(dom);
                            self.tweenDataFirst(html,data[i],i*0.1);
                        }
                    }
                }
                if(dom.find('li')){
                    $("#rigBox").css("display","block");
                }
            },
            CloadData:function () {
                var self=oneFunc.rigBoxFunc;
                
                if(oneFunc.data){
                    self.countMax = oneFunc.data.length;
                    var realdataFirst=oneFunc.data[self.count].county;
                    self.CstartFirst(realdataFirst);
                    self.rigJsonDataFisrt = realdataFirst;
                    var realdata=oneFunc.data[self.count].county;
                    self.Cstart(realdata);
                    self.rigJsonData = realdata;
                }else{
                    alert("没有数据229");
                }
                if(self.count  == self.countMax - 1)
                {self.count = -1;}
                //console.log(self.count)
            },
            Cstart:function (data){
                var self=this;
                var title=self.parent.rigBox.find("h3").eq(1);
                title.html("top5县累放金额");
                var dom = self.parent.rigBox.find(".content ul");
                dom.find('li').remove();
                $("#rigBox").css("display","none");
                if (1) {
                    //没有数据时插入dom;
                    for (var i = 0; i < data.length&&i<5; i++) {
                        if(data[i].name2!=""){
                            var html = $(self.getHtml(data[i].name2, "元")).appendTo(dom);
                            self.tweenData(html,data[i],i*0.1);
                        }
                    }
                }
                //console.log(dom.find('li'));
                if(dom.find('li')){
                    $("#rigBox").css("display","block");
                }
            },
            CstartFirst:function (data){
                //alert(this);
                var self=this;
                var title=self.parent.rigBox.find("h3").eq(0);
                title.html("top5县贷款客户数");

                var dom = self.parent.rigBox.find(".contentFirst ul");
                dom.find('li').remove();
                $("#rigBox").css("display","none");
                if (1) {
                    //没有数据时插入dom;
                    for (var i = 0; i < data.length; i++) {
                        if(data[i].name!=""){
                            var html = $(self.getHtml(data[i].name, '人')).appendTo(dom);
                            self.tweenDataFirst(html,data[i],i*0.1);
                        }
                    }
                }
                if(dom.find('li')){
                    $("#rigBox").css("display","block");
                }
            }
        },
        mapBoxFunc:{
            mapXY:{
                "北京":{x:855,y:355,url:"images/city/beijing.png"},
                "上海":{x:990,y:570,url:"images/city/shanghai.png"},
                "天津":{x:875,y:370,url:"images/city/tianjing.png"},
                "重庆":{x:690,y:625,url:"images/city/chongqin.png"},
                "浙江":{x:960,y:620,url:"images/city/zhejiang.png"},
                "江苏":{x:950,y:555,url:"images/city/jiangsu.png"},
                "安徽":{x:895,y:575,url:"images/city/anhui.png"},
                "福建":{x:940,y:720,url:"images/city/fujian.png"},
                "黑龙江":{x:1020,y:145,url:"images/city/heilongjiang.png"},
                "吉林":{x:1000,y:230,url:"images/city/jilin.png"},
                "辽宁":{x:970,y:310,url:"images/city/liaoning.png"},
                "河北":{x:825,y:405,url:"images/city/hebei.png"},
                "河南":{x:810,y:510,url:"images/city/henan.png"},
                "湖北":{x:818,y:608,url:"images/city/hubei.png"},
                "湖南":{x:800,y:670,url:"images/city/hunan.png"},
                "广东":{x:825,y:795,url:"images/city/guangdong.png"},
                "广西":{x:700,y:815,url:"images/city/guangxi.png"},
                "山西":{x:770,y:420,url:"images/city/shanx.png"},
                "山东":{x:880,y:440,url:"images/city/shandong.png"},
                "陕西":{x:710,y:525,url:"images/city/shanxi.png"},
                "宁夏":{x:650,y:430,url:"images/city/ningxia.png"},
                "甘肃":{x:600,y:485,url:"images/city/gansu.png"},
                "内蒙":{x:730,y:345,url:"images/city/neimenggu.png"},
                "海南":{x:745,y:907,url:"images/city/hainan.png"},
                "江西":{x:870,y:660,url:"images/city/jiangxi.png"},
                "四川":{x:595,y:615,url:"images/city/sichuan.png"},
                "云南":{x:560,y:770,url:"images/city/yunnan.png"},
                "贵州":{x:665,y:720,url:"images/city/shanxi.png"},
                "青海":{x:495,y:470,url:"images/city/qinghai.png"},
                "西藏":{x:345,y:615,url:"images/city/xizang.png"},
                "新疆":{x:265,y:275,url:"images/city/xinjiang.png"},
                "台湾":{x:1000,y:770,url:"images/city/taiwan.png"},
                "香港":{x:840,y:820,url:"images/city/Hongkong.png"},
                "澳门":{x:826,y:826,url:"images/city/Hongkong.png"}
            },
            icon_offset:{x:15,y:58},
            parent:null,
            interNum:10,
            num:0,
            init:function (){
                var self=this;
                self.parent=oneFunc;
                self.icon=$("#mapIcon");
                self.loadData();
                setInterval(function (){
                    var d=new Date();
                    if(d.getHours()==12){
                        self.loadData()
                    }
                },3600000);
            },
            loadData:function (){
                var self= this;
                self.parent.ajaxData(rightJsonUrl+"?r="+Math.random(),function (data){
					//alert(JSON.stringify(data));
                    self.tipData=data;
                    self.start()
                },function (jqXHR, textStatus, errorThrown){
                    //如果加载不了再放一下前面这遍
                    if(self.tipData)
                        self.start();
                    else
                        alert("one 303 没有数据");
                })
            },			
            start:function(){
                var self=this,
                    data=self.tipData[self.num];
                self.tipBox=self.tipBoxHtml(data).appendTo(self.parent.map);
                var name=data.name;
                for(var n in self.mapXY){
                    if(name.indexOf(n)>=0){
                        name=n;
                    }
                }
                if(!name){
                    self.endTweenTipBox();
                    return
                }
                var map_w=1160,map_h=960;
                var offset={x:self.mapXY[name].x-self.icon_offset.x,y:self.mapXY[name].y-self.icon_offset.y};
                self.icon.css({"left":offset.x,"top":offset.y});
                var colorArr=["#ffab3d","#fb6b75","#87ab66"];
                self.icon.find("path").attr("fill",colorArr[Math.floor(Math.random()*3)]);
                //var peaked={x:self.mapXY[name].x/map_w*self.tipBox.width(),y:self.mapXY[name].y/map_h*self.tipBox.height()};
                var peaked={},colorRgba="rgba(0,0,0,.8)",_class="";
                if(offset.x<self.tipBox.width()+80){
                    peaked.x=offset.x-45;
                    peaked.left="left";
                }else if(offset.x>map_w-self.tipBox.width()+85){
                    peaked.left="right";
                    peaked.x=offset.x-self.tipBox.width()+85
                }else{
                    peaked.x=offset.x-self.tipBox.width()/2+self.icon.width()/2
                }
                if(offset.y<self.tipBox.height()+25){
                    peaked.top=true;
                    peaked.y=offset.y+self.icon.height()+5;
                }else{
                    peaked.y=offset.y-self.tipBox.height()-25;
                }
                self.tipBox.css({"left":peaked.x,"top":peaked.y});
                var centent={"transform-origin-x":"50%","transform-origin-y":"100%"};
				if(data.url){
					centent["background-image"]="url('"+data.url+"')";
				}
                if(self.mapXY[name].url){
                    centent["background-image"]="url('"+self.mapXY[name].url+"')";
                }
                if(peaked.top){
                    colorRgba="rgba(220,100,100,.8)";
                    centent["transform-origin-y"]="0"
                }else{
                    centent["transform-origin-y"]="100%"
                }
                var t_class=peaked.top?"border-bottom: 20px solid "+colorRgba:"border-top: 20px solid "+colorRgba;
                if(peaked.left=="left"){
                    t_class+=";left:50px";
                    _class+="fn-left";
                    centent["transform-origin-x"]="65px"
                }else if(peaked.left=="right"){
                    t_class+=";right:50px";
                    _class+="fn-right";
                    centent["transform-origin-x"]=self.tipBox.width()-65+"px"
                }else{
                    t_class+=";margin:auto"
                }
                var triangle=peaked.top?$("<em class='triang "+_class+"' style='"+t_class+"'></em>").prependTo(self.tipBox):$("<em class='triang "+_class+"' style='"+t_class+"'></em>").appendTo(self.tipBox);
                self.tipBox.css(centent);
                //setTimeout(oneFunc.rigBoxFunc.loadData,5000);
                oneFunc.rigBoxFunc.loadData();
                T.to(self.icon.find("g"),.3,{startAt:{"transform-origin":"50% 100%","transform":"scale(0,0)"},scale:1,ease:Back.easeOut});
                T.from(self.tipBox,.3,{delay:.3,scale:0,yoyo:true,repeat:1,repeatDelay:self.interNum-1,ease:Back.easeOut,onComplete:self.onComplete})
            },
            endTweenTipBox:function (){
                var self=oneFunc.mapBoxFunc;
                self.tipBox.remove();
                self.num++;
                if(self.num>=self.tipData.length){
                    self.num=0;
                    self.loadData()
                }else{
                    self.start()
                }
            },
            onComplete:function (){
                var self=oneFunc.mapBoxFunc;
                T.to(self.icon.find("g"),.3,{scale:0,ease:Back.easeIn,onComplete:self.endTweenTipBox});
            },
            tipBoxHtml:function (data){
                var title=data.name,json=data.data;
                var tipBox=$("<div id='tipBox'><h3>"+title+"</h3><div class='content'><ul></ul></div></div>");
				
                for(var i=0;i<json.length;i++){
                    var tarr=this.parent.translatedNumber(json[i].parame);
                    var parame=Number(tarr[0]);
                    if(!parame){
                        continue;
                    }
                    if(!tarr[1]){
                        parame=parame.toFixed(0)
                    }
                    var list=$("<li>"+json[i].name+"<span class='fn-right'><p class='red-data-text txt'>"+parame+"</p><p>"+tarr[1]+json[i].unit+"</p></span></li>").appendTo(tipBox.find(".content ul"));
                }
                return tipBox;
            }
        }
    };
    $().ready(function () {
        oneFunc.init();
    })
})(jQuery, TweenMax);