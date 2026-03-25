import { message } from "antd";

const showMessage = {
  success: (content: string) => {
    message.success({ content, duration: 3, className: "message-right" });
  },
  error: (content: string) => {
    message.error({ content, duration: 3, className: "message-right" });
  },
};

export default showMessage;
