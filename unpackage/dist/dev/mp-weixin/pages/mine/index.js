"use strict";
const common_vendor = require("../../common/vendor.js");
const MAP_KEY = "HZLBZ-3UIEQ-55L5Y-27WNQ-EHRAJ-6VFD5";
if (!Array) {
  const _easycom_up_avatar2 = common_vendor.resolveComponent("up-avatar");
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_up_avatar2 + _easycom_up_icon2 + _easycom_up_button2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_u_popup2)();
}
const _easycom_up_avatar = () => "../../uni_modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_up_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_up_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_up_avatar + _easycom_up_icon + _easycom_up_button + _easycom_u_icon + _easycom_u_button + _easycom_u_popup)();
}
const defaultAvatar = "/static/Avatar.png";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const avatar = common_vendor.ref("");
    const name = common_vendor.ref("");
    const openid = common_vendor.ref("");
    const loggedIn = common_vendor.ref(false);
    const showLoginPopup = common_vendor.ref(false);
    const grade = common_vendor.ref("");
    common_vendor.ref(false);
    common_vendor.ref("single");
    common_vendor.ref(null);
    const place = common_vendor.ref("");
    const handleAvatarClick = () => {
      var _a;
      if (!((_a = name.value) == null ? void 0 : _a.trim())) {
        showLoginPopup.value = true;
        return;
      }
      ChooseAvatar();
    };
    const ChooseAvatar = (e) => {
      avatar.value = e.detail.avatarUrl;
    };
    const onInputNickname = (e) => {
      name.value = e.detail.value;
    };
    const onInputGrade = (e) => {
      grade.value = e.detail.value;
    };
    const Addto = () => {
      common_vendor.index.navigateTo({
        url: "/pages/manage/manage"
      });
    };
    const onLocationClick = async () => {
      var _a, _b, _c, _d;
      try {
        common_vendor.index.showLoading({
          title: "定位中...",
          mask: true
        });
        const setting = await common_vendor.index.getSetting();
        const hasLocationAuth = setting.authSetting["scope.userLocation"];
        if (hasLocationAuth === false) {
          common_vendor.index.hideLoading();
          return common_vendor.index.showModal({
            title: "提示",
            content: "检测到您未开启定位权限，请前往设置开启。",
            confirmText: "去设置",
            showCancel: false,
            success(res2) {
              if (res2.confirm)
                common_vendor.index.openSetting();
            }
          });
        }
        const locationRes = await common_vendor.index.getLocation({
          type: "gcj02",
          geocode: true,
          isHighAccuracy: true,
          // 精确定位
          highAccuracyExpireTime: 3e3
          // 超时时间
        });
        const {
          latitude,
          longitude
        } = locationRes;
        const key = MAP_KEY;
        const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`;
        const res = await common_vendor.index.request({
          url
        });
        common_vendor.index.__f__("log", "at pages/mine/index.vue:196", "📍 腾讯地图解析结果:", res.data);
        if (res.data.status === 0) {
          const info = res.data.result;
          const standardAddress = (_a = info.formatted_addresses) == null ? void 0 : _a.standard_address;
          place.value = standardAddress;
          common_vendor.index.showToast({
            title: "获取位置成功",
            icon: "success"
          });
        } else {
          throw new Error(res.data.message);
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/mine/index.vue:212", "定位失败:", err);
        if ((_b = err.errMsg) == null ? void 0 : _b.includes("auth")) {
          return common_vendor.index.showModal({
            title: "提示",
            content: "定位权限未开启，请前往设置打开定位权限后重试。",
            confirmText: "去设置",
            showCancel: false,
            success(res) {
              if (res.confirm)
                common_vendor.index.openSetting();
            }
          });
        }
        if (((_c = err.errMsg) == null ? void 0 : _c.includes("system permission")) || ((_d = err.errMsg) == null ? void 0 : _d.includes("system"))) {
          common_vendor.index.hideLoading();
          return common_vendor.index.showModal({
            title: "提示",
            content: "手机定位服务未开启，请前往系统设置打开 GPS 后重试。",
            showCancel: false
          });
        }
        common_vendor.index.showToast({
          title: "定位失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const Achieve = () => {
      common_vendor.index.showToast({
        title: "功能待实现",
        icon: "none"
      });
    };
    function throttle(fn, delay = 2e3) {
      let lastTime = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
          lastTime = now;
          fn.apply(this, args);
        }
      };
    }
    const validate = (fields) => {
      for (const {
        value,
        msg
      } of fields) {
        if (!(value == null ? void 0 : value.trim())) {
          common_vendor.index.showToast({
            title: msg,
            icon: "none"
          });
          return false;
        }
      }
      return true;
    };
    async function wxLogin() {
      try {
        const valid = validate([
          {
            value: avatar.value,
            msg: "请上传头像"
          },
          {
            value: name.value,
            msg: "请输入昵称"
          },
          {
            value: grade.value,
            msg: "请输入年级"
          }
        ]);
        if (!valid)
          return;
        const loginRes = await common_vendor.index.login();
        const payload = {
          code: loginRes.code,
          avatar: avatar.value,
          nickname: name.value,
          grade: grade.value
        };
        const res = await common_vendor.tr.callFunction({
          name: "weixinLogin",
          data: payload
        });
        if (res.result.code === 0) {
          openid.value = res.result.data.openid;
          loggedIn.value = true;
          showLoginPopup.value = false;
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.msg || "登录失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/mine/index.vue:329", "登录失败:", err);
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "none"
        });
      }
    }
    const throttledWxLogin = throttle(wxLogin, 2e3);
    common_vendor.onShow(() => {
      var _a;
      const page = getCurrentPages().pop();
      const tabBar = (_a = page == null ? void 0 : page.getTabBar) == null ? void 0 : _a.call(page);
      if (typeof (tabBar == null ? void 0 : tabBar.setData) === "function") {
        tabBar.setData({
          selected: 1
        });
      }
      if (!loggedIn.value) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        showLoginPopup.value = true;
      }
    });
    const OnJump = () => {
      if (!loggedIn.value) {
        common_vendor.index.navigateTo({
          url: "/pages/Sign/index"
        });
      }
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.p({
          src: avatar.value || defaultAvatar,
          shape: "circle",
          size: "55"
        }),
        b: common_vendor.t(((_a = name.value) == null ? void 0 : _a.trim()) ? name.value : "请登录"),
        c: common_vendor.o(handleAvatarClick),
        d: common_vendor.o(onLocationClick),
        e: common_vendor.p({
          name: "map",
          color: "#666",
          size: "24"
        }),
        f: common_vendor.t(place.value || "获取位置"),
        g: common_vendor.o(onLocationClick),
        h: common_vendor.o(Addto),
        i: common_vendor.p({
          type: "primary",
          shape: "circle",
          text: "管理学员"
        }),
        j: common_vendor.p({
          name: "rmb-circle",
          size: "40",
          color: "#2ecc71"
        }),
        k: common_vendor.o(OnJump),
        l: common_vendor.p({
          name: "fingerprint",
          size: "40",
          color: "#3498db"
        }),
        m: common_vendor.p({
          name: "coupon",
          size: "40",
          color: "#e67e22"
        }),
        n: common_vendor.p({
          name: "gift",
          size: "40",
          color: "#1abc9c"
        }),
        o: common_vendor.p({
          name: "bookmark",
          size: "24",
          color: "#3498db"
        }),
        p: common_vendor.p({
          name: "arrow-right",
          size: "20",
          color: "#ccc"
        }),
        q: common_vendor.o(Achieve),
        r: common_vendor.p({
          name: "calendar",
          size: "24",
          color: "#e67e22"
        }),
        s: common_vendor.p({
          name: "arrow-right",
          size: "20",
          color: "#ccc"
        }),
        t: common_vendor.o(Achieve),
        v: common_vendor.p({
          name: "calendar",
          size: "24",
          color: "#1abc9c"
        }),
        w: common_vendor.p({
          name: "arrow-right",
          size: "20",
          color: "#ccc"
        }),
        x: common_vendor.o(Achieve),
        y: common_vendor.p({
          name: "calendar",
          size: "24",
          color: "#9b59b6"
        }),
        z: common_vendor.p({
          name: "arrow-right",
          size: "20",
          color: "#ccc"
        }),
        A: common_vendor.o(Achieve),
        B: common_vendor.p({
          name: "bell",
          size: "24",
          color: "#2ecc71"
        }),
        C: common_vendor.p({
          name: "arrow-right",
          size: "20",
          color: "#ccc"
        }),
        D: common_vendor.o(Achieve),
        E: common_vendor.p({
          name: "share",
          size: "24",
          color: "#e67e22"
        }),
        F: common_vendor.p({
          name: "arrow-right",
          size: "20",
          color: "#ccc"
        }),
        G: common_vendor.o((...args) => _ctx.naviAchieve && _ctx.naviAchieve(...args)),
        H: !avatar.value || !avatar.value.trim()
      }, !avatar.value || !avatar.value.trim() ? {
        I: common_vendor.o(ChooseAvatar)
      } : {
        J: avatar.value
      }, {
        K: common_vendor.o(onInputNickname),
        L: common_vendor.o(onInputGrade),
        M: common_vendor.o(common_vendor.unref(throttledWxLogin)),
        N: common_vendor.p({
          type: "primary",
          shape: "circle"
        }),
        O: common_vendor.o(($event) => showLoginPopup.value = $event),
        P: common_vendor.p({
          mode: "center",
          ["mask-close"]: true,
          round: "20",
          bgColor: "#d8f3fa",
          show: showLoginPopup.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-569e925a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/index.js.map
