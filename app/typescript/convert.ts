import { content } from "./editor.js";
import { HandleElementContent } from "./editor.js";

export function Formater() {
    HandleElementContent()
    
    function conversion(text: string, pattern: RegExp, replacement: string):string {
        return text.replace(pattern, replacement);
      }
      function titleConversion(text: string, pattern: RegExp, replacement: string):string {
        return text.replace(pattern, function (match:string) {
            const matchResult = match.trim().match(/^#+/);
            if (matchResult) {
              const level = matchResult[0].length;  // Conta o número de '#'
              return `${replacement.repeat(level)} ${match.trim().substring(level).trim()}`;
            }
            return match;  // Retorna o match original se não encontrar '#'
        });
      }
    
      let markdown = conversion(content, /\*\*(.*?)\*\*/g, "**$1**");
      markdown = conversion(markdown, /__(.*?)__/g, "__$1__");
      markdown = titleConversion(
        markdown,
        /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm,
        "#"
      );
    return markdown;
}