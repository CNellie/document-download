/*
 * @Author: Fanlinqi 
 * @Date: 2018-08-15 15:37:00 
 * @Last Modified by: Fanlinqi
 * @Last Modified time: 2018-09-04 15:15:58
 */

MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
GetRequest();

// const test_ids = "20155,100708,100709,20137,20188,20191,20203,20204,20227,20292,129448,103252,20166,20216,20223";
//截取url地址栏
var test_ids;
function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    test_ids = theRequest.test_ids;
    console.log(test_ids);
    return theRequest;
};

//获取试题渲染页面
$.ajax({
    type: "GET",
    dataType: 'json',
    cache:false,
    url: 'http://dsp.xesv5.com/testLibrary/libraryThree?test_ids=' + test_ids + '&text_type=1&latex_type=1&img_scaling=3',
    success: function (res) {
        var data = res.data;
        var contentStr = ``;
        for (var index in data) {
            // console.log(data[index])
            var type = data[index].type;
            var id = index;
            var stem = data[index].stem;
            var analytic = data[index].analytic;
            var knowledge = data[index].knowledge;
            var audio = data[index].audio;
            var options = data[index].options;
            var material_content = data[index].material_content;
            var optionStr = ``;
            var knowledgeStr = ``;
            var audioStemStr = ``;
            var audioAnalyticStr = ``;
            var materialContentStr = ``;
            if (material_content) {
                materialContentStr += `<div class="material_content">材料：${material_content}</div>`;
            }
            for (var i in audio) {
                var audioStem = audio[i].stem;
                var audioAnalytic = audio[i].analytic;
                audioStemStr += `<span><audio src=${audioStem}></audio></span>`;

                audioAnalyticStr += `<div><audio src=${audioAnalytic}></audio></div>`;
            }
            for (var i in knowledge) {
                var knowledgeId = knowledge[i].id;
                var knowledgeName = knowledge[i].name;
                knowledgeStr += ` <div class="knowledge">知识点：<span>${knowledgeId}.  </span><span>${knowledgeName}</span></div>`;
            }
            //填空
            if (type == 1) {
                var analyticStr = ``;
                if (analytic) {
                    analyticStr = `<div class="analytic"><div>解析：${analytic}</div>${audioAnalyticStr}</div>`;
                }

                contentStr = `<li> <div class="item-content"><span>${id}. </span><span>${stem}</span> ${audioStemStr}</div>${analyticStr}${knowledgeStr}${materialContentStr}</li>`;



                $('#fill-in-the-blanks>ul').append(contentStr);
            }
            //选择
            if (type == 2) {

                var options = data[index].option;
                var analyticStr = ``;
                if (analytic) {
                    analyticStr = `<div class="analytic"><div>解析：${analytic}</div>${audioAnalyticStr}</div>`;
                }
                for (var i = 0; i < options.length; i++) {
                    var content = options[i].content;
                    var is_right = options[i].is_right;
                    var label = options[i].label;

                    optionStr += `<div class="options"><span>${label}. </span><span is_right=${is_right}>${content}</span><br></div>`;
                }



                contentStr = `<li> <div class="item-content"><span>${id}. </span><span>${stem}</span> ${audioStemStr}</div>${optionStr}${analyticStr}${knowledgeStr}${materialContentStr}</li>`;



                $('#choice-question>ul').append(contentStr);

            }

            //解答
            if (type == 3) {
                var analyticStr = ``;
                if (analytic) {
                    analyticStr = `<div class="analytic"><div>解析：${analytic}</div>${audioAnalyticStr}</div>`;
                }


                contentStr = `<li> <div class="item-content"><span>${id}. </span><span>${stem}</span> ${audioStemStr}</div>${analyticStr}${knowledgeStr}${materialContentStr}</li>`;



                $('#calculation-questions>ul').append(contentStr);
            }

            //语音测评
            if (type == 4) {
                var analyticStr = ``;
                if (analytic) {
                    analyticStr = `<div class="analytic"><div>解析：${analytic}</div>${audioAnalyticStr}</div>`;
                }

                contentStr = `<li> <div class="item-content"><span>${id}. </span><span>${stem}</span> ${audioStemStr}</div>${analyticStr}${knowledgeStr}${materialContentStr}</li>`;


                $('#speech-evaluation>ul').append(contentStr);

                // console.log(audio)

            }

        }

        if (res.code == -1) {
            var errorMsg = res.message;
            alert(errorMsg);
        }
    },
    error: function (err) {

        console.log(err)
    },

});
// ***************************************************************************************************//
//获取服务端图片url
var imgUrl = $(document).find("img").attr("src");
//将图片转为 base64
function getBase64Image(img) {
    img.crossOrigin = 'Anonymous';
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    img.onload = function() {
        ctx.drawImage(img, 0, 0, img.width, img.height); 
    }


// 将canvas的透明背景设置成白色
// var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// for (var i = 0; i < imageData.data.length; i += 4) {
//     // 当该像素是透明的，则设置成白色
//     if (imageData.data[i + 3] == 0) {
//         imageData.data[i] = 255;
//         imageData.data[i + 1] = 255;
//         imageData.data[i + 2] = 255;
//         imageData.data[i + 3] = 255;
//     }
// }
// ctx.putImageData(imageData, 0, 0);


    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;

}

//递归将要转换的节点中的所有图片的src全部转为base64
var s = 0;
// image2base64(s);
function image2base64() {
    var image = new Image();
    image.setAttribute("crossOrigin", 'Anonymous');
    image.src = $("#content img").eq(s).attr('src');
    // console.log(image.src);
    image.onload = function () {
        var base64 = getBase64Image(image);
        $("#content img").eq(s).attr('src', base64);
        s++;
        if (s < $("#content img").length) {
            image2base64();
        }
    }
}


// ***************************************************************************************************//
//下载生成PDF
var downPdf = document.getElementById("renderPdf");
downPdf.onclick = function () {
    $('#renderPdf').css('display', "none");
    html2canvas(document.body, {
        // allowTaint: false,
        useCORS: true,
        taintTest: true,
        logging: true,

        onrendered: function (canvas) {
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;
            //一页pdf显示html页面生成的canvas高度;
            var pageHeight = contentWidth / 592.28 * 841.89;
            //未生成pdf的html页面高度
            var leftHeight = contentHeight;
            //pdf页面偏移
            var position = 0;
            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            var imgWidth = 595.28;
            var imgHeight = 592.28 / contentWidth * contentHeight;
            // var pageData = canvas.toDataURL('image/jpeg', 1.0);
            var pageData = canvas.toDataURL("image/JPEG").replace("image/JPEG", "image/octet-stream"); // 获取生成的图片的url
            // console.log(pageData)

            var pdf = new jsPDF('', 'pt', 'a4');

            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            //当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
            } else {
                while (leftHeight > 0) {
                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight;
                    position -= 841.89;
                    //避免添加空白页
                    if (leftHeight > 0) {
                        pdf.addPage();
                    }
                }
            }

            pdf.save('content.pdf');
        }
    });

    setTimeout(function () {
        $('#renderPdf').css('display', "block");
    }, 2000)

}
