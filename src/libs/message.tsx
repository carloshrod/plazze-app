import { message } from "antd";

const showMessage = {
  success: (content: string) => {
    message.success({ content, duration: 2, className: "message-right" });
  },
  error: (content: string) => {
    message.error({ content, duration: 2, className: "message-right" });
  },
};

export default showMessage;
