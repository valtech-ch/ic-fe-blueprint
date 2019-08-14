/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable */
const ICRuntime = require('./srv/htl/ICRuntime');

function run(runtime) {
  const $ = {
    lengthOf: c => Array.isArray(c) ? c.length : Object.keys(c).length,
    out: runtime.out.bind(runtime),
    exec: runtime.exec.bind(runtime),
    xss: runtime.xss.bind(runtime),
    listInfo: runtime.listInfo.bind(runtime),
    use: runtime.use.bind(runtime),
    slyResource: runtime.resource.bind(runtime),
    call: runtime.call.bind(runtime),
    template: runtime.template.bind(runtime),
  };


  return runtime.run(function* () {

    const global = runtime.globals;

    $.out("\n");
    title = yield $.use("com.adobe.cq.wcm.core.components.models.Title", {});
    text = title["text"];
    if (text) {
      $.out("<div class=\"cmp-title\">\n    ");
      const var_tagVar0 = $.xss(title["type"], "elementName");
      if (var_tagVar0) {
        $.out("<");
        $.out(var_tagVar0);
      }
      if (!var_tagVar0) {
        $.out("<h1");
      }
      $.out(" class=\"cmp-title__text\">");
      const var_unwrapCondition1 = (!title["linkURL"]) || (title["linkDisabled"]);
      if (!var_unwrapCondition1) {
        $.out("<a class=\"cmp-title__link\"");
        const var_attrValue2 = title["linkURL"];
        const var_attrContent3 = $.xss(var_attrValue2, "uri");
        if ((var_attrContent3) || (("false") == (var_attrValue2))) {
          $.out(" href");
          if ((var_attrValue2) !== (true)) {
            $.out("=\"");
            $.out(var_attrContent3);
            $.out("\"");
          }
        }
        $.out(">");
      }
      const var_4 = $.xss(text, "html");
      $.out(var_4);
      if (!var_unwrapCondition1) {
        $.out("</a>");
      }
      if (var_tagVar0) {
        $.out("</");
        $.out(var_tagVar0);
        $.out(">");
      }
      if (!var_tagVar0) {
        $.out("</h1>");
      }
      $.out("\n</div>");
    }
    $.out("\n\n");

  });
}

module.exports.main = async function main(resource, config) {
  const runtime = new ICRuntime(config.useOptions);
  runtime.setGlobal(resource);
  runtime.withUseDirectory(config.useDir);
  await run(runtime);
  return {
    body: runtime.stream
  };
};
