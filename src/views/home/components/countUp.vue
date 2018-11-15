<template>
    <div>
        <p :class="className" :style="{textAlign: 'center', color: color, fontSize: countSize, fontWeight: countWeight}"><span v-cloak :id="idName">{{ startVal }}</span><span>{{ unit }}</span></p>
        <slot name="intro"></slot>
    </div>
</template>

<script>
import CountUp from 'countup';

function transformValue (val) {
    let endVal = 0;
    endVal = val;
    return {
        val: endVal,
        unit: ''
    };
}

export default {
    data () {
        return {
            unit: '',
            demo: {}
        };
    },
    name: 'countUp',
    props: {
        idName: String,
        className: String,
        startVal: {
            type: Number,
            default: 0
        },
        endVal: {
            type: Number,
            required: true
        },
        decimals: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 2
        },
        delay: {
            type: Number,
            default: 500
        },
        options: {
            type: Object,
            default: () => {
                return {
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    decimal: '.'
                };
            }
        },
        color: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        introText: [String, Number]
    },
    mounted () {
        this.$nextTick(() => {
            setTimeout(() => {
                let res = transformValue(this.endVal);
                let decimals = this.decimals;
                if(this.idName==='money_count'){
                	decimals = 2;
                }
                let endVal = res.val;
                this.unit = res.unit;
                this.demo = new CountUp(this.idName, this.startVal, endVal, decimals, this.duration, this.options);
	            if (!this.demo.error) {
	                this.demo.start();
	            }
            }, this.delay);
        });
    },
    watch: {
        endVal (val) {
            let res = transformValue(val);
            let endVal = res.val;
            this.unit = res.unit;
         
          	let decimals = this.decimals;
	        if(this.idName==='money_count'){
	        	decimals = 2;
	        }
            this.demo = new CountUp(this.idName, this.startVal, endVal, decimals, this.duration, this.options);
            if (!this.demo.error) {
                this.demo.start();
            }
           	this.demo.update(val);
        }
    }
};
</script>
