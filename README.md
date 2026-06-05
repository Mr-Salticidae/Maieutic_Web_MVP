# Maieutic Web MVP

一个打开网页即可使用的 Maieutic AI 共学者 MVP。

当前版本重点：

- 单页对话界面。
- `/api/chat` 后端接口。
- OpenAI-compatible / Anthropic 两类模型配置。
- Provider、Model、API Key、Base URL、Fallback 均通过 `.env` 配置。
- Insight / Beacon 事件触发，前端有才显示。
- localStorage 保存最近 20 条对话。
- 无 API Key 时自动使用 mock response，方便先验收网页流程。

## 本地启动

```powershell
cd D:\AIGC工作站\Maieutic_Web_MVP\maieutic-web-mvp
npm.cmd install
npm.cmd run dev
```

打开：

```text
http://localhost:3000
```

本机验证时，`127.0.0.1` hostname 在后台进程里可能不稳定；项目脚本已固定使用 `0.0.0.0` 监听，浏览器仍然打开 `http://localhost:3000`。

生产模式：

```powershell
npm.cmd run build
npm.cmd run start
```

## 模型配置

复制 `.env.example` 为 `.env.local`：

```powershell
Copy-Item .env.example .env.local
```

OpenAI-compatible 示例：

```env
AI_PROVIDER=openai
AI_MODEL=gpt-5.5
AI_API_KEY=your_api_key_here
AI_BASE_URL=https://api.openai.com/v1

FALLBACK_PROVIDER=anthropic
FALLBACK_MODEL=claude-4.6
FALLBACK_API_KEY=your_fallback_api_key_here
FALLBACK_BASE_URL=
```

Anthropic 示例：

```env
AI_PROVIDER=anthropic
AI_MODEL=claude-4.6
AI_API_KEY=your_api_key_here

FALLBACK_PROVIDER=openai
FALLBACK_MODEL=gpt-5.5
FALLBACK_API_KEY=your_fallback_api_key_here
FALLBACK_BASE_URL=https://api.openai.com/v1
```

强制 mock：

```env
MAIEUTIC_MOCK=1
```

## API

`POST /api/chat`

请求：

```json
{
  "messages": [
    { "role": "user", "content": "我想学习剪辑，但不知道从哪里开始。" }
  ]
}
```

响应：

```json
{
  "reply": "主要回答正文",
  "insight": null,
  "beacon": "今晚选一个你喜欢的 30 秒视频，只记录它在哪里切镜头。",
  "mode": "Exploration"
}
```

## 测试用例

见：

- `docs/Maieutic_Web_MVP测试用例.md`

核心测试：

1. `请用三句话解释一下 RAG 是什么。`
2. `我想学习剪辑，但不知道从哪里开始。`
3. `我最近什么都想学，但什么都开始不了。`
4. `我想做一个 AI 公益项目，帮助乡村孩子学习阅读。你觉得应该从哪里开始？`
5. `我想做一个关于自由意志和算法推荐的短片，但现在只有一句核心表达：自由意志，也许只是系统暂时无法压缩的异常值。`

## 当前边界

- 不做登录。
- 不接数据库。
- 不做长期记忆。
- 不做付费系统。
- 不做复杂 Agent。
- 不做 North Star / Living Questions / Journey / Shift Graph / Cognitive Biography。
- 不把 Insight / Beacon 改回每轮强制输出。
