import type { HLJSApi, Language, Mode } from "highlight.js";

// written by ai
export function registerClassiCubeScript(hljs: HLJSApi): Language {
  const KEYWORDS = {
    keyword:
      "quit terminate include using call goto jump newthread if ifnot else",
    operator:
      "set setlength setsplit setadd setblockid setcos setdirvector setdiv " +
      "setfromhexcolor setmod setmul setpow setrandrange setrandrangedecimal " +
      "setround setrounddown setroundup setsin setsqrt setsub settan settohexcolor",
    built_in:
      "allowmbrepeat award boost changemodel changeskin chatevent clickevent cmd " +
      "cpe cpemsg cs definehotkey delay effect env error freeze gui hasplugin " +
      "item kill localmsg look menumsg motd msg placeblock reach registerclick " +
      "reply replysilent resetdata set setdeathspawn setrandlist setspawn show " +
      "stare tempblock tempchunk undefinehotkey unfreeze",
    literal: "true false",
    variable:
      "cef MBX MBY MBZ PlayerX PlayerY PlayerZ PlayerPX PlayerPY PlayerPZ " +
      "PlayerYaw PlayerPitch msgDelay msgDelayMultiplier MBCoords PlayerCoords " +
      "PlayerCoordsDecimal PlayerCoordsPrecise runArg0 runArg1 runArg2 runArg3 " +
      "runArg4 runArg5 runArg6 runArg7 runArg8 runArg9 epochMS actionCount " +
      "actionLimit PlayerClient webclient mobile @nick @p",
  };

  const FUNCTION_LABEL = {
    className: "title.function",
    begin: "#[a-zA-Z0-9_\\-\\.]+",
    relevance: 10,
  };

  const VARIABLE = {
    className: "variable",
    begin: "[a-zA-Z0-9_\\-\\.]+",
    relevance: 0,
  };

  const VARIABLE_VALUE: Mode = {
    className: "variable",
    begin: "{",
    end: "}",
    contains: [
      "self",
      {
        className: "built_in",
        begin: `\\b(${KEYWORDS.variable.split(" ").join("|")})\\b`,
      },
      VARIABLE,
    ],
  };

  const COLOR_CODE = {
    className: "string.escape",
    begin: "(%|&)[0-9a-zA-Z]",
    relevance: 0,
  };

  const NUMBER = {
    className: "number",
    begin: "\\b[0-9]+\\b",
    relevance: 0,
  };

  return {
    name: "ClassiCube Script",
    aliases: ["nas", "classicube-script"],
    case_insensitive: false,
    keywords: KEYWORDS,
    contains: [
      hljs.COMMENT("//", "$"),
      FUNCTION_LABEL,
      COLOR_CODE,
      VARIABLE_VALUE,
      {
        className: "string",
        begin: "@(nick|p)\\b",
        relevance: 0,
      },
      NUMBER,
      {
        className: "keyword",
        begin: "\\|",
        end: "\\|",
        contains: [
          {
            className: "operator",
            begin: "[\\=\\<\\>\\!=\\<=\\>=]",
          },
        ],
      },
    ],
  };
}
