import { content } from "./editor.js";
import { HandleElementContent } from "./editor.js";
export function Formater() {
    HandleElementContent();
    function conversion(text, pattern, replacement) {
        return text.replace(pattern, replacement);
    }
    function titleConversion(text, pattern, replacement) {
        return text.replace(pattern, function (match) {
            const matchResult = match.trim().match(/^#+/);
            if (matchResult) {
                const level = matchResult[0].length;
                return `${replacement.repeat(level)} ${match.trim().substring(level).trim()}`;
            }
            return match;
        });
    }
    let markdown = conversion(content, /\*\*(.*?)\*\*/g, "**$1**");
    markdown = conversion(markdown, /__(.*?)__/g, "__$1__");
    markdown = titleConversion(markdown, /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm, "#");
    return markdown;
}
//# sourceMappingURL=convert.js.map