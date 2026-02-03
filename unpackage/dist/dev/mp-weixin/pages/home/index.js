"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.onShow(() => {
      var _a;
      const page = getCurrentPages().pop();
      const tabBar = (_a = page == null ? void 0 : page.getTabBar) == null ? void 0 : _a.call(page);
      if (typeof (tabBar == null ? void 0 : tabBar.setData) === "function") {
        tabBar.setData({
          selected: 0
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.p({
          name: "edit-pen",
          color: "#ffffff",
          size: "24"
        }),
        c: common_vendor.p({
          name: "calendar",
          color: "#ffffff",
          size: "26"
        }),
        d: common_vendor.p({
          name: "list",
          color: "#ffffff",
          size: "24"
        }),
        e: common_vendor.p({
          name: "checkbox-mark",
          color: "#ffffff",
          size: "24"
        }),
        f: common_vendor.p({
          name: "star",
          color: "#ffffff",
          size: "24"
        }),
        g: common_vendor.p({
          name: "play-right",
          color: "#ffffff",
          size: "24"
        }),
        h: common_vendor.p({
          name: "bell",
          color: "#ffffff",
          size: "24"
        }),
        i: common_vendor.p({
          name: "chat",
          color: "#ffffff",
          size: "24"
        }),
        j: common_assets._imports_1
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
