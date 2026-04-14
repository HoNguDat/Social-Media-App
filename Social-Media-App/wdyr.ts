import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");

  // Ép log ra cả Terminal để bạn dễ thấy
  console.log("🚀 WDYR is Initializing...");

  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOnDifferentValues: true,
    collapseGroups: false, // Không thu gọn log để dễ nhìn
  });
}
