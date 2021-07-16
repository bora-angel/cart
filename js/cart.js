$(document).ready(() => {

    class PdMake {

        constructor(name, price) {
            this.name = name;
            //제품 이미지를 담을 배열
            this.pdImg = [];
            //동그라미 버튼을 누르면 이미지 바뀌게 할 때 쓰는 버튼 아이디를 모은 배열
            this.imgCircle = ["cirOne", "cirTwo", "cirThr"];
            //가격 원데이터
            this.price = price;
            this.commaPrice = price;
        }

        pdPriceSetting() {
            $('#pdPrice').html(this.commaPrice + '<span>원</span>');
        }

        firstSettingPrice() {
            $("#totalPrice").text(this.commaPrice + '원');
            $("#productCount").val(1);
        }

        //000 , 정규식
        commaSetting() {
            this.commaPrice = String(this.commaPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        listClickEvent() {
            const clickPrice = this.price;
            let tmpPrice;
            let i = 1;
            //제품 수량 증가 감소 버튼 클릭 이벤트
            $("a").on("click", function () {

                switch (event.target.id) {
                    case "countPlusBtn": //플러스 버튼
                        $("#pdSelect").nextAll().css({display:"none"});
                        $("#productCount").val(++i);
                        tmpPrice = String(i * clickPrice).replace(/\B(?=(\d{3})+(?!\d))/g,",");
                        $("#totalPrice").text(tmpPrice + '원');
                        break
                    case "countMinusBtn": //마이너스 버튼 1 이하로 내려가지 않게 함.
                        $("#pdSelect").nextAll().css({display:"none"});
                        --i;
                        if (i <= 1) {
                            i = 1;
                        }
                        $("#productCount").val(i);
                        $("#totalPrice").text(i * clickPrice + '원');
                        break
                }
            });
        }

        //제품 옵션에서 선택한 항목이 제일 위칸에 적용되게 한다.
        selectTop() {
            $(".pdOption li").on("click", () => {
                $("#pdSelect i").removeClass();
                $("#pdSelect i").addClass("fas fa-angle-up")
                const rightArrow = '<i id="selectDown" class="fas fa-angle-down">';
                switch (event.currentTarget.id) {
                    case 'firstSelect':
                        $("#pdSelect").html($("#firstSelect").html() + rightArrow);
                        break
                    case 'secondSelect':
                        $("#pdSelect").html($("#secondSelect").html() + rightArrow);
                        break
                }
            })
        }
        
        defaultTop(){
            $("#pdSelect").html($("#firstSelect").html() + '<i id="selectDown" class="fas fa-angle-down">');
        }

        //제품 이미지 배열 생성
        imgMake() {
            //해당 제품의 이미지를 제품이미지파일배열에 넣어주는 반복문
            let i = 0;
            while (i < 3) {
                let tmpImg = "img/" + this.name + i + ".jpg";
                this.pdImg.push(tmpImg);
                i++;
            }
            $("#productImg").attr("src", this.pdImg[0]);

        }
        
        //제품 이미지 하단 버튼 메소드?
        cirImg() {
            const CirImgOne = this.pdImg[0];
            const CirImgTwo = this.pdImg[1];
            const CirImgThr = this.pdImg[2];

            $("a").on("click", function () {
                // a태그를 가져오고 a가 클릭되면 하나씩 매칭해서 차례로 나오게 한다.
                switch (event.target.id) {
                    //제품 이미지 밑의 작은 원 클릭시
                    case "cirOne":
                        $("#productImg").attr("src", CirImgOne);
                        break
                    case "cirTwo":
                        $("#productImg").attr("src", CirImgTwo);
                        break
                    case "cirThr":
                        $("#productImg").attr("src", CirImgThr);
                        break
                }
            });
        }

        totalMakePd() {
            this.commaSetting();
            this.imgMake();
            this.cirImg();
            this.selectTop();
            this.pdPriceSetting();
            this.firstSettingPrice();
            this.listClickEvent();
        }
    }

    const lipAmy = new PdMake("amy", 45000);
    const lipCoral = new PdMake("coral", 25000);
    let j = 0;
    let k = 0;
    let tmpTotalV = 0;
    let replTotalV = 0;

    lipAmy.totalMakePd();
    lipAmy.defaultTop();
    $(".modalBottom").hide();
    $(".modalPofol").hide();

    // 구매하기 버튼 모달
    $(".modalPofolClose,#basketProduct,#buyProduct").on("click",()=>{
        $(".modalPofol").toggle();
        event.preventDefault();
        return false;
    });

    //장바구니 추가 클로저
    function basketFnc(timesArg , number){
        k=0;
        let innerBasketFnc =() => {
            basName = $("#pdSelect").text();
            basCount = $("#productCount").val();
            (number)&&(k=number);
            ($("#pdSelect").text()) == ($("#firstSelect").text())&&(basPrice=lipAmy.price)&&lipAmy.listClickEvent();
            ($("#pdSelect").text()) == ($("#secondSelect").text())&&(basPrice=lipCoral.price)&&lipCoral.listClickEvent();
            let onePara = '<ul class="pdBasket delRemove'+k+'"><li class="basketName">'+basName+'</li><li class="basketCount"><input type="text" class="inBasCount" value="'+basCount+'" disabled></li><li class="basketPrice'+k+'">';
            let twoPara = (basCount * basPrice)+'<span>원</span></li><li><a><i class="fas fa-times-circle inTimesBtn'+k+' delBtn"></i></a></li></ul>';
            $(".modalForm").append(onePara+twoPara);
            
            k++;
        }
        return innerBasketFnc;
    }
    let basketHandler = basketFnc();

    //장바구니 삭제 버튼
    $(document).on("click",'.delBtn',()=>{
        let delArr = (event.target.classList);
        delArr =$.isNumeric(delArr[2].slice(-2));
        !(delArr)&&(delArr =(event.target.classList[2].slice(-1)))||(delArr =(event.target.classList[2].slice(-2)));
        let delMinusWon = ($('.basketPrice'+delArr).text()).slice(0,-1);
        delMinusWon = delMinusWon.replace(/,/g, '');
        let delTotal = parseInt($('.basketTotal').text().replace(/,/g, ''));
        let replDelTotal = String(delTotal-delMinusWon).replace(/\B(?=(\d{3})+(?!\d))/g,",");
        $('.basketTotal').text(replDelTotal);
        $(".delRemove"+delArr).remove();
    });

    //장바구니 모달
    $("#inputBasket").on("click",()=>{
        event.preventDefault();
        $("#pdSelect").nextAll().css({display:"none"});
        $(".modalBottom").show();
        basketHandler();
        ($("#pdSelect").text()) == ($("#firstSelect").text())&&(lipAmy.firstSettingPrice());
        ($("#pdSelect").text()) == ($("#secondSelect").text())&&(lipCoral.firstSettingPrice());
        let noCommaPrice = $('.basketPrice'+j).text().replace(/,/g, '');
        ($('.basketTotal').text() == 0 )&& (tmpTotalV = 0);
        tmpTotalV = parseInt(noCommaPrice.slice(0,-1)) + parseInt(tmpTotalV);
        let commaBasketPrice = ($('.basketPrice'+j).text()).replace(/\B(?=(\d{3})+(?!\d))/g,",");
        $('.basketPrice'+j).text(commaBasketPrice);
        replTotalV = String(tmpTotalV).replace(/\B(?=(\d{3})+(?!\d))/g,",");
        $('.basketTotal').text(replTotalV);
        j++;
        return false;
    })
    
    //상단 장바구니 메뉴 아이콘
    $(".menuA,#timesBtn").on("click",()=>{
        event.preventDefault();
        $(".modalBottom").toggle();
        return false;
    });

    // 제품 옵션 선택 토글
    $("#pdSelect").on("click", function () {
        $("#pdSelect").nextAll().toggle();
        $(".modalBottom").css({display:"none"});
    });

    //제품 옵션 선택 목록 클릭시
    $("li").on("click", function () {
        switch (event.target.id) {
            //제품  종류선택시
            case "firstSelect":
                lipAmy.totalMakePd();
                $("#pdSelect").nextAll().css({
                    display: "none"
                });
                break
            case "secondSelect":
                lipCoral.totalMakePd();
                $("#pdSelect").nextAll().css({
                    display: "none"
                });
                break
        }
    });

    //이미지 밑 원 버튼 호버시 클래스 변경 이벤트
    function circleOver(targetOver) {
        $(targetOver).removeClass();
        $(targetOver).addClass("fas fa-circle");
    }

    function circleLeave(targetLeave) {
        $(targetLeave).removeClass();
        $(targetLeave).addClass("far fa-circle");
    }
    $(".circleBox i").hover(() => {
        switch (event.target.id) {
            case "cirOne":
                circleOver("#cirOne")
                break
            case "cirTwo":
                circleOver("#cirTwo")
                break
            case "cirThr":
                circleOver("#cirThr")
                break
        }
    }, () => {
        switch (event.target.id) {
            case "cirOne":
                circleLeave("#cirOne")
                break
            case "cirTwo":
                circleLeave("#cirTwo")
                break
            case "cirThr":
                circleLeave("#cirThr")
                break
        }
    });

})