"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  _easycom_up_button2();
}
const _easycom_up_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  _easycom_up_button();
}
const _sfc_main = {
  __name: "manage",
  setup(__props) {
    const tableData = common_vendor.ref([]);
    const checkedIds = common_vendor.ref([]);
    const customStyle = common_vendor.reactive({
      width: "30%"
    });
    common_vendor.computed(() => {
      return tableData.value.length > 0 && checkedIds.value.length === tableData.value.length;
    });
    const toggleRow = (row) => {
      const index = checkedIds.value.indexOf(row._id);
      if (index > -1) {
        checkedIds.value.splice(index, 1);
      } else {
        checkedIds.value.push(row._id);
      }
    };
    const handleDelete = async () => {
      if (!checkedIds.value.length) {
        return common_vendor.index.showToast({
          title: "请先选择要删除的用户",
          icon: "none"
        });
      }
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定删除 ${checkedIds.value.length} 个用户吗？`,
        success: async (res) => {
          var _a, _b;
          if (!res.confirm)
            return;
          common_vendor.index.showLoading({
            title: "删除中..."
          });
          try {
            const result = await common_vendor.tr.callFunction({
              name: "Delete",
              data: {
                ids: checkedIds.value
              }
            });
            if (((_a = result.result) == null ? void 0 : _a.code) === 200) {
              common_vendor.index.showToast({
                title: "删除成功"
              });
              checkedIds.value = [];
              getTableData();
            } else {
              common_vendor.index.showToast({
                title: ((_b = result.result) == null ? void 0 : _b.msg) || "删除失败",
                icon: "none"
              });
            }
          } catch (e) {
            common_vendor.index.showToast({
              title: "服务器错误",
              icon: "none"
            });
          } finally {
            common_vendor.index.hideLoading();
          }
        }
      });
    };
    const getTableData = async () => {
      var _a;
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        const res = await common_vendor.tr.callFunction({
          name: "queryCollection",
          data: {
            collectionName: "user",
            page: 1,
            pageSize: 300,
            orderBy: [
              ["create_time", "desc"]
            ]
          }
        });
        tableData.value = ((_a = res.result) == null ? void 0 : _a.data) || [];
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    common_vendor.onMounted(getTableData);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tableData.value, (item, k0, i0) => {
          return {
            a: checkedIds.value.includes(item._id),
            b: common_vendor.o(($event) => toggleRow(item), item._id),
            c: common_vendor.t(item.nickname),
            d: common_vendor.t(item.grade),
            e: item._id
          };
        }),
        b: common_vendor.o(handleDelete),
        c: common_vendor.p({
          type: "error",
          shape: "circle",
          text: "删除",
          ["custom-style"]: customStyle
        }),
        d: common_vendor.o(getTableData),
        e: common_vendor.p({
          type: "primary",
          shape: "circle",
          text: "刷新",
          ["custom-style"]: customStyle
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ab48b5e0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/manage/manage.js.map
