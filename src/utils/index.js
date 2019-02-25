/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

//ajax错误处理
export const catchError = function(error) {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                Vue.prototype.$message({
                    message: error.response.data.message || "请求参数异常",
                    type: "error"
                });

                break;
            case 401:
                sessionStorage.removeItem("user");
                Vue.prototype.$message({
                    message: error.response.data.message || "密码错误或账号不存在！",
                    type: "warning",
                    onClose: function() {
                        location.reload();
                    }
                });
                break;
            case 403:
                Vue.prototype.$message({
                    message: error.response.data.message || "无访问权限，请联系企业管理员",
                    type: "warning"
                });
                break;
            default:
              this.$message.error("服务器异常,请联系客服");

        }
    }
    return Promise.reject(error);
};
