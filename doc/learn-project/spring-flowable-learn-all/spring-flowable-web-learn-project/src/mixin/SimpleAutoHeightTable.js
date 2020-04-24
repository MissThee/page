import { mapGetters } from 'vuex';

const SimpleAutoHeightTable = {
  //用于设置table的适应高度
  //使用方法：
  // 1、给页面中需要减去高度的组件，增加class值reduce-height-element
  // 2、引入当前js到mixin中
  // 3、tableAutoHeight则为自动计算的高度值，绑定给控件的style样式即可
  data() {
    return {
      tableAutoHeight: 0
    };
  },
  created() {
    this.setTableHeight(this.contentHeight);
  },
  watch: {
    contentHeight(val) {
      this.setTableHeight(val);
    },
    contentWidth() {
      this.setTableHeight(this.contentHeight);
    },
  },
  methods: {
    setTableHeight(val) {
      this.$nextTick(() => {
        let reduceHeight = 0;//记录需要减去的高度
        let reduceHeightElements = document.getElementsByClassName('reduce-height-element');
        for (let i = 0; i < reduceHeightElements.length; i++) {
          reduceHeight += reduceHeightElements[i].offsetHeight;
        }
        this.tableAutoHeight = val - reduceHeight;
      });
    },
  },
  computed: {
    ...mapGetters({
      contentHeight: 'getContentHeight',
      contentWidth: 'getContentWidth',
    }),
  },
};
export default SimpleAutoHeightTable;
