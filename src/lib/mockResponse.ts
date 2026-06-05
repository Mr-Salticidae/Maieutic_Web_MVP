import type { ChatMessage, ChatResponse } from "./types";

export function createMockResponse(messages: ChatMessage[]): ChatResponse {
  const last = messages[messages.length - 1]?.content ?? "";

  if (/RAG|什么是|解释/.test(last)) {
    return {
      mode: "Knowledge",
      reply:
        "RAG 是 Retrieval-Augmented Generation，意思是先从外部资料中检索相关内容，再让模型基于这些内容回答。它解决的是模型只靠记忆容易过时或编造的问题。简单说，RAG 让 AI 回答前先翻资料。",
      insight: null,
      beacon: null
    };
  }

  if (/剪辑|学习|从哪里开始/.test(last)) {
    return {
      mode: "Exploration",
      reply:
        "先不急着列软件和课程。你说“学剪辑”，可能是短视频节奏、故事叙事、商业广告、音乐卡点，或者个人影像表达。最先要分清的是：你想通过剪辑获得“节奏爽感”，还是想学会“把一个故事讲清楚”？",
      insight: null,
      beacon: "今晚找一个你喜欢的 30 秒视频，只标出 3 个让你觉得节奏舒服的剪切点。"
    };
  }

  if (/什么都想学|开始不了|迷茫|卡住/.test(last)) {
    return {
      mode: "Reflection",
      reply:
        "我先不急着给你时间管理方案。你说的“什么都想学但什么都开始不了”，可能不是懒，而是选择太多、兴奋过载、害怕选错，或者每个方向背后承载了不同期待。这里最需要分清的是：你现在更像“太兴奋，不知道先选哪个”，还是“其实很累，所以任何一个都启动不了”？",
      insight: null,
      beacon: null
    };
  }

  if (/公益|乡村|孩子|AI 项目|AI公益/.test(last)) {
    return {
      mode: "Creation",
      reply:
        "这个项目的第一问题不是“做什么 AI 功能”，而是“谁能真正把它送到孩子面前”。如果直接做 App，最可能卡在触达和持续使用上；更现实的入口可能是乡村老师、公益组织或已有阅读课程。你可以先把问题拆成三件事：孩子现在最缺什么、谁已经在接触他们、AI 能不能降低这个中间人的负担。",
      insight: "这个公益项目的关键不是把 AI 交给孩子，而是先找到能稳定触达孩子的人。",
      beacon: "今天先列出 3 类可能的中间触达者，并写下他们各自最可能缺的一项支持。"
    };
  }

  return {
    mode: "Creation",
    reply:
      "这句话已经有很强的概念，但还停在抽象层。下一步不是马上扩成完整剧本，而是找一个日常场景承载它：比如一个人以为自己在自由选择，实际上每次选择都被推荐系统温柔地缩小。先找到一个能被拍出来的生活动作，概念才会落地。",
    insight: null,
    beacon: "今晚写 3 个生活场景，每个只用一句话说明“系统如何悄悄缩小选择”。"
  };
}
