// initialize
enchant();

// global
var core;
var scene_no;
var cur_scene;
var storage_data;

// const
var SCREEN_WIDTH = 960;
var SCREEN_HEIGHT = 640;

var HAI_WIDTH = 48;
var HAI_HEIGHT = 72;

var BTN_WIDTH = 150;
var BTN_HEIGHT = 50;

var SCENE_TITLE_INI = 11;
var SCENE_TITLE = 12;
var SCENE_GAME_INI = 21;
var SCENE_GAME = 22;
var SCENE_GAME_RESULT = 23;
var SCENE_RANKING_INI = 31;
var SCENE_RANKING = 32;

var TIME_LIMIT = 30;
var OTETSUKI_TIME = 3;
var COMBO_TIME = 5;
var BONUS_TIME = 5;

var TYPE_S = 0;
var TYPE_P = 1;
var TYPE_M = 2;
var TYPE_J = 3;
var S1 = 1;
var S2 = 2;
var S3 = 3;
var S4 = 4;
var S5 = 5;
var S6 = 6;
var S7 = 7;
var S8 = 8;
var S9 = 9;
var P1 = 11;
var P2 = 12;
var P3 = 13;
var P4 = 14;
var P5 = 15;
var P6 = 16;
var P7 = 17;
var P8 = 18;
var P9 = 19;
var M1 = 21;
var M2 = 22;
var M3 = 23;
var M4 = 24;
var M5 = 25;
var M6 = 26;
var M7 = 27;
var M8 = 28;
var M9 = 29;
var TON = 31;
var NAN = 32;
var SHA = 33;
var PEI = 34;
var HAK = 35;
var HAT = 36;
var CHU = 37;
var URA = 38;

var FONT = 'HG行書体';
var STORATGE_KEY = 'mj_trial_data';
var RANKING_DATA_LIMIT = 15;

var getType = function(hai_no) {
    return Math.floor(hai_no / 10);
}

var getNum = function(hai_no) {
    if (getType(hai_no) != TYPE_J) {
        return hai_no % 10;
    } else {
        return 0;
    }
}

/**
 * ロード
 */
window.onload = function()
{
    core = new Core(SCREEN_WIDTH, SCREEN_HEIGHT);
    core.preload([
      'img/mahjong01.png',
      'img/top.png',
      'img/start.png',
      'img/ranking.png',
      'img/answer.png',
      'img/no_answer.png',
    ]);

    scene_no = SCENE_TITLE_INI;
    if (window.localStorage.getItem(STORATGE_KEY)) {
//        console.log('load storage');
        storage_data = JSON.parse(window.localStorage.getItem(STORATGE_KEY));

    } else {
//        console.log('init storage');
        storage_data = {};
    }
//    console.log(storage_data);

    core.onload = function() {
        this.on('enterframe', function() {
//            console.log(scene_no);
            switch (scene_no) {
                case SCENE_TITLE_INI:
                    var title_scene = new TitleScene();
                    core.replaceScene(title_scene);
                    cur_scene = title_scene;
                    break;

                case SCENE_TITLE:
                    break;

                case SCENE_GAME_INI:
                    var game_scene = new GameScene();
                    core.replaceScene(game_scene);
                    cur_scene = game_scene;
                    break;

                case SCENE_GAME:
                    cur_scene.main();
                    break;

                case SCENE_GAME_RESULT:
                    cur_scene.on('touchend', function() {
                        scene_no = SCENE_RANKING_INI;
                    });
                    break;

                case SCENE_RANKING_INI:
                    var ranking_scene = new RankingScene();
                    core.replaceScene(ranking_scene);
                    cur_scene = ranking_scene;
                    break;

                case SCENE_RANKING:
                    break;
            }

        });
    };
    core.start();
};

/**
 * TitleScene
 */
var TitleScene = Class.create(Scene, {
    // コンストラクタ
    initialize: function() {
        Scene.call(this);
        // 背景
        this.backgroundColor = 'green';

        var start_bt = new Sprite(BTN_WIDTH, BTN_HEIGHT);
        start_bt.image = core.assets['img/start.png'];
        start_bt.x = SCREEN_WIDTH / 2 - BTN_WIDTH - 10;
        start_bt.y = 400;
        start_bt.on('touchend', function() {
            scene_no = SCENE_GAME_INI;
        });
        this.addChild(start_bt);
        var rank_bt = new Sprite(BTN_WIDTH, BTN_HEIGHT);
        rank_bt.image = core.assets['img/ranking.png'];
        rank_bt.x = SCREEN_WIDTH / 2 + 10;;
        rank_bt.y = 400;
        rank_bt.on('touchend', function() {
            scene_no = SCENE_RANKING_INI;
        });
        this.addChild(rank_bt);

        // 次のシーン
        scene_no = SCENE_TITLE;
    },
});

/**
 * RankingScene
 */
var RankingScene = Class.create(Scene, {
    // コンストラクタ
    initialize: function() {
        Scene.call(this);
        // 背景
        this.backgroundColor = 'green';

        var top_bt = new Sprite(BTN_WIDTH, BTN_HEIGHT);
        top_bt.image = core.assets['img/top.png'];
        top_bt.x = (SCREEN_WIDTH - BTN_WIDTH) / 2;
        top_bt.y = 550;
        top_bt.on('touchend', function() {
            scene_no = SCENE_TITLE_INI;
        });
        this.addChild(top_bt);

        for (var i in storage_data['ranking_data']) {
            var o_l = new Label(storage_data['ranking_data'][i]['order'] + '位');
            o_l.x = 100;
            o_l.y = 20 + i * 25;
            o_l.font = '30px ' + FONT;
            this.addChild(o_l);
            var s_l = new Label(storage_data['ranking_data'][i]['score'] + '点');
            s_l.x = 300;
            s_l.y = 20 + i * 25;
            s_l.font = '30px ' + FONT;
            this.addChild(s_l);
            var d_l = new Label(storage_data['ranking_data'][i]['date']);
            d_l.x = 500;
            d_l.y = 20 + i * 25;
            d_l.font = '30px ' + FONT;
            this.addChild(d_l);
        }
        scene_no = SCENE_RANKING;
    },
});

/**
 * GameScene
 */
var GameScene = Class.create(Scene, {
    // コンストラクタ
    initialize: function() {
        Scene.call(this);
        this.backgroundColor = 'green';

        this.limit_age = TIME_LIMIT * core.fps + this.age;
        this.limit_combo = 0;
        this.combo_count = 0;
        this.otestuski_combo_count = 0;

        this.score = 0;

        this.info_label_1 = new Label('待ち牌を答えよ！');
        this.info_label_1.x = SCREEN_WIDTH / 2 - 100;
        this.info_label_1.y = 330;
        this.info_label_1.font = '30px ' + FONT;
        this.addChild(this.info_label_1);

        // タイマー
        this.time_label = new Label('時間 : ' + TIME_LIMIT + '秒');
        this.time_label.x = SCREEN_WIDTH - 200;
        this.time_label.y = 10;
        this.time_label.font = '30px ' + FONT;
        this.addChild(this.time_label);

        // スコア
        this.score_label = new Label('得点 : ' + this.score);
        this.score_label.x = SCREEN_WIDTH - 200;
        this.score_label.y = 50;
        this.score_label.font = '30px ' + FONT;
        this.addChild(this.score_label);

        // 選択肢
        this.selection = [];
        var wk = [
            M1,M2,M3,M4,M5,M6,M7,M8,M9,
        ];
        var base_x = (SCREEN_WIDTH - (13 * HAI_WIDTH)) / 2
        for (var i in wk) {
            var h = new Hai(wk[i]);
            h.x = base_x + i * HAI_WIDTH;
            h.y = 420;
            h.enable();
            this.selection.push(h);
            this.addChild(h);
        }
        this.no_answer_bt = new Sprite(BTN_WIDTH, BTN_HEIGHT);
        this.no_answer_bt.image = core.assets['img/no_answer.png'];
        this.no_answer_bt.x = 620;
        this.no_answer_bt.y = 400;
        this.no_answer_bt.on('touchend', function() {
            if (this.scene) {
                for (var i in this.scene.selection) {
                    this.scene.reset_selection();
                }
            }
        });
        this.addChild(this.no_answer_bt);
        this.answer_bt = new Sprite(BTN_WIDTH, BTN_HEIGHT);
        this.answer_bt.image = core.assets['img/answer.png'];
        this.answer_bt.x = 620;
        this.answer_bt.y = 460;
        this.answer_bt.on('touchend', function() {
            if (this.scene) {
                this.scene.answer();
            }
        });
        this.addChild(this.answer_bt);

        // 出題
        this.make_quiz();

        scene_no = SCENE_GAME;
    },

    main : function() {
        // タイマー
        if (this.limit_age - this.age > 0) {
            this.time_label.text = '時間 : ' + (Math.ceil((this.limit_age - this.age) / core.fps)) + '秒';
        } else {
            this.time_label.text = '時間 : ' + 0;
            this.reset_selection();
            this.removeChild(this.no_answer_bt);
            this.removeChild(this.answer_bt);
            for (var i in this.selection) {
                this.selection[i].disable();
            }
            this.info_label_1.text = '終了';
            this.info_label_1.font = '50px ' + FONT;

            // スコア1以上の場合ランキング
            if (this.score > 0) {
                //今日の日付データを変数hidukeに格納
                var today = new Date();

                //年・月・日・曜日を取得する
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate();
                var hour = today.getHours();
                var minute = today.getMinutes();
                var second = today.getSeconds();
                var date_str = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;

                var ranking_data = {
                    'date' : date_str,
                    'score' : this.score,
                };

                if (storage_data['ranking_data'] && storage_data['ranking_data'].length > 0) {
                    var new_ranking_data = [];
                    var chk_flag = false;
                    for (var i in storage_data['ranking_data']) {
                        if (new_ranking_data.length >= RANKING_DATA_LIMIT) {
                            break;
                        }

                        if (chk_flag == false && storage_data['ranking_data'][i]['score'] < ranking_data.score) {
                            new_ranking_data.push(ranking_data);
                            chk_flag = true;
                        }
                        if (new_ranking_data.length >= RANKING_DATA_LIMIT) {
                            break;
                        }

                        new_ranking_data.push(storage_data['ranking_data'][i]);
                    }
                    if (chk_flag == false && new_ranking_data.length < RANKING_DATA_LIMIT) {
                        new_ranking_data.push(ranking_data);
                    }

                    storage_data['ranking_data'] = new_ranking_data;

                    var order = 1;
                    for (var i in storage_data['ranking_data']) {
                        storage_data['ranking_data'][i]['order'] = order++;
                    }

                } else {
                    storage_data['ranking_data'] = [];
                    ranking_data.order = 1;
                    storage_data['ranking_data'].push(ranking_data);
                }
                console.log('save');
                console.log(storage_data);
                console.log(JSON.stringify(storage_data));
                window.localStorage.setItem(STORATGE_KEY, JSON.stringify(storage_data));
            }

            scene_no = SCENE_GAME_RESULT;
        }
    },

    reset_selection : function() {
        for (var i in this.selection) {
            this.selection[i].unselect();
        }
    },

    // 出題
    make_quiz : function() {
        for (var i in this.question) {
            this.removeChild(this.question[i]);
        }

        this.question = [];
        var maisu = 4;
        var wk = [
          M1,M2,M3,M4,M5,M6,M7,M8,M9,
        ];

        for (var i = 1; i <= maisu; i++) {
            for (var j = 0; j < wk.length; j++) {
                var h = new Hai(wk[j]);
                h.disable();
                this.question.push(h);
            }
        }
        // ランダムソート
        this.question.sort(function() {
            return Math.random() - 0.5;
        });
        this.question = this.question.slice(0, 13);

        // 理牌
        for (var i = 0; i < this.question.length - 1; i++) {
            for (var j = i + 1; j < this.question.length; j++) {
                if (this.question[i].hai_no > this.question[j].hai_no) {
                    var tmp = this.question[i].hai_no;
                    this.question[i].setHaiNo(this.question[j].hai_no);
                    this.question[j].setHaiNo(tmp);
                }
            }
        }

        // 得点によって理牌を崩す
        var shuffle_count = this.shuffle_count(this.score);
        // console.log(shuffle_count)
        for (var i = 0; i < shuffle_count; i++) {
            var j = Math.floor(Math.random() * this.question.length);
            var k = Math.floor(Math.random() * this.question.length);
            if (j == k) {
                continue;
            }
            var tmp = this.question[j].hai_no;
            this.question[j].setHaiNo(this.question[k].hai_no);
            this.question[k].setHaiNo(tmp);
        }

        var base_x = (SCREEN_WIDTH - (this.question.length * HAI_WIDTH)) / 2
        for (var i in this.question) {
            this.question[i].x = base_x + i * HAI_WIDTH;
            this.question[i].y = 200;
            this.addChild(this.question[i]);
        }
    },

    shuffle_count : function(score) {
        span = 10;
        ret = Math.floor(score / span)
        if (ret < 0) {
            ret = 0;
        } else if (ret > 10) {
            ret = 10;
        }

        return ret;
    },

    answer : function() {
        // 回答内容
        var select_hai_no_array = [];
        for (var i in this.selection) {
            if (this.selection[i].select_flag) {
                select_hai_no_array.push(this.selection[i].hai_no)
            }
        }

        // 答え
        var answer_hai_no_array = [];
        var hai_no_array = [M1,M2,M3,M4,M5,M6,M7,M8,M9];

        for (var i in hai_no_array) {
            var tehai_array = [];
            for (var j in this.question) {
                tehai_array.push(this.question[j].hai_no);
            }
            tehai_array.push(hai_no_array[i]);

            // 待ち牌を追加
            if (this.is_agari(tehai_array)) {
                answer_hai_no_array.push(hai_no_array[i]);
            }
        }

        // 答え合わせ
        var chk_flag = true;
        if (select_hai_no_array.length == answer_hai_no_array.length) {
            for ( var i in select_hai_no_array) {
                if (select_hai_no_array[i] != answer_hai_no_array[i]) {
                    chk_flag = false;
                }
            }
        } else {
            chk_flag = false;
        }


        if (chk_flag) {
            this.seikai();
        } else {
            this.otestuski(answer_hai_no_array);
            console.log(this.answer_str(answer_hai_no_array));
        }

    },

    seikai : function() {
        this.removeChild(this.seikai_label);
        this.seikai_label = new Label('正解！！');
        this.seikai_label.x = 300;
        this.seikai_label.y = 500;
        this.seikai_label.color = 'blue';
        this.seikai_label.font = '50px ' + FONT;
        this.seikai_label.on('enterframe', function() {
            if (this.age == COMBO_TIME * core.fps) {
                this.scene.removeChild(this);
            }
        });
        this.addChild(this.seikai_label);

        var bonus_time = BONUS_TIME;
        if (this.limit_combo >= this.age && this.combo_count > 0) {
            bonus_time += this.combo_count;
            this.combo_count++;

            // コンボ
            this.removeChild(this.combo_label);
            this.combo_label = new Label(this.combo_count + '連続');
            this.combo_label.x = SCREEN_WIDTH - 500;
            this.combo_label.y = 550;
            this.combo_label.color = 'blue';
            this.combo_label.font = '30px ' + FONT;
            this.combo_label.on('enterframe', function() {
                this.opacity = (1 - this.age / core.fps / COMBO_TIME);
                if (this.age == COMBO_TIME * core.fps) {
                    this.scene.removeChild(this);
                }
            });
            this.addChild(this.combo_label);

        } else {
            this.combo_count = 1;
        }
        this.otestuski_combo_count = 0

        // タイムボーナス
        this.removeChild(this.bonus_label);
        this.bonus_label = new Label('+' + bonus_time + '秒');
        this.bonus_label.x = SCREEN_WIDTH - 60;
        this.bonus_label.y = 35;
        this.bonus_label.color = 'blue';
        this.bonus_label.font = '20px ' + FONT;
        this.bonus_label.on('enterframe', function() {
            this.opacity = (1 - this.age / core.fps);
            if (this.age == 1 * core.fps) {
                this.scene.removeChild(this);
            }
        });
        this.addChild(this.bonus_label);

        this.limit_age += bonus_time * core.fps;
        this.limit_combo = this.age + COMBO_TIME * core.fps;

        this.score++;
        this.score_label.text = '得点 : ' + this.score;
        this.reset_selection();

        this.tl.cue({
            1 : function(){
                this.all_huse(this.question, 1);
            },
            5 : function(){
                this.make_quiz();
            },
        });
    },

    otestuski : function(answer_hai_no_array) {
        this.otestuski_combo_count++;
        this.combo_count = 0;

        this.reset_selection();
        for (var i in this.selection) {
            this.selection[i].disable();
        }
        this.no_answer_bt.visible = false;
        this.answer_bt.visible = false;

        this.removeChild(this.seikai_label);
        var otetsuki_message = ''
        if (this.otestuski_combo_count == 1) {
            otetsuki_message = this.hint_str(answer_hai_no_array)
        } else {
            otetsuki_message = this.answer_str(answer_hai_no_array)
        }

        var otetsuki_label = new Label(otetsuki_message);
        otetsuki_label.x = 300;
        otetsuki_label.y = 520;
        otetsuki_label.color = 'red';
        otetsuki_label.font = '25px ' + FONT;

        otetsuki_label.on('enterframe', function() {
            if (this.age == OTETSUKI_TIME * core.fps) {
                for (var i in this.scene.selection) {
                    this.scene.selection[i].enable();
                }
                this.scene.no_answer_bt.visible = true;
                this.scene.answer_bt.visible = true;
                this.scene.removeChild(this);
            }
        });
        this.addChild(otetsuki_label);
    },

    hint_str : function(answer_hai_no_array) {
        if (answer_hai_no_array.length == 0) {
            return 'ノーテンです';
        }

        // 待ちの数か待ちのうち1つ
        if (rand(2) == 1) {
            return `待ちの数は${answer_hai_no_array.length}個です`
        } else {
            return `待ちの1つは${getNum(answer_hai_no_array[Math.floor(Math.random() * answer_hai_no_array.length)])}萬です`
        }
    },

    answer_str : function(answer_hai_no_array) {
        if (answer_hai_no_array.length == 0) {
            return 'ノーテンです';
        }

        var ret = '';
        answer_hai_no_array.forEach(element => ret += getNum(element));
        ret += '萬待ちです';
        return ret;
    },

    summary_tehai : function(tehai_array) {
        var tmp = {};
        for (var i in tehai_array) {
            if (isNaN(tmp[tehai_array[i]])) {
                tmp[tehai_array[i]] = 1;
            } else {
                tmp[tehai_array[i]]++;
            }
        }
        return tmp;
    },

    is_agari : function(tehai_array) {

        // 頭チェック
        var tmp = this.summary_tehai(tehai_array);
        var atama_list = [];
        for (var key in tmp) {
            if (tmp[key] > 4) {
                return false;
            }
            if (tmp[key] > 1) {
                atama_list.push(key);
            }
        }
        if (atama_list.length == 0) {
            // あがれない
            return false;
        }

        if (atama_list.length == 7) {
            // あがれる
            return true;
        }

        // 面子チェック
        for (var index in atama_list) {
            for (var order = 1; order <= 2; order++) {
                var atama = atama_list[index];
                var tmp = this.summary_tehai(tehai_array);

                tmp[atama] -= 2;

                var break_flag = false;
                var kotsu = [];
                var shuntsu = [];

                for (var key in tmp) {
                    while (tmp[key] > 0) {
                        if (order == 1) {
                            // 刻子→順子
                            if (tmp[key] >= 3) {
                                // 刻子チェック
                                tmp[key] -= 3;
                                kotsu.push(key);
                            } else if (getType(key) != TYPE_J && tmp[Number(key)] > 0 && tmp[1 + Number(key)] > 0 && tmp[2 + Number(key)] > 0) {
                                // 字牌じゃない場合は順子チェック
                                tmp[key]--;
                                tmp[Number(key)+1]--;
                                tmp[Number(key)+2]--;
                                shuntsu.push(key);
                            } else {
                                // 刻子にも順子にもならない
                                break_flag = true;
                                break;
                            }
                        } else if (order == 2) {
                            // 順子→刻子
                            if (getType(key) != TYPE_J && tmp[Number(key)] > 0 && tmp[1 + Number(key)] > 0 && tmp[2 + Number(key)] > 0) {
                                // 字牌じゃない場合は順子チェック
                                tmp[key]--;
                                tmp[Number(key)+1]--;
                                tmp[Number(key)+2]--;
                                shuntsu.push(key);
                            } else if (tmp[key] >= 3) {
                                    // 刻子チェック
                                    tmp[key] -= 3;
                                    kotsu.push(key);
                            } else {
                                // 刻子にも順子にもならない
                                break_flag = true;
                                break;
                            }

                        }
                    }
                    if (break_flag) {
                        break;
                    }
                }

                // 4面子あればあがれる
                if (kotsu.length + shuntsu.length == 4) {
                    return true;
                }
            }
        }
        return false;
    },

    all_huse : function(tehai_array, f) {
        for (var i in tehai_array) {
            var cue = [];
            cue[f] = function() {this.huse();};
            tehai_array[i].tl.cue(cue);
        }
    },
});

/**
 * 牌オブジェクト
 */
var Hai = Class.create(Sprite, {
    initialize: function(hai_no) {
        Sprite.call(this, HAI_WIDTH, HAI_HEIGHT);
        this.image = core.assets['img/mahjong01.png'];
        this.setHaiNo(hai_no);
        this.select_flag = false;
        this.huse_flag = false;
        this.enable_flag = false;
        this.on('touchstart', this.select);
    },

    disable : function() {
        this.enable_flag = false;
    },

    enable : function() {
        this.enable_flag = true;
    },

    setHaiNo : function(hai_no) {
        this.hai_no = hai_no;
        this.type = Math.floor(hai_no / 10);
        this.no = hai_no % 10;
        this.disp();
    },

    disp : function() {
        if (this.huse_flag) {
            this.frame = 34;

        } else {
            this.frame = this.type * 9 + this.no - 1;
        }
    },

    huse : function() {
        this.huse_flag = !this.huse_flag;
        this.disp();
    },

    select : function (force_flag) {
        var force_flag = false | force_flag;
        if (this.enable_flag || force_flag) {
            this.select_flag = !this.select_flag;
            if (this.select_flag) {
                this.y -= 10;

            } else {
                this.y += 10;
            }
        }
    },

    unselect : function(){
        if (this.select_flag) {
            this.select(true);
        }
    },
});

/**
 * 乱数発生
 *
 * @param 乱数最大値
 * @returns 乱数
 */
function rand(n) {
    return Math.floor(Math.random() * (n+1));
}

