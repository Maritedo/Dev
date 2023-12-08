// 自动化的验证码
// 依赖迁移至library.js

// 渲染缓存
class CachedImage {
    width;
    height;
    /** @type {HTMLCanvasElement} */
    offscreenCvs;
    /** @type {CanvasRenderingContext2D} */
    context;
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    init() {
        this.offscreenCvs = document.createElement("canvas");
        this.context = this.offscreenCvs.getContext("2d");
        this.offscreenCvs.width = this.width;
        this.offscreenCvs.height = this.height;
        return this;
    }
    clear() {
        this.context.clearRect(this.width, this.height);
    }
    paint(_func) {
        _func(this.context);
    }
    render(_context, _x = 0, _y = 0) {
        _context.drawImage(this.offscreenCvs, _x, _y);
    }
}


class Verification {
    width; height;
    _fontW; _fontH;
    padding;
    /** @type {HTMLCanvasElement} */
    cvs;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    length;
    code;
    /** @type {{offset: float, angle: float, render: {fillStyle: string, font: string}, box: Array}} */
    data;

    constructor(_cs) {
        this.cvs = _cs;
    }

    init = () => {
        this.ctx = this.cvs.getContext("2d");
        this.length = eval(this.cvs.getAttribute('v-len')) || 4;
        this.height = (this.cvs.height = eval((this.cvs.getAttribute('v-size')) || 48));
        this.padding = this.height * 0.1 || eval(this.cvs.getAttribute('v-padding')) || 8;
        this._fontH = this.height - this.padding * 2;
        this._fontW = 0.6 * this._fontH;
        this.width = (this.cvs.width = ((this._fontW * this.length) + this.padding * 2));
        CanvasFix(this.cvs, true);
        return this;
    }

    refresh = () => {
        this.generate();
        this.draw();
        return this;
    }

    clear = () => {
        this.ctx.fillStyle = 'rgb(0,0,0)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        return this;
    }

    chars = "112233445566778899abcdefghijkmnrtuyzABDEFGHIJKLMNQRTVY";
    getRandomChar = () => {
        return this.chars[Math.round(Math.random() * (this.chars.length - 1))];
    }

    generate = () => {
        this.code = "";
        this.data = [];
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        for (var i = 0; i < this.length; i++) {
            var code_ch = this.getRandomChar();
            this.code += code_ch;
            this.data.push({
                offset: this.random.offset(),
                angle: this.random.angle(),
                render: {
                    fillStyle: this.random.color(),
                    font: `${~~this.random.size()}px ${this.random.font()}`,
                }
            });
            this.ctx.font = this.data[i].render.font;
            var measures = this.ctx.measureText(code_ch);
            this.data[i].box = [
                measures.actualBoundingBoxAscent,
                measures.actualBoundingBoxDescent,
                measures.actualBoundingBoxLeft,
                measures.actualBoundingBoxRight
            ];
        }
        return this;

    }
    draw = () => {
        this.clear();
        var curX = this.padding + 0.5 * this._fontW;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        for (var i = 0; i < this.length; i++) {
            Object.assign(this.ctx, this.data[i].render);
            var code_ch = this.code[i];
            var offsetPos = this.data[i].offset;
            var angle = this.data[i].angle;
            var top = this.data[i].box[0], bottom = this.data[i].box[1],
                left = this.data[i].box[2], right = this.data[i].box[3];
            let pol_ = Pol(curX + offsetPos[0], this.height / 2 + offsetPos[1]);
            var fixed = Rec(pol_[0], pol_[1] - angle);

            this.ctx.rotate(angle);
            this.ctx.fillText(
                code_ch,
                fixed[0] + (left - right) * 0.5,
                fixed[1] + (top - bottom) * 0.5
            );
            this.ctx.rotate(-angle);
            curX += this._fontW;
        }
    }
    random = {
        color: () => {
            const range = [0, 255]; //单个颜色值范围
            const _r = range[1] - range[0];
            var _vals = [];
            var _n = 0;
            while (_n < 3) {
                _vals.push(range[0] + Math.round(Math.random() * _r));
                _n++;
            }
            //为确保不会过暗，只需保证RGB值中最大值不小于某一值
            _vals[_vals[0] > _vals[1] ? (_vals[1] > _vals[2] ? 2 : 1) : (_vals[0] > _vals[2] ? 2 : 0)] = 255;
            return this.showDebug ?
                `rgba(${_vals[0]}, ${_vals[1]}, ${_vals[2]}, 0.7)` :
                `rgb(${_vals[0]}, ${_vals[1]}, ${_vals[2]})`;
        }, size: () => {
            return this._fontH * 1.0 * (1 + Math.random() / 5);
        }, angle: () => {
            return (2 * Math.random() - 1) * Math.PI / 12;
        }, offset: () => {
            const _p = 0.125;
            return [Math.random() * _p * this._fontW, Math.random() * _p * this._fontH];
        }, font: () => {
            const list_ = ['century', 'monaco', 'verdana', 'sans-serif', 'sans', 'copperplate'];
            return list_[Math.round(Math.random() * (list_.length - 1))]
        },
    }
}