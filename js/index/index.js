(function(){
    var month=new Date().getMonth()+1;
    $("#tab-months .tab-checked").text(month+'月');
})()


var geoID = ''; //区域ID
var zdxysjType = '1'; //重大信用事件预警
getEle('tab-nav2',function (value) {
  zdxysjType = value;
  zdxysj(zdxysjType,geoID);
});

//预警数量
mapNum()
function mapNum() {
  //ajax('get','areacredit/datacount','',
    //function (res) {
    var res = {"result":"1","msg":"成功","data":[{"TYPENAME":"红榜数量","ID":"61DA7D6E018EFDF9E050A8C0E21049AD","TYPE":1,"TOTAL_NUMBER":1000},{"TYPENAME":"黑榜数量","ID":"61DA7D6E018FFDF9E050A8C0E21049AD","TYPE":2,"TOTAL_NUMBER":2000},{"TYPENAME":"行政许可","ID":"61DA7D6E0190FDF9E050A8C0E21049AD","TYPE":3,"TOTAL_NUMBER":3000},{"TYPENAME":"行政处罚","ID":"61DA7D6E0191FDF9E050A8C0E21049AD","TYPE":4,"TOTAL_NUMBER":4000},{"TYPENAME":"重大诚信事件","ID":"61DA7D6E0192FDF9E050A8C0E21049AD","TYPE":5,"TOTAL_NUMBER":5000},{"TYPENAME":"重大失信事件","ID":"60ABCC1426F5D50CE050A8C0E2106657","TYPE":6,"TOTAL_NUMBER":4000}],"count":0};
      if(res.result=='1'){
        var data = res.data;
        data.map(function (v,i) {
          $('#warningNum'+v.TYPE).html(toThousands(v.TOTAL_NUMBER));
        });
      }
    // },
    // function (err) {
    //   console.log(err)
    // }
  //)
}

//地图
function map(data) {
  var mapData = [];
  data.map(function (v) {
     mapData.push({
       id:v.ID,
       name:v.CREDIT_AREA,
       value:v.CREDIT_SCORE
     })
  })
  createMap()
  function createMap() {
    $.get('../../js/common/luzhou.json', function(geoJson){
      echarts.registerMap('luzhou', geoJson);
      var echart = echarts.init(document.getElementById('map'));
      var option = {
        visualMap: {
          show:false,
          max:100,
          min:0,
          inverse:false,
          inRange: {
            color: ['#1d91e9', '#3578eb', '#0a369c']
          }
        },
        tooltip: {
          trigger: 'item',
          padding:[5,10],
          borderColor: '#8398bd',
          borderWidth: 2,
          formatter:'综合评分: <span style="color: #ff9000;font-size: 22px;">{c}</span>'
        },
        geo: {
          map: 'luzhou',
          label: {
            normal: {
              show: true,
              color:'#fff'
            },
            emphasis:{
              color:'#fff'
            }
          },
          roam: true,
          top:15,
          bottom:15,
          itemStyle: {
            normal: {
              borderWidth:2,
              borderColor:'#fff'
            }
          }
        },
        series:{
          type: 'map',
          mapType: 'luzhou',
          geoIndex: 0,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          data: mapData
        }
      }
      echart.setOption(option);
      echart.on('click',function (e) {
        geoID = e.data.id;
        sxrc(geoID);//失信热词查询
        sxqyyj(geoID);//失信企业预警
        gqxybhqs(geoID);//各区信用变化趋势
        zdxysj(zdxysjType,geoID);//重大信用事件预警
        sxgfly(geoID);////失信高发领域预警
      })
    });
  }
}

//各区信用排名
gqxypm();
function gqxypm() {
  var nameArr = [],valueArr = [];
  // ajax('get','areacredit/ranking','',
  //   function (res) {
  var res = {"result":"1","msg":"成功","data":[{"CREDIT_AREA":"江阳区","ID":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":90},{"CREDIT_AREA":"龙马潭区","ID":"a848e53d-0b98-40dc-a3df-1ce2af791154","CREDIT_SCORE":85},{"CREDIT_AREA":"纳溪区","ID":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":80},{"CREDIT_AREA":"叙永县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791157","CREDIT_SCORE":80},{"CREDIT_AREA":"合江县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791156","CREDIT_SCORE":75},{"CREDIT_AREA":"古蔺县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791158","CREDIT_SCORE":70},{"CREDIT_AREA":"泸县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791155","CREDIT_SCORE":60}],"count":0};
      if(res.result=='1'){
        var data = res.data;
          $("#gqxypm").removeAttr("_echarts_instance_");
          if (data.length < 1) {
              noData('gqxypm');
              return;
          }else{
              $("#gqxypm").html('');
          }
        map(data);
        data.map(function (v,i) {
          nameArr.push(v.CREDIT_AREA);
          valueArr.push(v.CREDIT_SCORE);
        })
        createCharts();
      }
  //   },
  //   function (err) {
  //     console.log(err)
  //   }
  // )
  function createCharts() {
    var myChart = echarts.init(document.getElementById('gqxypm'));
    var max = 100;
    var option = {
      backgroundColor: '#fff',
      grid: {
        left: 70,
        right: 30,
        top:0,
        bottom:0,
        //containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        show: false,
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine:{
          show:false
        },
      },
      yAxis: {
        type: 'category',
        splitLine: {show: false},
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        offset: 60,
        axisLabel:{
          align:'left',
          formatter:function (value,index) {
            return (index+1) + '.' + value;
          }
        },
        nameTextStyle: {
          fontSize: 12
        },
        inverse:true,
        data: nameArr
      },
      series: [
        {
          type: 'bar',
          z:1,
          silent:true,
          itemStyle: {
            normal: {color: '#f2f5fb'}
          },
          barGap:'-100%',
          barWidth: 10,
          barCategoryGap:20,
          data: [max,max,max,max,max,max,max],
          animation: false,
          tooltip:{
            show:false
          }
        },
        {
          name: '',
          type: 'bar',
          z:2,
          data: valueArr,
          barGap:'-100%',
          barWidth: 10,
          barCategoryGap:20,
          smooth: true,
          label: {
            normal: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#000',
                fontSize: 12
              }
            }
          },
          itemStyle: {
            normal: {
              color: function (params){
                return frontThree(params.dataIndex);
              }
            },
            backgroundColor:'#f3f5fb',
            grid: {
              left: '0%',
              right:'10%',
              containLabel: true
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }
  function frontThree(index) {
    if (index < 3){
      var color = ['#fb954b','#fbc74b'];
    }else{
      var color = ['#2873ef','#8adbfd'];
    }
    return new echarts.graphic.LinearGradient(0, 0, 1, 0,[{offset: 0, color: color[0]},{offset: 1, color: color[1]}]);
  }
}

//失信热词查询
sxrc();
function sxrc(id) {
  var colorList ={
    borderColors:['#f18536','#5599ff','#42be8b','#55d5ff'],
    fontColors:['#cd6112','#3361c8','#2cb743','#33aec8'],
    bgColors:['#fff8e5','#ecf5ff','#e7f4ed','#eefaff']
  };
  var itemData=[],arry=[],totalNum=0;
  var data = [];
  var params = '?';
  if (id) {
    params += 'affiliatingArea='+id;
  }
  // ajax('get','areacredit/brokenhotword'+params,'',
  //   function (res) {
  var res = {"result":"1","msg":"成功","data":[{"WORD_NUMBER":500,"BROKEN_HOT_WORD":"假冒伪劣"},{"WORD_NUMBER":300,"BROKEN_HOT_WORD":"偷税漏税"},{"WORD_NUMBER":300,"BROKEN_HOT_WORD":"走私"},{"WORD_NUMBER":50,"BROKEN_HOT_WORD":"排放废气"}],"count":0};
      if(res.result=='1'){
        data = res.data;
          $("#sxrc").removeAttr("_echarts_instance_");
        createCharts();
      }
  //   },
  //   function (err) {
  //     console.log(err)
  //   }
  // )
  function createCharts() {
      if (data.length < 1) {
          noData('sxrc');
          return;
      }else{
          $("#sxrc").html('');
      }
    data.forEach(function(itm){
      arry.push(itm.WORD_NUMBER);
      totalNum += parseInt(itm.WORD_NUMBER);
    });
    arry.sort(function(a,b){return b-a});        //降序排列数组
    data.forEach(function(item,idx){
      itemData.push({
        value:item.WORD_NUMBER,
        name:item.BROKEN_HOT_WORD,
        itemStyle : {
          normal : {
            borderColor:colorList.borderColors[idx%4],
            borderWidth:1,
            color :colorList.bgColors[idx%4],
          }
        },
        label:{
          normal : {
            show:true,
            color:colorList.fontColors[idx%4],
            fontSize:14,
            fontWeight:'bold'
          }
        }
      });
    });
    var myChart = createBubble({
      id:'sxrc',
      maxVal:arry[0],
      data:itemData,
      totalNum:totalNum
    });
  }
}

//重大信用事件预警
zdxysj(zdxysjType,geoID);
function zdxysj(type,id) {
  var params = '?';
  if (type){
    params += 'type='+type;
  }
  if (id){
    params += '&affiliatingArea='+id
  }
  var idArr = ['zdxysj1','zdxysj2','zdxysj3','zdxysj4'];
  // ajax('get','areacredit/creditevent'+params,'',
  //   function (res) {
  var res = {"result":"1","msg":"成功","data":[{"EVENT_NUMBER":6000,"INTEGRITY_TYPE":1,"PERSENT":"40.00","INTEGRITY_TYPENAME":"司法诚信"},{"EVENT_NUMBER":1000,"INTEGRITY_TYPE":2,"PERSENT":"6.67","INTEGRITY_TYPENAME":"社会诚信"},{"EVENT_NUMBER":3000,"INTEGRITY_TYPE":3,"PERSENT":"20.00","INTEGRITY_TYPENAME":"商务诚信"},{"EVENT_NUMBER":5000,"INTEGRITY_TYPE":4,"PERSENT":"33.33","INTEGRITY_TYPENAME":"政务诚信"}],"count":0};
      if(res.result=='1'){
        data = res.data;
        data.map(function (v,i) {
          meterCharts(idArr[i],{value:v.EVENT_NUMBER,name:v.INTEGRITY_TYPENAME,ratio:v.PERSENT});
        })
      }
  //   },
  //   function (err) {
  //     console.log(err)
  //   }
  // )
}
function meterCharts(id,params) {
  var myChart = echarts.init(document.getElementById(id));
  var option = {
        tooltip: {
          show:false,
          trigger: 'item',
          padding: 10,
        },
        grid: {
          left: 0,
          right: 0,
          top:0,
          bottom:0,
          containLabel: true
        },
        title:{
          text:params.name+"\n"+params.value+'条',
          top:18,
          left:'center',
          textStyle:{
            color:'#666',
            align:'center',
            fontSize:12,
            lineHeight:38,
            fontWeight:400
          }
        },
        series: [
          {
            name: '',
            max:100,
            type: 'gauge',
            splitNumber:5,
            radius:'70%',
            startAngle:180,
            endAngle:0,
            axisLine: {            // 坐标轴线
              lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.8, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#45c7ff'
                  }, {
                    offset: 1, color: '#1795ff'
                  }],
                  globalCoord: true
                }],[1, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#ffba00'
                  }, {
                    offset: 1, color: '#ff5a00'
                  }],
                  globalCoord: true
                }]],
                width: 10
              }
            },
            axisTick:{
              show:false
            },
            splitLine: {
              show: false,
              length :15,
              lineStyle: {
                color: 'auto'
              }
            },
            axisLabel:{
              distance:-5
            },
            pointer : {
              width : 2,
              length:'40%'
            },
            detail: {
              offsetCenter:[0,'10%'],//相对于仪表盘中心的偏移位置
              textStyle:{
                fontSize:16,
                color:'#4da2ec',
                fontWeight:'bold'
              },
              formatter:  '{value}%'
            },
            data: [{value: params.ratio}]
          }
        ]
      };
  myChart.setOption(option);
}

//失信高发领域预警
sxgfly();
function sxgfly(id) {
  var colorList ={
    borderColors:['#f18536','#5599ff','#42be8b','#55d5ff'],
    fontColors:['#cd6112','#3361c8','#2cb743','#33aec8'],
    bgColors:['#fff8e5','#ecf5ff','#e7f4ed','#eefaff']
  };
  var itemData=[],arry=[],totalNum=0;
  var data = [];
  var params = '?';
  if (id) {
    params += 'affiliatingArea='+id;
  }
  // ajax('get','areacredit/brokenpromise'+params,'',
  //   function (res) {
  var res = {"result":"1","msg":"成功","data":[{"DOMAIN_NAME":"互联网","DOMAIN_NUMBER":2000},{"DOMAIN_NAME":"教育","DOMAIN_NUMBER":500}],"count":0};
      if(res.result=='1'){
        data = res.data;
        createCharts();
      }
  //   },
  //   function (err) {
  //     console.log(err)
  //   }
  // )
  function createCharts() {
      $("#sxgfly").removeAttr("_echarts_instance_");
      if (data.length < 1) {
          noData('sxgfly');
          return;
      }else{
          $("#sxgfly").html('');
      }
    data.forEach(function(itm){
      arry.push(itm.DOMAIN_NUMBER);
      totalNum += parseInt(itm.DOMAIN_NUMBER);
    });
    arry.sort(function(a,b){return b-a});        //降序排列数组
    data.forEach(function(item,idx){
      itemData.push({
        value:item.DOMAIN_NUMBER,
        name:item.DOMAIN_NAME,
        itemStyle : {
          normal : {
            borderColor:colorList.borderColors[idx%4],
            borderWidth:1,
            color :colorList.bgColors[idx%4],
          }
        },
        label:{
          normal : {
            show:true,
            color:colorList.fontColors[idx%4],
            fontSize:14,
            fontWeight:'bold'
          }
        }
      });
    });
    var myChart = createBubble({
      id:'sxgfly',
      maxVal:arry[0],
      data:itemData,
      totalNum:totalNum
    });
  }
}
function createBubble(param){
  var dom = document.getElementById(param.id);
  var myChart = echarts.init(dom);
  var option = {
    tooltip : {
      show: false
    },
    grid: {
      top:0,
      left:0,
      right:0,
      bottom:0
    },
    series: [{
      type: 'graph',
      layout: 'force',
      symbol: 'circle',
      force: {
        repulsion: 150
      },
      symbolSize: function (val) {
        return(50+val*100/param.maxVal*0.9);
      },
      roam: 0.8,
      animation: true,
      draggable: false,
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(bdItem){
            var pt = (100*bdItem.value/param.totalNum).toFixed(1);
            return bdItem.name;
          }
        }
      },
      data:param.data
    }]
  };
  myChart.setOption(option);
  return myChart;
}

//各区信用变化趋势
gqxybhqs();
function gqxybhqs(id) {
  var data = [];
  var params = '?';
  if (id) { params += 'creditArea='+id; }
  // ajax('get','areacredit/areacredittrend'+params,'',
  //   function (res) {
  var res = {"result":"1","msg":"成功","data":{"area5":[],"areaAvg":[{"MONTH":"08","YEAR":"2017","CREDIT_SCORE":85},{"MONTH":"09","YEAR":"2017","CREDIT_SCORE":85},{"MONTH":"10","YEAR":"2017","CREDIT_SCORE":85},{"MONTH":"11","YEAR":"2017","CREDIT_SCORE":85},{"MONTH":"12","YEAR":"2017","CREDIT_SCORE":85},{"MONTH":"01","YEAR":"2018","CREDIT_SCORE":85}],"area6":[],"area7":[],"area1":[{"CREDIT_AREANAME":"江阳区","MONTH":"08","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":80},{"CREDIT_AREANAME":"江阳区","MONTH":"09","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":80},{"CREDIT_AREANAME":"江阳区","MONTH":"10","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":80},{"CREDIT_AREANAME":"江阳区","MONTH":"11","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":80},{"CREDIT_AREANAME":"江阳区","MONTH":"12","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":80},{"CREDIT_AREANAME":"江阳区","MONTH":"01","YEAR":"2018","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":80}],"area2":[{"CREDIT_AREANAME":"纳溪区","MONTH":"08","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":90},{"CREDIT_AREANAME":"纳溪区","MONTH":"09","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":90},{"CREDIT_AREANAME":"纳溪区","MONTH":"10","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":90},{"CREDIT_AREANAME":"纳溪区","MONTH":"11","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":90},{"CREDIT_AREANAME":"纳溪区","MONTH":"12","YEAR":"2017","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":90},{"CREDIT_AREANAME":"纳溪区","MONTH":"01","YEAR":"2018","CREDIT_AREA":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":90}],"area3":[],"area4":[]},"count":0};
      if(res.result=='1'){
        data = res.data;
        createCharts();
      }
  //   },
  //   function (err) {
  //     console.log(err)
  //   }
  // )

  function createCharts() {
      $("#gqxybhqs").removeAttr("_echarts_instance_");
      if (data.length < 1) {
          noData('gqxybhqs');
          return;
      }else{
          $("#gqxybhqs").html('');
      }
    var titleArr = ['泸县','龙马潭区','江阳区','纳溪区','叙永县','古蔺县','合江县','全市均值'],
        areaObj = {'江阳区':'1','纳溪区':'2','龙马潭区':'3','泸县':'4','古蔺县':'5','合江县':'6','叙永县':'7','全市均值':'Avg'}, //接口对照字典
        colorArr = ['255,130,0','135,156,255','199,187,186','31,197,90','240,189,140','0,177,255','123,130,144','255,73,31']
    var seriesArr = [],lineColor = [],dateArr = [];
    for(var i=0;i<titleArr.length;i++){
      lineColor.push('rgb('+colorArr[i]+')');

      var areaArr = data['area'+areaObj[titleArr[i]]],areaData = [];

        if (areaArr){
          areaArr.map(function (v) {
            areaData.push(v.CREDIT_SCORE);
            if ((i+1)==titleArr.length){
               var month = v.MONTH;
               if (month[0]=='0'){ month = month[1] } //去除月份前的0
               dateArr.push(month+'月')
            }
          });
        }
        seriesArr.push({
          name:titleArr[i],
          type:'line',
          symbolSize:0,
          data:areaData,
          smooth: true,
        })
    }

    var myChart = echarts.init(document.getElementById('gqxybhqs'));
    option = {
      backgroundColor: '#fff',
      legend: {
        icon:'rect',
        right: '10px',
        itemGap:20,
        itemWidth:10,
        itemHeight:10,
        data:titleArr
      },
      grid: {
        right: 20,
        left:40,
        top:30,
        bottom:40
      },
      color:lineColor,
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis : {
        type : 'category',
        boundaryGap: false,
        data: dateArr,
        axisLabel:{
          textStyle:{
            fontSize:12,
            color:'#666'
          }
        },
        axisLine:{
          show:true,
          lineStyle: {
            color: '#ccd3dd',
            type: "solid"
          }
        },
        splitLine: {
          show:true,
          lineStyle: {
            color: '#eef1f4',
            type: "solid"
          }
        },
        axisTick: {
          show:false,
        }
      },
      yAxis : {
        //name:'(万条)',
        max:100,
        nameTextStyle:{
          fontSize:12
        },
        type : 'value',
        axisLabel:{
          textStyle:{
            fontSize:12,
            color:'#666'
          }
        },
        axisLine:{
          show:false
        },
        splitLine: {
          lineStyle: {
            color: '#eef1f4',
            type: "solid"
          }
        },
        axisTick:{
          show:false
        }
      },
      series : seriesArr
    };
    myChart.setOption(option);
  }
}

//失信企业预警
sxqyyj()
function sxqyyj(id){
  var params = '?';
  if (id) {
    params += 'affiliatingArea='+id;
  }
	// ajax('get','areacredit/unreliable'+params,'',function(res){
    var res = {"result":"1","msg":"成功","data":[{"RELEASE_DATE":"2018-01-03","AFFILIATING_AREA":"纳溪区","CREDIT_CODE":"DE987654321122","PUNISH_TYPE":"行政拘留","DEPARTMENT":"市工商局","ID":"6161F2CA4B94613BE050A8C0E210175F","CORPORATE":"法人6","COMPANY":"某公司6"},{"RELEASE_DATE":"2018-01-03","AFFILIATING_AREA":"纳溪区","CREDIT_CODE":"DE987654321122","PUNISH_TYPE":"行政拘留","DEPARTMENT":"市工商局","ID":"6161F2CA4B93613BE050A8C0E210175F","CORPORATE":"法人5","COMPANY":"某公司5"},{"RELEASE_DATE":"2018-01-03","AFFILIATING_AREA":"纳溪区","CREDIT_CODE":"DE987654321122","PUNISH_TYPE":"行政拘留","DEPARTMENT":"市工商局","ID":"6161F2CA4B92613BE050A8C0E210175F","CORPORATE":"法人4","COMPANY":"某公司4"},{"RELEASE_DATE":"2018-01-03","AFFILIATING_AREA":"纳溪区","CREDIT_CODE":"DE987654321122","PUNISH_TYPE":"行政拘留","DEPARTMENT":"市工商局","ID":"6161F2CA4B91613BE050A8C0E210175F","CORPORATE":"法人3","COMPANY":"某公司3"},{"RELEASE_DATE":"2018-01-03","AFFILIATING_AREA":"江阳区","CREDIT_CODE":"DE987654321","PUNISH_TYPE":"行政拘留","DEPARTMENT":"市工商局","ID":"60A935B719CDCF56E050A8C0E21040E3","CORPORATE":"法人2","COMPANY":"某公司2"},{"RELEASE_DATE":"2018-01-03","AFFILIATING_AREA":"纳溪区","CREDIT_CODE":"DE987654321","PUNISH_TYPE":"行政拘留","DEPARTMENT":"市工商局","ID":"60A935B719CCCF56E050A8C0E21040E3","CORPORATE":"法人","COMPANY":"某公司"}],"count":0};
		var str="";
		if(res.data.length==0){
			str+="<li class='noData'>暂无数据</li>"
		}else{
			$.each(res.data,function(i,v){
				if(i%2==1){
					str+="<li class='t'>"
				}else{
					str+="<li>"
				}
				  str+="<span title="+v.COMPANY+">"+v.COMPANY+"</span>"
					+"<span title="+v.CORPORATE+">"+v.CORPORATE+"</span>"
					+"<span title="+v.PUNISH_TYPE+">"+v.PUNISH_TYPE+"</span>"
					+"<span title="+v.CREDIT_CODE+">"+v.CREDIT_CODE+"</span>"
					+"<span title="+v.DEPARTMENT+">"+v.DEPARTMENT+"</span>"
					+"<span title="+v.RELEASE_DATE+">"+v.RELEASE_DATE+"</span>"
				+"</li>"
			})
		}
		$('.list-box ul').html(str);
		if($('.list-box ul').children('li').length>6){
			play(".list-box ul");
		}
	// },function(res){
	// 	console.log(res)
	// })
}
//信用信息预警
xyxiyj()
function xyxiyj(){
	var index=1;
    var res = {"result":"1","msg":"成功","data":[{"TITLE":"不良信息6","ID":"6161E93C7A461CD6E050A8C0E21016BC","UPLODE_DATE":"2018-01-03"},{"TITLE":"不良信息5","ID":"6161E93C7A451CD6E050A8C0E21016BC","UPLODE_DATE":"2018-01-03"},{"TITLE":"不良信息4","ID":"6161E93C7A441CD6E050A8C0E21016BC","UPLODE_DATE":"2018-01-03"},{"TITLE":"不良信息3","ID":"6161E93C7A431CD6E050A8C0E21016BC","UPLODE_DATE":"2018-01-03"},{"TITLE":"不良信息2","ID":"6161E93C7A421CD6E050A8C0E21016BC","UPLODE_DATE":"2018-01-03"},{"TITLE":"不良信息1","ID":"6161E93C7A411CD6E050A8C0E21016BC","UPLODE_DATE":"2018-01-03"}],"count":0};
	$('#tab-nav em').on('click',function(){
		$(this).addClass('tab-checked').siblings().removeClass('tab-checked');
		index=$(this).index()*1+1;
		// ajax('get','areacredit/creditinformation?type='+index,'',successCB,function(res){
		// 	//console.log(res)
		// })
        successCB(res);
	})
	// ajax('get','areacredit/creditinformation?type='+index,'',successCB,function(res){
	// 	//console.log(res)
	// })
    successCB(res);
}
var onScrooll = 0;
function successCB(res){
	var str="";
	//console.log(res);
	if(res.data.length==0){
		str+="<li class='noData'>暂无数据</li>"
	}else{
		$.each(res.data,function(i,v){
			str+="<li title="+v.TITLE+">"
			  +"<span>"+v.TITLE+"</span>"
				+"<em>"+v.UPLODE_DATE+"</em>"
			+"</li>"
		})
	}
	$('#tab-info ul').html(str);
    clearInterval(onScrooll);
    onScrooll = 0;
    if(res.data.length>6){
		play("#tab-info ul");
    }
}
//自动滚动
function play(ListObj,state){
	onScrooll = startScrooll(ListObj);
	$(ListObj).find('li').mouseenter(function() {
        clearInterval(onScrooll);
    });
    $(ListObj).find('li').mouseleave(function() {
        onScrooll = startScrooll(ListObj);
    });
}
function autoScroll(obj) {
    $(obj).animate({
        marginTop : "-33px"
    }, 1200, function() {
        $(this).css({
            marginTop : "0px"
        }).find("li:first").appendTo(this);
    });
}
function startScrooll(obj, start) {
    return setInterval(function() {
        autoScroll(obj);
    }, 1200);
}
