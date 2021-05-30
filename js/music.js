/* 
    1.歌曲搜索接口
       1.1 请求地址：https//autumnfish.cn/search
        1.2 请求方法：get
        1.3 请求参数：keywords(查询关键字)
        1.4 响应内容：歌曲搜索结果
    2.歌曲url获取
        2.1 请求地址：https//autumnfish.cn/song/url
        2.2 请求方法：get
        2.3 请求参数：id(歌曲id)
        2.4 响应内容：歌曲的url的地址
    3.歌曲详情获取
        3.1 请求地址：https//autumnfish.cn/song/detail
        3.2 请求方法：get
        3.3 请求参数：ids(歌曲id)
        3.4 响应内容：歌曲详情(包括封面信息)
    4.热门评论获取
        4.1 请求地址：https//autumnfish.cn/comment/hot?type=0
        4.2 请求方法：get
        4.3 请求参数：id(歌曲id,地址中的type固定为0)
        4.4 响应内容：歌曲的热门评论
    5.mv地址获取
        5.1 请求地址：https//autumnfish.cn/mv/url
        5.2 请求方法：get
        5.3 请求参数：id(mvid,为0表示没有mv)
        5.4 响应内容：mv的地址
*/

// 设置axios的基地址
axios.defaults.baseURL = 'https://autumnfish.cn';

var app = new Vue({
    el: "#player",
    data: {
        //查询关键字
        query: "那年初夏",
        //歌曲数组
        musicList: [],
        //歌曲地址
        musicUrl: "",
        //歌曲封面
        musicCover: "",
        // 歌曲热门评论
        hotComments: [],
        // 是否正在播放
        isPlay: false,
        // 遮罩层的显示状态
        isShow: false,
        // mv地址
        mvUrl: ''
    },
	mounted:function(){
		this.searchMusic()
	},
    methods: {
        //歌曲搜索
        searchMusic: function () {
            var that = this;
            axios.get("/search?keywords=" + that.query)
            .then(
                function (response) {
                    // console.log(response);
                    // 保存内容
                    that.musicList = response.data.result.songs;
                    // console.log(response.data.result.songs)
                },
                function (err) {}
            )
        },
        //歌曲播放
        playMusic: function (musicId) {
            // console.log(musicId);
            var that = this;
            //获取歌曲地址
            axios.get("/song/url?id=" + musicId)
            .then(
                function (response) {
                    // console.log(response);
                    //保存歌曲url地址
                    that.musicUrl = response.data.data[0].url;
                },
                function (err) {})
            //歌曲详情获取
            axios.get("song/detail?ids=" + musicId)
            .then(
                function (response) {
                    console.log(response.data.songs[0].al.picUrl);
                    // 设置封面
                    that.musicCover = response.data.songs[0].al.picUrl;
                },
                function (err) {})
            //歌曲评论获取
            axios.get("/comment/hot?type=0&id=" + musicId)
            .then(
                function (response) {
                    // console.log(response);
                    // 保存热门评论
                    that.hotComments = response.data.hotComments;
                },
                function (err) {})

        },
        // audio的play事件
        play: function () {
		console.log("触发播放事件");
            this.isPlay = true;
        },
        // audio的pause事件
        pause: function () {
			console.log("触发播放暂停事件");
            this.isPlay = false;
        },
        // 播放mv
        playMv:function(vid) {
                var that=this;
                // 获取mv信息
                axios.get("/mv/url?id=" + vid)
                .then(
                    function(response ) {
                    console.log("消息："+response)
					console.log("数据："+response.data.data.url);
                    that.isShow=true;
                    // 获取mv地址
                    that.mvUrl = response.data.data.url;
					
                },
                function (err) {})
        },
        // 关闭mv界面
        hide:function() {
            this.isShow = false;
			this.$refs.vedio.pause();
            this.mvUrl="";
        },
    }
})