//tab切换
// getEle('tab-nav','tab-box');
var geoID = '';
var gdqsjjrqkType = '1';
getEle('tab-nav',function (value) {
  gdqsjjrqkType = value;
  gdqsjjrqk(gdqsjjrqkType,geoID);
});
getEle('tab-nav2',function (value) {
  if (value=='1'){
    $('#map').show();
    $('#company').hide();
    $('.main-wrap .ele-top').addClass('mapbg');
  }else{
    var scale=(document.body.clientWidth/1900).toFixed(2);
    $(".company-box").css({"transform":"scale("+scale+")"});
    $(".company-box").css({"marginLeft":"-430px"});
    $('#map').hide();
    $('#company').show();
    $('.main-wrap .ele-top').removeClass('mapbg');
  }
});
getEle('tab-nav3',function (value) {
  sjjrzlqk(value);
});


//地图
map();
function map() {

  // ajax('get','paltform/totalcount','',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":{"areaCount":1,"deptCount":34,"dataTotalCount":10.34},"count":0};
        if(res.result=='1'){
          var data = res.data;
          $('#b-em').html(data.deptCount);
          $('#b-em2').html(data.areaCount);
          $('#b-em3').html(data.dataTotalCount.toFixed(2));
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )

  // ajax('get','areacredit/ranking','',
  //     function (res) {
var res = {"result":"1","msg":"成功","data":[{"CREDIT_AREA":"江阳区","ID":"a848e53d-0b98-40dc-a3df-1ce2af791152","CREDIT_SCORE":90},{"CREDIT_AREA":"龙马潭区","ID":"a848e53d-0b98-40dc-a3df-1ce2af791154","CREDIT_SCORE":85},{"CREDIT_AREA":"纳溪区","ID":"a848e53d-0b98-40dc-a3df-1ce2af791153","CREDIT_SCORE":80},{"CREDIT_AREA":"叙永县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791157","CREDIT_SCORE":80},{"CREDIT_AREA":"合江县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791156","CREDIT_SCORE":75},{"CREDIT_AREA":"古蔺县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791158","CREDIT_SCORE":70},{"CREDIT_AREA":"泸县","ID":"a848e53d-0b98-40dc-a3df-1ce2af791155","CREDIT_SCORE":60}],"count":0};
        if(res.result=='1'){
          var data = res.data;
          createMap(data);
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
  function createMap(rankingData) {
    // ajax('get','common/getAllAreaList','',function(res){
    var res = {"result":"1","msg":"成功","data":[{"GOV_ID":"a848e53d-0b98-40dc-a3df-1ce2af791152","GOV_CNAME":"江阳区","PARENT_ID":"111"},{"GOV_ID":"a848e53d-0b98-40dc-a3df-1ce2af791153","GOV_CNAME":"纳溪区","PARENT_ID":"111"},{"GOV_ID":"a848e53d-0b98-40dc-a3df-1ce2af791154","GOV_CNAME":"龙马潭区","PARENT_ID":"111"},{"GOV_ID":"a848e53d-0b98-40dc-a3df-1ce2af791155","GOV_CNAME":"泸县","PARENT_ID":"111"},{"GOV_ID":"a848e53d-0b98-40dc-a3df-1ce2af791156","GOV_CNAME":"合江县","PARENT_ID":"111"},{"GOV_ID":"a848e53d-0b98-40dc-a3df-1ce2af791157","GOV_CNAME":"叙永县","PARENT_ID":"111"},{"GOV_ID":"a848e53d-0b98-40dc-a3df-1ce2af791158","GOV_CNAME":"古蔺县","PARENT_ID":"111"}],"count":0};
   if (res.result == '1') {
        var mapData = []
        res.data.forEach(function(item,idx){
          var obj = {
            name:rankingData[idx].CREDIT_AREA,
            areaId:item.GOV_ID,
            value:rankingData[idx].CREDIT_SCORE
          }
          if(obj.name=='江阳区'){
            geoID = obj.areaId
            $("#areaName").text("江阳区")
          }
          mapData.push(obj)
        })
        gdqsjjrqk(gdqsjjrqkType, geoID);    //各地区数据接入情况监测接口初始化
        getMapJson(mapData)   //初始化地图
      }
    //})

  }
}

function getMapJson(mapData){
  var geoCoordMap = {
    '泸州市': [105.43,28.87],
    '江阳区': [105.45,28.88],
    '纳溪区': [105.37,28.77],
    '龙马潭区': [105.43 ,28.90],
    '泸县': [105.38,29.15],
    '合江县': [105.83,28.82],
    '叙永县': [105.43,28.17],
    '古蔺县': [105.82,28.05]
  }
  var LZData = [];
  mapData.forEach(function(item){
    LZData.push([{name:'泸州市'}, item])
  })


  var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[1].name,
          toName: dataItem[0].name,
          coords: [toCoord, fromCoord]
        });
      }
    }
    return res;
  };

  var color = ['#ffea00', '#fff000', 'yellow'];
  var series = [];
  series.push(
      // 线条附加效果
      {
        type: 'map',
        mapType: 'luzhou',
        geoIndex: 0,
        itemStyle: {
          emphasis: {
            label: {
              show: false,
              textStyle: {
                color: '#ffffff'

              }
            }
          }
        },
        data: mapData
      },

      // 线条与箭头效果
      {
        name: '泸州市',
        type: 'lines',
        zlevel: 2,
        effect: {
          show: false,
          period: 6,
          trailLength: 0
        },
        lineStyle: {
          normal: {
            color: color[1],
            width: 2,
            opacity: 0.8,
            curveness: 0.8
          },
          emphasis: {
            show: false
          }
        },
        data: convertData(LZData)
      },

      // 端点效果
      {
        name: '泸州市',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: function (val) {
          var size = val[2] / 12
          if(size < 6){
            size = 6
          } else if(size < 15){
            size = 15
          }
          return size;
        },
        itemStyle: {
          normal: {
            color:'#d8e000',
            shadowColor:'red'
          },
          emphasis:{
            color:'#ffdb00',
            shadowColor:'red'
          }
        },
        data: LZData.map(function (dataItem) {
          return {
            name: dataItem[1].name,
            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
            tooltip:{
              show:true,
              formatter:function(){
                return dataItem[1].name+'('+ dataItem[1].value + ')'
              }
            }
          };
        })
      });

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
          color: [],
         // color: ['#1d91e9', '#3578eb', '#0a369c']
        }
      },
      tooltip: {
        show:false,
        trigger: 'item',
        padding:[5,10],
        borderColor: '#8398bd',
        borderWidth: 2,
        formatter:'综合评分: <span style="color: #ff9000;font-size: 22px;">{c}</span>'
      },
      geo: {
        map: 'luzhou',
        geoIndex:0,
        roam: false,
        itemStyle: {
          normal: {
            areaColor: '#2452ad',
            borderColor: '#ffffff'
          },
          emphasis: {
            label:{
              show:false
            },
            areaColor: '#1d91e9',
            borderColor: '#ffffff'
          }
        }
      },
      series:series
    }
    console.log('11111',option)
    echart.setOption(option);
    echart.on('click',function (e) {
      var areaId = e.data.areaId;
      var areaName = e.data.name
      $("#areaName").text(areaName)
      gdqsjjrqk(gdqsjjrqkType,areaId);//各地区数据接入情况检测
    })
  });
}
//接入单位
company();
function company() {
  // ajax('get','paltform/plcdept','',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791101","DEPT_NAME":"市委组织部","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791102","DEPT_NAME":"市委宣传部","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791103","DEPT_NAME":"市委政法委","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791104","DEPT_NAME":"市委编办","IS_MFS":0,"IS_DATA":0},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791105","DEPT_NAME":"市发展改革委","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791106","DEPT_NAME":"市经济和信息化委","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791107","DEPT_NAME":"市教育局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791108","DEPT_NAME":"市科技知识产权局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791109","DEPT_NAME":"市公安局","IS_MFS":0,"IS_DATA":0},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791110","DEPT_NAME":"市民政局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791111","DEPT_NAME":"市司法局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791112","DEPT_NAME":"市财政局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791113","DEPT_NAME":"市人力资源社会保障局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791114","DEPT_NAME":"市国土资源局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791115","DEPT_NAME":"市住房城乡建设局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791116","DEPT_NAME":"市城乡规划管理局","IS_MFS":0,"IS_DATA":0},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791117","DEPT_NAME":"市城管执法局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791118","DEPT_NAME":"市交通运输局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791119","DEPT_NAME":"市水务局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791120","DEPT_NAME":"市农业局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791121","DEPT_NAME":"市商务局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791122","DEPT_NAME":"市文体广局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791123","DEPT_NAME":"市卫生计生委","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791124","DEPT_NAME":"市环境保护局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791125","DEPT_NAME":"市统计局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791126","DEPT_NAME":"市安全监管局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791127","DEPT_NAME":"市国资委","IS_MFS":0,"IS_DATA":0},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791128","DEPT_NAME":"市金融办","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791129","DEPT_NAME":"市食品药品监管局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791130","DEPT_NAME":"市工商局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791131","DEPT_NAME":"市质监局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791132","DEPT_NAME":"市国税局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791133","DEPT_NAME":"市地税局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791135","DEPT_NAME":"泸州出入境检验检疫局","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791136","DEPT_NAME":"市档案局","IS_MFS":0,"IS_DATA":0},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791137","DEPT_NAME":"人行泸州中支","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791138","DEPT_NAME":"市住房公积金管理中心","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791139","DEPT_NAME":"市中级法院","IS_MFS":1,"IS_DATA":1},{"DEPT_ID":"a848e53d-0b98-40dc-a3df-1ce2af791140","DEPT_NAME":"市检察院","IS_MFS":1,"IS_DATA":1}],"count":0};
        if(res.result=='1'){
          var data = res.data;
          data.map(function (v,i) {
            $('#com'+(i+1)+' .com-text').html(v.DEPT_NAME);
            if(v.IS_MFS==1){
              $('#com'+(i+1)).addClass('access');
            }
          })
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
}

//信用开放门户运行检测预警
xymhyx();
function xymhyx() {
  var data = [];
  // ajax('get','paltform/opendooroperation','',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[],"count":0};
        if(res.result=='1'){
          data = res.data;
          $("#xymhyx").removeAttr("_echarts_instance_");
          if (data.length < 1) {
            noData('xymhyx');
            return;
          }else{
            $("#xymhyx").html('');
          }
          createCharts();
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
  function createCharts() {
    var dateArr = [],accessArr = [],userArr = [];
    data.map(function (v,i) {
      dateArr.push(v.DAY+'日');
      accessArr.push(v.VISITS);
      userArr.push(v.NEW_USERS);
    })

    var echart = echarts.init(document.getElementById('xymhyx'));
    var option = {
      backgroundColor:'#fff',
      grid: {
        left:10,
        right:10,
        top:50,
        bottom:10,
        containLabel:true
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          var str = "";
          params.forEach(function(v, i) {
            str += v.seriesName + ": " + v.value + "次" + "<br>";
          });
          return str
        },
      },
      legend:{
        itemWidth:10,
        itemHeight:10,
        itemGap:20,
        textStyle: {
          fontSize: 14
        },
        data:[{name:'网站访问量',icon:'rect'},{name:'新增用户数',icon:'circle'}]
      },
      xAxis: [
        {
          type: 'category',
          data: dateArr,
          axisPointer: {
            type: 'shadow',
            shadowStyle:{
              color:'rgba(233,242,255,0.3)'
            }
          },
          axisLine:{
            lineStyle:{
              color: '#ccc'
            }
          },
          axisLabel:{
            textStyle: {
              color:'#858585'
            }
          },
          axisTick: {
            show:false,
          },
        }
        // xAxis.axisLine.lineStyle.type string[ default: 'solid' ]
      ],
      yAxis: [
        {
          type: 'value',
          name: '(次)',
          nameTextStyle:{
            color:'#333'
          },
          min: 0,
          axisLabel: {
            formatter: '{value}',
            color:'#858585'
          },
          axisLine:{
            lineStyle:{
              color: '#ccc'
            }
          },
          splitLine:{
            lineStyle:{
              type: 'dashed',
              color: '#e7e7e7'
            }
          },
          splitArea:{
            areaStyle:{
              color: '#e9f2ff',
              shadowColor: '#e9f2ff',
              shadowBlur: 10
            }

          },
          axisTick: {
            show:false,
          },
        },
        {
          type: 'value',
          name: '(人)',
          nameTextStyle:{
            color:'#333'
          },
          min: 0,
          axisLabel: {
            formatter: '{value}',
            color:'#858585'
          },
          axisLine:{
            lineStyle:{
              color: '#ccc'
            }
          },
          splitLine:{
            lineStyle:{
              type: 'dashed',
              color: '#fff'
            }
          },
          splitArea:{
            areaStyle:{
              color: '#e9f2ff',
              shadowColor: '#e9f2ff',
              shadowBlur: 10
            }
          },
          axisTick: {
            show:false,
          }
        }
      ],
      series: [
        {
          name:'网站访问量',
          type:'bar',
          data:accessArr,
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#67c3f9'
              }, {
                offset: 1,
                color: '#3d75e8'
              }]),
              shadowColor: 'rgba(0, 0, 0, 0)',
              shadowBlur: 10
            }
          }
        },
        {
          name:'新增用户数',
          type:'line',
          yAxisIndex: 1,
          data:userArr,
          itemStyle: {
            normal: {
              color: '#fb9b45',
              barBorderRadius: 0,
              lineStyle:{
                color: '#fb9b45',
              },
              shadowColor: 'rgba(0, 0, 0, 0)',
              shadowBlur: 10
            }
          },
          symbolSize: 7
        }
      ]
    };
    echart.setOption(option);
  }
}

//共享交换平台运行检测预警
gxjhptyx();
function gxjhptyx() {
  var data = [];
  // ajax('get','paltform/convertoperation','',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[],"count":0};
        if(res.result=='1'){
          data = res.data;
          $("#gxjhptyx").removeAttr("_echarts_instance_");
          if (data.length < 1) {
            noData('gxjhptyx');
            return;
          }else{
            $("#gxjhptyx").html('');
          }
          createCharts();
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
  function createCharts() {
    var dateArr = [],dataNumArr = [],successArr = [];
    data.map(function (v) {
      dateArr.push(v.DAY+'日');
      dataNumArr.push(v.CONVERT_NUMBER);
      successArr.push(v.SUCCESS);
    })

    var echart = echarts.init(document.getElementById('gxjhptyx'));
    var option = {
      backgroundColor: '#fff',
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          var str = "";
          params.forEach(function(v, i) {
            str += v.seriesName + ": " + v.value + "次" + "<br>";
          });
          return str
        }
      },
      grid: {
        left:10,
        right:10,
        top:50,
        bottom:10,
        containLabel:true
      },
      legend:{
        itemWidth:10,
        itemHeight:10,
        itemGap:20,
        textStyle: {
          fontSize: 14
        },
        data:[{name:'数据交换量',icon:'rect'},{name:'交换成功率',icon:'circle'}]
      },
      xAxis: [
        {
          type: 'category',
          data: dateArr,
          axisPointer: {
            type: 'shadow',
            shadowStyle:{
              color:'rgba(254,244,235,0.3)'
            }
          },
          axisLine:{
            lineStyle:{
              color: '#ccc',
              type: 'solid'
            }
          },
          axisLabel:{
            textStyle:{
              color: '#858585'
            }
          },
          axisTick: {
            show:false,
          }
        }
      ],
      yAxis: [
        {
          name: '(次)',
          nameTextStyle:{
            color:'#333'
          },
          min: 0,
          //max: 25,
          //interval: 5,
          axisLabel: {
            formatter: '{value}'
          },
          axisLine:{
            lineStyle:{
              color: '#ccc'
            }
          },
          axisLabel:{
            color: '#858585'
          },
          splitLine:{
            lineStyle:{
              type: 'dashed',
              color: '#e7e7e7'
            }
          },
          axisTick: {
            show:false,
          }
        },
        {
          type: 'value',
          name: '',
          min: 0,
          //max: 250,
          //interval: 50,
          axisLabel: {
            formatter: '{value}'
          },
          axisLine:{
            lineStyle:{
              color: '#ccc'
            }
          },

          splitLine:{
            lineStyle:{
              type: 'dashed',
              color: '#e7e7e7'
            }
          },
          axisTick: {
            show:false,
          },
          axisLabel:{
            color: '#858585',
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name:'数据交换量',
          type:'bar',
          data:dataNumArr,
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              //color: '#fb9b45',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#ff8468'
              }, {
                offset: 1,
                color: '#fc7054'
              }]),
              shadowColor: 'rgba(0, 0, 0, 0)',
              shadowBlur: 10
            }
          }
        },
        {
          name:'交换成功率',
          type:'line',
          yAxisIndex: 1,
          data:successArr,
          itemStyle: {
            normal: {
              color: '#3d75e8',
              barBorderRadius: 0,
              lineStyle:{
                color: '#3d75e8',
              },
              shadowColor: 'rgba(0, 0, 0, 0)',
              shadowBlur: 10
            }
          },
          symbolSize: 7
        }
      ]
    };
    echart.setOption(option);
  }
}

//各单位入库数据量监测、各地区入库数据量监测 条型图
gdwrksj();
function gdwrksj() {
  var nameArr = [],valueArr = [];
  // ajax('get','paltform/dataputdepartment','',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[{"DEPARTMENT":"市国税局","INPUT_NUMBER":4000},{"DEPARTMENT":"市质监局","INPUT_NUMBER":3000},{"DEPARTMENT":"市工商局","INPUT_NUMBER":2000}],"count":0};
        if(res.result=='1'){
          var data = res.data;
          $("#gdwrksj").removeAttr("_echarts_instance_");
          if (data.length < 1) {
            noData('gdwrksj');
            return;
          }else{
            $("#gdwrksj").html('');
          }
          data.map(function (v) {
            nameArr.push(v.DEPARTMENT);
            valueArr.push(v.INPUT_NUMBER);
          })
          rksjjc('gdwrksj',nameArr,valueArr);
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
}
gdqrksj();
function gdqrksj() {
  var nameArr = [],valueArr = [];
  // ajax('get','paltform/dataputarea','',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[{"AREA":"江阳区","INPUT_NUMBER":7000},{"AREA":"纳溪区","INPUT_NUMBER":6000}],"count":0};
        if(res.result=='1'){
          var data = res.data;
          $("#gdqrksj").removeAttr("_echarts_instance_");
          if (data.length < 1) {
            noData('gdqrksj');
            return;
          }else{
            $("#gdqrksj").html('');
          }
          data.map(function (v) {
            nameArr.push(v.AREA);
            valueArr.push(v.INPUT_NUMBER);
          })
          rksjjc('gdqrksj',nameArr,valueArr);
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
}
function rksjjc(id,nameArr,valueArr) {
  var myChart = echarts.init(document.getElementById(id));
  var max = Math.max.apply(null, valueArr);
  var option = {
    backgroundColor: '#fff',
    grid: {
      left: 80,
      right: 50,
      top:0,
      bottom:0,
      //containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    }
    ,
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
      offset: 70,
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
        barCategoryGap:20,
        barWidth: 10,
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
  function frontThree(index) {
    if (index < 3){
      var color = ['#fb954b','#fbc74b'];
    }else{
      var color = ['#2873ef','#8adbfd'];
    }
    return new echarts.graphic.LinearGradient(0, 0, 1, 0,[{offset: 0, color: color[0]},{offset: 1, color: color[1]}]);
  }
}

//各地区数据接入情况检测
function gdqsjjrqk(type,id) {
  var params = '?type=' + (type ? type :'1'); //type： 1 月 、 2 日
  if (id) {
    params += '&accessArea='+id
  }
  // ajax('get','paltform/dataaccess'+params,'',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[{"ACCESS_NUMBER":15,"MONTH":"07","YEAR":"2017"},{"ACCESS_NUMBER":14,"MONTH":"08","YEAR":"2017"},{"ACCESS_NUMBER":11,"MONTH":"09","YEAR":"2017"},{"ACCESS_NUMBER":13,"MONTH":"10","YEAR":"2017"},{"ACCESS_NUMBER":12,"MONTH":"11","YEAR":"2017"},{"ACCESS_NUMBER":20.5,"MONTH":"12","YEAR":"2017"},{"ACCESS_NUMBER":12,"MONTH":"01","YEAR":"2018"}],"count":0};
        if(res.result=='1'){
          var data = res.data;
          $("#gdqsjjrqk").removeAttr("_echarts_instance_");
          if (data.length < 1) {
            noData('gdqsjjrqk');
            return;
          }else{
            $("#gdqsjjrqk").html('');
          }
          createCharts11(data);
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
  function createCharts11(data) {
    var echart = echarts.init(document.getElementById('gdqsjjrqk'));
    var dateArr = [],dataArr = [];
    if (type=='2'){
      data.map(function (v) {
        dateArr.push(v.DAY+'日');
      })
    }else{
      data.map(function (v) {
        dateArr.push(v.MONTH+'月');
        dataArr.push(v.ACCESS_NUMBER);
      })
    }

    data.map(function (v) {
      dateArr.push(v.MONTH+'月');
      dataArr.push(v.ACCESS_NUMBER);
    })
    var option = {
      backgroundColor: '#fff',
      color:['rgb(17,140,255)'],
      grid: {
        left: 20,
        right: 20,
        top:30,
        bottom:20,
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0,0, 0, 0)'
          }
        },
        formatter:'{c}条',
        backgroundColor:'rgba(55,67,95,0.8)',
        borderWidth:1,
        position:'top'

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
        name: '(条)',
        nameTextStyle:{
          color:'#333'
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
      series : [
        {
          name:'',
          type:'line',
          data:dataArr,
          smooth: true,
          areaStyle:{
            normal:{
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(17,140,255,0.5)'
              }, {
                offset: 0.9,
                color: 'rgba(17,140,255,0)'
              }])

            }
          }
        }
      ]
    };
    echart.setOption(option);
  }
}

//数据接入总量情况检测
sjjrzlqk('1');
function sjjrzlqk(type) {
  var data = [];
  var params = '?type=' + (type ? type :'1'); //type： 1 月 、 2 日
  // ajax('get','paltform/dataaccesstotalcount'+params,'',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[{"ACCESS_NUMBER":15,"MONTH":"07","YEAR":"2017"},{"ACCESS_NUMBER":14,"MONTH":"08","YEAR":"2017"},{"ACCESS_NUMBER":11,"MONTH":"09","YEAR":"2017"},{"ACCESS_NUMBER":13,"MONTH":"10","YEAR":"2017"},{"ACCESS_NUMBER":12,"MONTH":"11","YEAR":"2017"},{"ACCESS_NUMBER":20.5,"MONTH":"12","YEAR":"2017"},{"ACCESS_NUMBER":12,"MONTH":"01","YEAR":"2018"}],"count":0};
        if(res.result=='1'){
          data = res.data;
          $("#sjjrzlqk").removeAttr("_echarts_instance_");
          if (data.length < 1) {
            noData('sjjrzlqk');
            return;
          }else{
            $("#sjjrzlqk").html('');
          }
          createCharts();
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )
  function createCharts() {
    var dateArr = [],dataArr = [];
    if (type=='2'){
      data.map(function (v) {
        dateArr.push(v.DAY+'日');
        dataArr.push(v.ACCESS_NUMBER);
      })
    }else{
      data.map(function (v) {
        dateArr.push(v.MONTH+'月');
        dataArr.push(v.ACCESS_NUMBER);
      })
    }

    var echart = echarts.init(document.getElementById('sjjrzlqk'));
    var option = {
      backgroundColor: '#fff',
      color:['rgb(255,190,39)'],
      grid: {
        left: 20,
        right: 20,
        top:30,
        bottom:20,
        containLabel: true
      },
      tooltip: {
        show: true,
        //trigger: 'axis',
        formatter:'{c}万条',
        backgroundColor:'rgba(0,0,0,0.65)',
        borderColor:'rgba(0,0,0,0.65)',
        borderWidth:1,
        position:'top'
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
        name:'(万条)',
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
      series : [
        {
          name:'',
          type:'line',
          data:dataArr,
          smooth: true,
          areaStyle:{
            normal:{
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255,190,39,0.5)'
              }, {
                offset: 0.9,
                color: 'rgba(255,190,39,0)'
              }])

            }
          }
        }
      ]
    };
    echart.setOption(option);
  }
}

//信用信息分类情况监测
xyxxfljc();
function xyxxfljc() {

  var data = [],firstParams = {};
  // ajax('get','paltform/infotypesituation','',
  //     function (res) {
  var res = {"result":"1","msg":"成功","data":[{"INTEGRITY_NUMBER":8000,"INTEGRITY_TYPE":1,"INTEGRITY_TYPENAME":"司法诚信"},{"INTEGRITY_NUMBER":5000,"INTEGRITY_TYPE":2,"INTEGRITY_TYPENAME":"社会诚信"},{"INTEGRITY_NUMBER":4000,"INTEGRITY_TYPE":3,"INTEGRITY_TYPENAME":"商务诚信"},{"INTEGRITY_NUMBER":6000,"INTEGRITY_TYPE":4,"INTEGRITY_TYPENAME":"政务诚信"}],"count":0};
        if(res.result=='1'){
          data = res.data;
          $("#xyxxfljc").removeAttr("_echarts_instance_");
          if (data.length < 1) {
            noData('xyxxfljc');
            return;
          }else{
            $("#xyxxfljc").html('');
          }
          createCharts();
        }
  //     },
  //     function (err) {
  //       console.log(err)
  //     }
  // )

  function createCharts() {
    var dataArr = [];
    data.map(function (v) {
      dataArr.push({
        value:v.INTEGRITY_NUMBER,
        name:v.INTEGRITY_TYPENAME
      })
    })

    var echart = echarts.init(document.getElementById('xyxxfljc'));
    var option = {
      backgroundColor: '#fff',
      tooltip: {
        show:false,
        trigger: 'item',
        backgroundColor:'rgba(55,67,95,0.8)',
        padding: 10
      },
      title:{
        text:'3,224条',
        x: 'center',
        y: '40%',
        textStyle:{
          color:'#2d7ffd',
          fontSize:14
        },
        subtext:'22%',
        subtextStyle:{
          color:'#2d7ffd',
          fontSize:14
        }
      },
      color:['#ffb400','#ff6c3f','#00d4ff','#359fff'],
      series : [
        {
          name:'',
          type:'pie',
          radius : [40, 70],
          center : ['50%', '50%'],
          labelLine:{
            normal:{
              show:true,
              length:15,
              length2:20,
              lineStyle:{
                color:'#e3e3e3'
              }
            },
            emphasis:{
              show:true,
              lineStyle:{
                color:'#e3e3e3'
              }
            }
          },
          label: {
            normal: {
              position: 'outside',
              show: true,
              formatter: function (params) {
                if (params.dataIndex == 0) {
                  firstParams = params
                }
                return params.name;
              },
              textStyle: {
                color:'#333',
                fontSize:14
              }
            }
          },
          itemStyle:{
            normal:{
              show:false
            },
            emphasis:{
              borderColor:'#fff',
              borderWidth:3
            }
          },
          data:dataArr
        },
        {
          name:'quan',
          type:'pie',
          silent:true,
          radius : [80, 81],
          center : ['50%', '50%'],
          hoverAnimation:false,
          legendHoverLink:false,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          data:[
            {
              value:'220',
              itemStyle:{
                normal:{
                  color:'#ccc'
                }
              }
            }
          ]
        },
      ]
    };
    echart.setOption(option);
    echart.on('mouseover', function (params) {
      highlight(params)
    });
    echart.on('mouseout', function (params) {
      highlight(params);
    });
    function highlight(params) {
      echart.setOption({
        title:{
          text:toThousands(params.value)+'条',
          subtext:params.percent+'%'
        }
      });
      echart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      })
    }
    highlight(firstParams)
  }
}
