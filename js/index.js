
(function () {
})();
var vm;
var app = {
    el: "#app",
    data() {
        return {
            name: "2021YearOfTheOx",
            id: "",
            apiBaseUrl: "https://event.setn.com/ci",
            // apiBaseUrl: "http://127.0.0.1/public-api",
            winner: {
                "reward1": [],
                "reward2": [],
                "reward3": [],
                "reward4": []
            },
            eventNum: 1,
            eventNumAry: [
                "2021-2-2",
                "2021-2-3",
                "2021-2-4",
                "2021-2-5",
                "2021-2-6",
                "2021-2-7",
                "2021-2-8",
                "2021-2-9",
                "2021-2-10",
                "2021-2-11",
                "2021-2-12",
                "2021-2-13",
                "2021-2-14",
                "2021-2-15",
                "2021-2-16",
                "2021-2-17",
                "2021-2-18",
                "2021-2-19",
                "2021-2-20",
                "2021-2-21"
            ],
            user: {
                login: false,
                id: "",
                contact: 0,
                hasExtraInfo: [],
                token: "",
                hasAgreed: null,
                draw: false,
                reward: "",
                chose: -1,
                idError:false
            },
            news: {
                url:"",
                imageFile:"",
                imageID:"",
                shortSlug:""
            },
            cattleAryTemp:[0,0,0],
            cattleAry:[0,0,0],
            /* NOTICE | INSERT | WHERE | RESULT  */
            dialog: "",
            /* START | TURN | CHOSE | OPEN */
            dialogCup: "START",
            /* LOSE | WIN  */
            dialogDraw: "LOSE",
            bannerImage: "",
        };
    },
    created() {
        this.getWinner();
        this.getNews();
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        this.eventNum = this.eventNumAry.indexOf(date) >= 0 ? this.eventNumAry.indexOf(date)+1 :1;
    },
    computed: {
        cardImage() {
            if (this.user.reward == "林口亞昕福朋喜來登酒店傳統客房住宿招待卷含兩客早餐")
                return "images/resultPrize1.png";
            if (this.user.reward == "禾聯研磨式咖啡機(HCM-09C8)")
                return "images/resultPrize2.png";
            if (this.user.reward == "林口亞昕福朋喜來登酒店餐食消費抵用卷壹千元")
                return "images/resultPrize3.png";
            if (this.user.reward == "A'CHRON極緻尊榮空中SPA")
                return "images/resultPrize4.png";
        },
        cattleImage1() {
            if (this.cattleAry[0] == 0){
                return "images/cup.gif";
            }
            if (this.cattleAry[0] == 1){
                return "images/cattle1.gif";
            }
            if (this.cattleAry[0] == 2){
                return "images/cattle2.gif";
            }
            if (this.cattleAry[0] == 3){
                return "images/cattle3.gif";
            }
        },
        cattleImage2() {
            if (this.cattleAry[1] == 0){
                return "images/cup.gif";
            }
            if (this.cattleAry[1] == 1){
                return "images/cattle1.gif";
            }
            if (this.cattleAry[1] == 2){
                return "images/cattle2.gif";
            }
            if (this.cattleAry[1] == 3){
                return "images/cattle3.gif";
            }
        },
        cattleImage3() {
            if (this.cattleAry[2] == 0){
                return "images/cup.gif";
            }
            if (this.cattleAry[2] == 1){
                return "images/cattle1.gif";
            }
            if (this.cattleAry[2] == 2){
                return "images/cattle2.gif";
            }
            if (this.cattleAry[2] == 3){
                return "images/cattle3.gif";
            }
        },
    },
    methods: {
        /**
         *  畫面切換
         */
        toggleDialog: function (name) {
            this.dialog = this.dialog == name ? "" : name;
        },
        /**
         *  取得中獎資料
         */
        getWinner: function () {
            return axios({
                method: "GET",
                url: "winner.json",
            }).then(function (response) {
                vm.winner = response.data;
            }).catch(function (error) {
                console.error(error);
            });
        },
        /**
         *  取得專題資料
         */
        getNews: async function () {
            return axios({
                method: "GET",
                url: "https://webapi.setn.com/api/Project/GetProjectNewSList/8033/0",
            }).then(function (response) {
                vm.news = response.data[0].newsList[Math.floor(Math.random() * response.data[0].newsList.length)]
            }).catch(function (error) {
                console.error(error);
            });
        },
        /**
         *  遊戲重置
         */
        prestart: function () {
            this.toggleDialog("");
            this.user.chose = -1;
            this.cattleAry[0] = 0;
            this.cattleAry[1] = 0;
            this.cattleAry[2] = 0;
            this.dialogCup = "START";
            this.dialogDraw = "LOSE";
            if (this.user.id == "") {
                this.toggleDialog('INSERT')
            } else {
                this.start();
            }
        },
        /**
         * 重置轉盤、新聞
         */
        initCup: function () {
            this.getNews().then(function(){
                setTimeout(function () {
                    vm.dialogCup = 'TURN';
                }, 300);
                setTimeout(function () {
                    vm.dialogCup = "CHOSE";
                }, 2900);
            })
        },
        /**
         *  遊戲開始
         */
        start: function () {
            this.toggleDialog("");
            if (!register(this.user.id)) {
                this.user.id == "";
                this.toggleDialog("INSERT");
                animateCSS('.formText', 'headShake');
                animateCSS('.memberNum', 'headShake');
                this.user.idError = true;
                return false;
            }
            this.user.idError = false;
            this.postDraw();
            this.initCup();
            return false;
        },
        /**
         *  開杯子
         */
        result: function (e) {
            this.toggleDialog("")
            this.dialogCup = 'OPEN';
            var rand = Math.random()<0.5;
            this.cattleAry = [0,0,0];
            if(this.dialogDraw == "WIN"){
                this.cattleAry[e] = 1;
                for(i=0;i<=2;i++){
                    if(i == e){
                        this.cattleAryTemp[i] = this.cattleAry[e];
                    }else{
                        this.cattleAryTemp[i] = rand?2:3;
                        rand = !rand;
                    }
                }
            }else{
                if(rand){
                    this.cattleAry[e] = 3;
                    for(i=0;i<=2;i++){
                        if(i == e){
                            this.cattleAryTemp[i] = this.cattleAry[e];
                        }else{
                            this.cattleAryTemp[i] = rand?1:2;
                            rand = !rand;
                        }
                    }
                }else{
                    this.cattleAry[e] = 2;
                    for(i=0;i<=2;i++){
                        if(i == e){
                            this.cattleAryTemp[i] = this.cattleAry[e];
                        }else{
                            this.cattleAryTemp[i] = rand?3:1;
                            rand = !rand;
                        }
                    }
                }

            }
            setTimeout(function () {
                vm.cattleAry = vm.cattleAryTemp;
            }, 500);
            setTimeout(function () {
                vm.toggleDialog("RESULT");
            }, 2000);
        },
        /**
         * 抽獎
         */
        postDraw: function () {
            var form = new FormData();
            form.append("event", vm.name + vm.eventNum);
            form.append("member", vm.user.id);
            return axios({
                method: "post",
                url: vm.apiBaseUrl + "/lottery",
                data: form,
            }).then(function (response) {
                vm.user.reward = response.data;
                if (vm.user.reward == false) {
                    vm.DialogDraw = "LOSE";
                    return false;
                } else {
                    vm.dialogDraw = "WIN";
                    return false;
                }
            }).catch(function (error) {
                vm.DialogDraw = "LOSE";
            });
        },
        /**
         * 分享再玩
         */
        replay: function () {
            this.FacebookShare();
            this.dialogCup = "START";
            this.toggleDialog("");
        },
        FacebookShare: function () {
            facebookMe.target.refer = this.name;
            facebookMe.target.href = "https://acts.setn.com/event/" + this.name + "?utm_source=facebook";
            facebookMe.target.hashtag = "#我牛我任性";
            facebookMe.id = this.user.id
            facebookMe.share();
        }
    },
};
/**
 * 會員登入
 */
const register =  function (id) {
    var member = parseInt(id);
    member = isNaN(member)?0:member;
    member = (member-3)/3;
    var result = false;
    $.ajax({
        method: "GET",
        url: "https://event.setn.com/ci/User/memberId?number="+member,
        async : false,
        success: function (response) {
            result = response;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return result == 'true';
}
/**
 * 動畫效果
 *
 * @param {string} element
 * @param {string} animation
 * @param {string} prefix
 */
const animateCSS = (element, animation, prefix = "animate__") =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd() {
            node.classList.remove(`${prefix}animated`, animationName);
            resolve("Animation ended");
        }

        node.addEventListener("animationend", handleAnimationEnd, { once: true });
    });
