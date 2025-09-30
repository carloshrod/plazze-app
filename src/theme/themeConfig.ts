import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontFamily: "Mont",
    colorPrimary: "#08b63d",
    colorText: "#061a1c",
    colorTextBase: "#061a1c",
  },
  components: {
    Button: {
      fontFamily: "Mont",
    },
    Input: {
      fontFamily: "Mont",
    },
    Select: {
      fontFamily: "Mont",
    },
    Dropdown: {
      controlItemBgHover: "rgba(8, 182, 61, 0.1)",
      controlItemBgActive: "rgba(8, 182, 61, 0.1)",
    },
    DatePicker: {
      fontFamily: "Mont",
      cellHoverBg: "rgba(8, 182, 61, 0.08)",
      cellActiveWithRangeBg: "#e6f4ea",
      cellRangeBorderColor: "#08b63d",
      controlItemBgActive: "#08b63d",
      controlItemBgActiveHover: "#07a336",
      cellHoverWithRangeBg: "#e6f4ea",
    },
  },
};

export default theme;
