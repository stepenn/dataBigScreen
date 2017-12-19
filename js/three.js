/**
 * Created by jljsj on 15/5/19.
 */
var jQuery = jQuery || {}, TweenMax = TweenMax || {};
(function ($,T) {
    $S=function(typename){
        if(typename.indexOf("<")>=0){
            var node=$(typename);
            var node_m=$(document.createElementNS("http://www.w3.org/2000/svg",node[0].tagName.toLowerCase()));
            //var node_b=typename.replace(/<[^\s]*|[>,/>]*/gi,"");
            for(var i=0;i<node[0].attributes.length;i++){
                node_m.attr(node[0].attributes[i].name,node[0].attributes[i].value);
            }
            node_m.html(node.html());
            return node_m
        }
        return  $(document.createElementNS("http://www.w3.org/2000/svg",typename))
    };
    $.fn.addChild=function (m){
        this.append(m)
    };
    $.fn.drawHexagon=function(x,y,color,r,rotate){
        var m=$S("polygon").attr("fill",color),
            str="";
        for(var i=0;i<6;i++){
            var startAngle=(60*i+rotate)* Math.PI / 180;
            var cx = x + r * Math.cos(startAngle),
                cy = y + r * Math.sin(startAngle);
            str+=cx+","+cy+" ";
        }
        m.attr("points",str);
        this.addChild(m)
    };
    $.fn.drawRect=function (x,y,w,h,color,alpha){
        x=x||0,y=y||0,w=w||0,h=h||0,color=color||0,alpha=alpha||1;
        return this.addChild($S("rect").attr({"fill":color,x:x,y:y,width:w,height:h,opacity:alpha}));
    };
    $.fn.setTransform=function(x,y,scaleX,scaleY,rotation,skewX,skewY){
        x=x||0,y=y||0,scaleX=scaleX||1,scaleY=scaleY||1,rotation=rotation||0,skewX=skewX||0,skewY=skewY||0;
        var cosVal=Math.cos(rotation * Math.PI / 180)*scaleX,
            sinVal = Math.sin(rotation * Math.PI / 180)*scaleY;
        var tanValY = Math.tan(skewY * Math.PI / 180),
            tanValX = Math.tan(skewX * Math.PI / 180);
        var val="matrix("+cosVal+","+(tanValX-sinVal)+","+(sinVal+tanValY)+","+cosVal+","+x+","+y+")";
        this.attr("transform",val)
    };
    var threeFunc={
        svg:null,
        w:1280,
        h:1024,
        jsonData:null,
        startJson:{"total":0,"cred":{"retail":0,"wholesale":0},"order":{"retail":0,"wholesale":0}},
        init:function (){
            var self=this;
            self._h=(self.h-328)/2>(self.w-528)/2?(self.w-528)/2:(self.h-328)/2;
            self.svg=$S("svg").attr({width:"100%",height:"100%","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"});
            $("#svg").append(self.svg);
            self.bgIcon=$(".bg_icon");
            self.addBg();
            self.addBgCricLine();
            self.addDianXian(); 
            self.addTitleIcon(); 
            self.addDataTxt(); 
            self.startNoData(); 
            T.delayedCall(1.4,self.loadData);
            setInterval(function (){
                var d=new Date();
                if(d.getHours()==8){
                    self.loadData()
                }
            },3600000);
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
        newSprite:function (m,x,y){
            m=m||this.svg,x=x||0,y=y||0;
            var spr=$S("g");
            m.addChild(spr);
            spr.setTransform(x,y);
            return spr
        },
        addDianXian:function (){ 
            var self=this;
            self.dianXian=self.newSprite(null,self.w/2,self.h/2);

            function newCirc(){
                var circBox=$S("g"); 
                var circ1=$S("circle").attr({r:8,fill:"#eba538"});
                var circ2=$S("circle").attr({r:16,fill:"#eba538",opacity:".5"});
                circBox.addChild([circ1,circ2]);
                var tl=new TimelineMax({repeat:-1});
                tl.add(T.from(circ2,.5,{delay:Math.random(),scale:0,ease:Power1.easeIn}));
                tl.add(T.to(circ2,.5,{scale:1.5,alpha:0,ease:Power1.easeOut}));
                return circBox;
            } 
            function newLine(arr){
                var p=$S("path").attr({"stroke":"#eba538","stroke-width":2,fill: "none","stroke-dasharray":"6px,4px","stroke-dashoffset":0});
                var s="M0 0",
                    l=Math.pow((Math.pow(arr[0].x,2) + Math.pow(arr[0].y,2)), 0.5);
                for(var i=0;i<arr.length;i++){
                    s+="L"+arr[i].x+" "+arr[i].y;
                    if(i<arr.length-1){
                        l+=Math.pow((Math.pow(arr[i+1].x-arr[i].x,2) + Math.pow(arr[i+1].y-arr[i].y,2)), 0.5);
                    }

                }
                //s+="Z";
                p.attr("d",s);
                T.to(p,15,{"stroke-dashoffset":-l,repeat:-1,ease:Linear.easeNone});
                return p
            } 
            var parame=[
                {x:500,y:-450,line:[{x:0,y:120},{x:-500,y:120},{x:-500,y:290}],text:"<tspan x='135'>阿里巴巴</tspan><tspan x='0' y='40'>国内国际批发市场</tspan>",tx:-290,ty:70},
                {x:520,y:350,line:[{x:-230,y:0},{x:-230,y:-350},{x:-380,y:-350}],text:"网商服务",tx:-180,ty:-15},
                {x:-420,y:380,line:[{x:0,y:-60},{x:420,y:-60},{x:420,y:-215}],text:"国内零售市场",tx:30,ty:0},
                {x:-580,y:-350,line:[{x:280,y:0},{x:280,y:360},{x:440,y:360}],text:"蚂蚁金服金融服务",tx:10,ty:-10}
            ];
            for(var i=0;i<parame.length;i++){
                var dBox1=self.newSprite(self.dianXian);
                var d1=newCirc();
                dBox1.addChild(d1);
                dBox1.setTransform(parame[i].x,parame[i].y);
                var d1_line=newLine(parame[i].line);
                dBox1.addChild(d1_line);
                var d1_text=$S('text').attr({"fill":"#fff","font-size":"34"}).html(parame[i].text);
                dBox1.addChild(d1_text);
                d1_text.setTransform(parame[i].tx,parame[i].ty);
                T.from(dBox1,.5,{delay:1.4+i *.1,alpha:0});
            }

        },
        addDataTxt:function(){
            var self=this;
            self.dataTxtBox=self.newSprite(null,self.w/2,self.h/2);
            var title=$S("text").text("网商银行当日数据总吞吐量").attr({"font-size":22,"fill":"#fff"});
            self.dataTxtBox.addChild(title);
            title.setTransform(-title.width()/2,-65);
            var dataTxt=$S("text").text("0").attr({"font-size":60,"fill":"#fff",id:"dataTxt"});
            self.dataTxtBox.addChild(dataTxt);
            dataTxt.setTransform(-dataTxt.width()/2,5);

            //下面信用
            var w=(self._h-280)*2;
            var leftcontBox=self.newSprite(self.dataTxtBox);
            leftcontBox.setTransform(0,0);
            leftcontBox.drawRect(-(w+1),12,w,70,"#fff",.3);
            var leftTitle=$S("text").text("信用类贷款授信").attr({fill:"#fffc27","font-size":17});
            leftcontBox.addChild(leftTitle);
            leftTitle.setTransform(-(leftTitle.width()+8.5),40);

            var leftBottom=$S("text").attr({fill:"#fff","font-size":12});
            leftcontBox.addChild(leftBottom);
            leftBottom.setTransform(-110,60);
            var l_ls=$S("tspan").text("零售潜在授信").attr({x:-18});
            leftBottom.addChild(l_ls);
            var l_num=$S("tspan").text("0").attr({id:"L-retail",fill:"#fffc27","font-size":12,"font-weight":"bold"});
            leftBottom.addChild(l_num);
            l_num.attr("x",91-l_num.width());
            var l_dw=$S("tspan").text("元").attr("x",95);
            leftBottom.addChild(l_dw);
            var l_pf=$S("tspan").text("批发潜在授信").attr({x:-18,y:18});
            leftBottom.addChild(l_pf);

            var l_dw2=$S("tspan").text("元").attr({"x":95,y:18});
            leftBottom.addChild(l_dw2);
            var l_num2=$S("tspan").text("0").attr({"id":"L-wholesale",fill:"#fffc27","font-size":12,"font-weight":"bold",y:18});
            leftBottom.addChild(l_num2);
            l_num2.attr("x",91-l_num2.width());

            //订单
            var rigcontBox=self.newSprite(self.dataTxtBox);
            rigcontBox.setTransform(50,0);
            rigcontBox.drawRect(-(w-87),12,w,70,"#fff",.3);

            var rightTitle=$S("text").text("订单类贷款授信").attr({fill:"#fffc27","font-size":17});
            rigcontBox.addChild(rightTitle);
            rightTitle.setTransform(-(rightTitle.width()-76.5),40);
            var rightBottom=$S("text").attr({fill:"#fff","font-size":12});
            rigcontBox.addChild(rightBottom);
            rightBottom.setTransform(-122,60);
            var r_ls=$S("tspan").text("零售市场订单").attr({x:78,y:0});
            rightBottom.addChild(r_ls);
            var r_num=$S("tspan").text("0").attr({id:"R-retail",fill:"#fffc27","font-size":12,"font-weight":"bold"});
            rightBottom.addChild(r_num);
            r_num.attr("x",205-r_num.width());
            var r_dw=$S("tspan").text("元").attr("x",193);
            rightBottom.addChild(r_dw);
            var r_pf=$S("tspan").text("批发市场订单").attr({x:78,y:18});
            rightBottom.addChild(r_pf);
            var r_num2=$S("tspan").text("0").attr({"id":"R-wholesale",fill:"#fffc27","font-size":12,"font-weight":"bold",y:18});
            rightBottom.addChild(r_num2);
            r_num2.attr("x",205-r_num2.width());
            var r_dw2=$S("tspan").text("元").attr({"x":193,y:18});
            rightBottom.addChild(r_dw2);

            //T.set(rigcontBox,{alpha:0});
            //self.t_Bool=true;
            //setInterval(function (){
            //    if(self.t_Bool){
            //        T.to(leftcontBox,.5,{x:-50,alpha:0});
            //        T.to(rigcontBox,.5,{x:0,alpha:1});
            //        self.t_Bool=false;
            //    }else{
            //        T.to(leftcontBox,.5,{x:0,alpha:1});
            //        T.to(rigcontBox,.5,{x:50,alpha:0});
            //        self.t_Bool=true
            //    }
            //    self.bottomTxtTween(self.t_Bool)
            //},5000)
        },

        addTitleIcon:function (){
            var self=this;
            self.titleIcon=self.newSprite(null,self.w/2,self.h/2);
            var textArr=["活动<tspan x='0' y='35'>提额</tspan>","<tspan x='0' y='-15'>外部</tspan><tspan x='0' y='15'>数据</tspan><tspan x='0' y='45'>提额</tspan>","季节<tspan x='0' y='33'>提额</tspan>","基础<tspan x='0' y='35'>额度</tspan>"],
                rataArr=[-30,30,150,210];

            for(var i=0;i<4;i++){
                var icon=$S("g");
                self.titleIcon.addChild(icon);
                icon.drawHexagon(0,7,"#eb7b38",70,-90);
                var text=$S("text").html(textArr[i]).attr({"fill":"#fff","font-size":"28"})
                icon.addChild(text)
                text.setTransform(-text.width()/2);
                var cx=(self._h-100) * Math.cos(rataArr[i]*Math.PI/180),
                    cy=(self._h-100) * Math.sin(rataArr[i]*Math.PI/180);
                icon.setTransform(cx,cy)
            }

            var d=$S("defs");
            self.svg.addChild(d);
            var linear=$S("linearGradient").attr({"id":"iconColor","x1":"0%","x2":"0%","y1":"0%","y2":"100%"});
            d.addChild(linear);
            var color1=$S("stop").attr({"offset":"0%"}).css({"stop-color":"rgb(249,161,108)","stop-opacity":"1"});
            var color2=$S("stop").attr({"offset":"100%"}).css({"stop-color":"rgb(218,101,31)","stop-opacity":"1"});
            linear.addChild(color1);
            linear.addChild(color2);
            self.titleIcon.find("polygon").css("fill","url(#iconColor)");
            //icon的图片；
            self.IconBox=self.newSprite(null,self.w/2,self.h/2);
            var t_rotaArr=[-35,30,70,145,215];
            for(var i=0;i<5;i++){
                var img_icon=$("#Img").clone().attr({id:"","xlink:href":"images/3/icon"+i+".png",width:157,height:57})//$S("image").attr({"xlink:href":"images/3/icon"+i+".png",width:100,height:100});
                self.IconBox.addChild(img_icon);
                var cx=(self._h+50) * Math.cos(t_rotaArr[i]*Math.PI/180),
                    cy=(self._h+50) * Math.sin(t_rotaArr[i]*Math.PI/180);
                img_icon.setTransform(cx-80,cy-30);
                if(i==4){
                    img_icon.attr("width",181);
                    img_icon.setTransform(cx-90,cy-30)
                }
                if(i==2){
                    img_icon.setTransform(cx-90,cy-60)
                }
                T.from(img_icon,.5,{delay:1+i *0.1,alpha:0})
            }

        },
        addBgCricLine:function(){
            var self=this;
            self.bgLineBox=self.newSprite(null,self.w/2,self.h/2);
            var LineCirc=$S("circle").attr("id","bg_circ");
            LineCirc.attr({fill:"none","stroke-width":1,"stroke-dasharray":4,"stroke-dashoffset":0,stroke:"#9f9fa3",r:self._h});
            self.bgLineBox.addChild(LineCirc);
            //self.bgLineBox.addChild($S('<path id="mypath" d="M50 100Q350 50 350 250T450 250" style="fill:none;stroke:red;stroke-width:5;" />'))
            var lineTxt_h=self._h-10;
            for(var i=0;i<6;i++){
                var text=$("#c-text").clone().attr("id","text"+i)//$S("text").attr("fill","#fff").text("风控模型");
                self.bgLineBox.addChild(text);
                var r=360/6*i-90;
                var path=$S("path").attr("id","path"+i);
                var s="M"+(lineTxt_h * Math.cos((r-5)*Math.PI/180))+" "+(lineTxt_h * Math.sin((r-5)*Math.PI/180));
                s+="A"+lineTxt_h+" "+lineTxt_h+" 0 0 1 "+(lineTxt_h * Math.cos((r+5)*Math.PI/180))+" "+(lineTxt_h * Math.sin((r+5)*Math.PI/180))+" Z";
                path.attr({"d":s,"fill":"none"})
                self.bgLineBox.addChild(path);
                text.find("textPath").attr("xlink:href","#path"+i).text("风控模型");
                //var cx=lineTxt_h*Math.cos(r* Math.PI / 180);
                //var cy=lineTxt_h*Math.sin(r* Math.PI / 180);
                //text.setTransform(cx,cy,1,1,360/5*i)

            }

        },
        addBg:function (){
            var self=this;
            self.bgBox=self.newSprite(null,self.w/2,self.h/2);
            var color=["#b0d8ff","#79bcff","#46a3ff","#0c86ff"],
                textArr=["客户授信","主要数据","AGDS","前台产品"];

            for(var i=0;i<4;i++){
                var b_box=self.newSprite(self.bgBox);
                var ww=self._h-i*45-50;
                b_box.drawHexagon(0,0,color[i],ww,-90);
                //if(i%2==0){
                //    for(var j=0;j<3;j++){
                //        var text=$S("text").text(textArr[i]).attr("fill","#fff").css("font-size","19px");
                //        b_box.addChild(text);
                //        var cx=(ww-40) * Math.cos((120*j-98)*Math.PI/180),
                //            cy=(ww-40) * Math.sin((120*j-98)*Math.PI/180);
                //        text.setTransform(cx,cy,1,1,120*j);
                //        T.from(text,.5,{alpha:0,delay:.8 +.1 *i})
                //    }
                //}else{
                    var text=$S("text").text(textArr[i]).attr("fill","#fff").css("font-size","18px");
                    b_box.addChild(text);
                    text.setTransform(-text.width()/2,-self._h+i*45+92);
                    T.from(text,.5,{alpha:0,delay:.8 +.1 *i})
                //}


            }

        },
        startNoData:function (){
            var self=this;

            var traArr=[{y:"-100"},{x:"-100"},{y:"100"},{x:"100"}];
            function tweenAlphaYoyo(m,d,td,rd){
                /*********************************
                 * 时间轴
                 * |-----------------------总时间------------------------------|---延时---|
                 * ---|-----2------|------1(.5+.5)-------|--------2-----------|---.5----|
                 *   1.3         3.3                    4.3                  6.3      6.8
                 * -----|-----2------|----.8(.5+.3)-----|-------2-------|-.1--|---.5----|
                 *     1.4         3.4                 4.2            6.2    6.3      6.8
                 * -------|----2-------|--.6(.5+.1)---|-------2------|---.2---|---.5----|
                 *       1.5          3.5            4.1           6.1       6.3      6.8
                 */
                var tl=new TimelineMax({repeat:-1,repeatDelay:.5+rd});
                //T.to(m,s,{alpha:0,repeat:-1,yoyo:true,repeatDelay:1,ease:Linear.easeNone});
                tl.add(T.to(m,2,{delay:d,alpha:0,ease:Power1.easeIn}));
                tl.add(T.to(m,2,{alpha:1,delay:td +.5,ease:Power1.easeOut}))
                console.log("总时间:"+(4+d+td +.5+rd +.5),"d:"+d+"td:"+td+"rd:"+rd)
            }
            var i=0;
            for(i=0;i<4;i++){
                //个数相同,m是陵形背景，懒得写上面了
                var m=self.bgBox.find("g").eq(i);

                var t_icon=self.titleIcon.children().eq(i);

                var icon=self.bgIcon.children().eq(i);
                var t=traArr[i];
                t.alpha=0;
                t.delay=.1*i;
                T.set([m,t_icon],{transformOrigin:"50% 50%"});
                var d=.3+i *.1
                T.from(m,.5,{scale:0,alpha:0,delay:d,ease:Back.easeOut});

                //背景渐隐动画
                if(i<self.bgBox.find("polygon").length-1){
                    var td=(5-i*2) /10;

                    tweenAlphaYoyo(m,d +1,td,i/10)
                }



                T.from(icon,.5,t);
                //titleIcon tween;
                T.from(t_icon,.5,{delay:.8+i *.1,scale:0,alpha:0,ease:Back.easeOut})

            }
            T.set(self.bgLineBox,{transformOrigin:"50% 50%"});
            T.from(self.bgLineBox,.5,{delay:.5,scale:0,ease:Back.easeOut});
            T.to(self.bgLineBox,20,{delay:1,rotation:360,repeat:-1,repeatDelay:0,ease:Linear.easeNone})
            for(i=0;i<self.dataTxtBox.children().length;i++){
                var d=self.dataTxtBox.children().eq(i);
                T.from(d,.5,{delay:1+i *.1,alpha:0,ease:Back.easeOut});
            }
            //开启icon的闪亮；
            function iconFlash(){
                var c=[".top",".left",".bottom",".right"];
                for(var i=0;i<4;i++){
                    var r=Math.round(Math.random()*$(c[i]).find(".c_img").length-1);
                    T.to($(c[i]).find(".c_img").eq(r),.5,{yoyo:true,repeat:1,repeatDelay:2,alpha:1})
                }


            }
            T.delayedCall(1,function(){
                iconFlash();
                setInterval(iconFlash,4000)
            });

        },
        toMoney:function (Num,ex_num){
            Num=Num||100,ex_num=ex_num||0;
            if (Num < 1000)
            {
                return Num.toFixed(ex_num);
            }
            var _loc = Num.toFixed(ex_num);
            var xiaosu = _loc.split(".")[1] ? "." + _loc.split(".")[1] : "";
            _loc = Math.floor(Num).toString();
            var _len = _loc.length;
            var _l = Math.floor(_loc.length / 3) * 3;
            var _c = _loc.slice(_len - _l, _len);
            var _lc = _loc.slice(0, _len - _l);
            var reg = /\d{1,3}/g;
            var arr = _c.match(reg);
            _c = arr.join(",");
            var str = _lc.length > 0 ? _lc + "," + _c + xiaosu : _c + xiaosu;
            return str;
        },
        translatedNumber:function (num,fix){
            //num=num.toFixed(2).toString().replace(/[亿,万]/g,"");
            //console.log(num)
            var str="";
            if(num>=100000000){
                num=Number(num)/100000000;
                str="亿"
            }
            else if(num>=10000){
                num=Number(num)/10000;
                str="万"
            }
            return [Number(num).toFixed(Number(fix)),str]
        },
        loadData:function (){
            var self=threeFunc;
            self.ajaxData(jsonUrl + "?r=" + Math.random(), function (data) {
                self.jsonData=data;
                self.start();

            },function (jqXHR, textStatus, errorThrown){
                //如果加载不了再放一下前面这遍
                if(self.jsonData)
                    self.start();
                else
                    alert("three 438 没有数据");
            });
        },
        start:function (){
            var self=this;
            T.to(self.startJson,1,{total:self.jsonData.total,eaes:Power3.easeInOut,onUpdate:function (){
                $("#dataTxt").text(self.toMoney(self.startJson.total));
                $("#dataTxt").setTransform(-$("#dataTxt").width()/2,0);
            }});
            self.bottomTxtTween();
        },
        bottomTxtTween:function (b){
            var self=this;
            if(b){
                T.to(self.startJson.cred,.5,{retail:self.jsonData.cred.retail,wholesale:self.jsonData.cred.wholesale,onUpdate:function (){
                    var l1=$("#L-retail"),l2=$("#L-wholesale");
                    var t=self.translatedNumber(Math.round(self.startJson.cred.retail),2);
                    var tt=self.translatedNumber(Math.round(self.startJson.cred.wholesale),2);
                    l1.text(t[0]+t[1]);
                    l2.text(tt[0]+tt[1]);
                    l1.attr("x",94-l1.width());
                    l2.attr("x",94-l2.width());
                }});
            }
            else{
                T.to(self.startJson.cred,.5,{retail:self.jsonData.cred.retail,wholesale:self.jsonData.cred.wholesale,onUpdate:function (){
                    var l1=$("#L-retail"),l2=$("#L-wholesale");
                    var t=self.translatedNumber(Math.round(self.startJson.cred.retail));
                    var tt=self.translatedNumber(Math.round(self.startJson.cred.wholesale));
                    l1.text(t[0]+t[1]);
                    l2.text(tt[0]+tt[1]);
                    l1.attr("x",94-l1.width());
                    l2.attr("x",94-l2.width());
                }});
                T.to(self.startJson.order,.5,{retail:self.jsonData.order.retail,wholesale:self.jsonData.order.wholesale,onUpdate:function (){
                    var r1=$("#R-retail"),r2=$("#R-wholesale");
                    var t=self.translatedNumber(Math.round(self.startJson.order.retail));
                    var tt=self.translatedNumber(Math.round(self.startJson.order.wholesale));
                    r1.text(t[0]+t[1]);
                    r2.text(tt[0]+tt[1]);
                    r1.attr("x",193-r1.width());
                    r2.attr("x",193-r2.width());
                }});
            }
        }
    };
    $().ready(function (){
        threeFunc.init()
    })
})(jQuery, TweenMax);