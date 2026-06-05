# Maieutic_Web_MVP产品化_交接给_Codex

> 致 Codex：这是从 GPT 主会话转接的 Maieutic Web MVP 产品化任务交接。读完这份文档你就能直接进入开发。
> 创建时间：2026-06-05
> 项目阶段：DeepSeek Adapter 人工体验未通过，决定回到轻量网站产品化路线。
> 交接原因：Skill / Prompt 包导入复杂、体验臃肿，不适合普通用户。下一阶段需要将 Maieutic 做成一个打开即用的简单网站。
> 文档版本：v1，继承自 Maieutic Skill v0.1/v0.2 测试与人工反馈。

---

## 〇、致 Codex：你需要先知道的几件事

1. **跳蛛先生**是 B 站 AI 创作者 / AI 应用研究员 / 计算机背景 / vibe coding 实践者。
2. **沟通风格**：直接、简洁、要真实判断，不要捧场。可以直说“这个不行”“这个判断错了”。
3. **决策权完全在跳蛛先生手里**：你的角色是基于事实的判断、代码执行、边界提醒。
4. **避免堆砌**：跳蛛先生对套话、过度铺垫、没有信息密度的回答非常敏感。
5. **交付优先级**：先做能跑的最小网页，不要追求复杂架构。
6. **称呼**：使用“跳蛛先生”或直接进入主题，不要用“用户”。

---

## 〇、一、你的任务边界

### 你要做的

- 搭建 Maieutic Web MVP
- 做一个单页对话网站
- 实现 `/api/chat` 后端接口
- 支持模型配置，不写死模型
- 默认支持高性价比模型配置，例如 Claude 4.6 / GPT-5.5
- 实现 Maieutic 四种对话模式 prompt
- 实现事件触发式 Insight / Beacon
- 用 localStorage 保存最近对话
- 写清楚本地启动方式

### 你不要做的

- ❌ 不要继续做 DeepSeek Prompt 包优化
- ❌ 不要安装 / 改造本机 Codex Skill
- ❌ 不要做复杂 Agent
- ❌ 不要接数据库
- ❌ 不要做登录系统
- ❌ 不要做付费系统
- ❌ 不要实现长期记忆
- ❌ 不要实现 North Star / Living Questions / Journey / Shift Graph / Cognitive Biography
- ❌ 不要把 Maieutic 做成课程平台
- ❌ 不要把 Insight / Beacon 改回每轮强制输出

---

## 一、项目基本盘（60 秒读完）

**项目**：Maieutic Web MVP

**核心命题**：

> 一个打开网页即可使用的 AI 共学者，陪用户把问题想清楚。

**当前决策**：

DeepSeek Adapter 不继续测试。

原因：

- 导入内容太多
- 对普通用户太复杂
- 体验臃肿
- 不像产品

新方向：

> 做一个简单网站，把复杂 Prompt 和模型调用封装在后台，让用户只面对一个输入框。

---

## 二、已确认的关键决策

### 决策 1：回到 Web MVP 产品化路线

理由：

- 普通用户不应该理解 Skill / Prompt / Adapter
- 网站比 Prompt 包更低门槛
- 体验可控
- 后续方便分享给朋友测试

⚠️ 不要继续围绕 DeepSeek Adapter 打磨。

---

### 决策 2：模型必须可配置

默认优先考虑跳蛛先生当前体感和性价比最好的模型：

- Claude 4.6
- GPT-5.5

但代码不要写死。

必须通过 `.env` 或配置文件控制：

- Provider
- Model
- API Key
- Base URL
- Fallback Provider
- Fallback Model

⚠️ 模型策略是可替换层，不是业务逻辑。

---

### 决策 3：Insight / Beacon 继续保持事件触发

不要每轮强制输出。

知识问题默认不输出 Insight / Beacon。

---

## 三、推荐技术栈

优先使用：

```text
Next.js
TypeScript
TailwindCSS
API Route
localStorage
模型 API
```

原因：

- 前后端一体
- 部署简单
- 适合 MVP
- 方便后续上线

---

## 四、推荐目录结构

```text
maieutic-web-mvp/
├── README.md
├── .env.example
├── package.json
├── next.config.js
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts
│   ├── components/
│   │   ├── ChatBox.tsx
│   │   ├── MessageList.tsx
│   │   ├── InsightCard.tsx
│   │   └── BeaconCard.tsx
│   ├── lib/
│   │   ├── aiClient.ts
│   │   ├── maieuticPrompt.ts
│   │   └── parseResponse.ts
│   └── styles/
│       └── globals.css
└── docs/
    ├── Maieutic_Web_MVP产品化计划书.md
    └── 测试用例.md
```

---

## 五、API 设计

### POST `/api/chat`

请求：

```json
{
  "messages": [
    {"role": "user", "content": "我想学习剪辑，但不知道从哪里开始。"}
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

说明：

- `insight` 可以为 `null`
- `beacon` 可以为 `null`
- `mode` 可以为 `Knowledge / Exploration / Reflection / Creation / Research`
- MVP 阶段解析不必过度复杂，但要稳定展示

---

## 六、模型配置要求

`.env.example` 必须包含：

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

如果 Anthropic / Claude 作为主模型：

```env
AI_PROVIDER=anthropic
AI_MODEL=claude-4.6
AI_API_KEY=your_api_key_here

FALLBACK_PROVIDER=openai
FALLBACK_MODEL=gpt-5.5
FALLBACK_API_KEY=your_fallback_api_key_here
FALLBACK_BASE_URL=https://api.openai.com/v1
```

要求：

- 不要硬编码模型名
- 不要硬编码 API Key
- 支持 OpenAI-compatible Base URL
- README 中写清楚如何切换模型

---

## 七、Maieutic Prompt 规则

后端必须加载 Maieutic 系统规则。

核心规则：

```text
你是 Maieutic，一个苏格拉底式 AI 共学者。

你不是老师、导师、教练或答题机器人。
你的任务是帮助用户把问题想清楚。

你需要自动判断用户问题属于哪种模式：

1. Knowledge Mode：
明确知识问题，直接回答，不强行反问，不强行输出 Insight / Beacon。

2. Exploration Mode：
用户知道方向但不知道路径时，帮助澄清目标、动机、约束，并给出轻量下一步。

3. Reflection Mode：
用户迷茫、受挫、卡住时，先理解和澄清，不输出廉价鸡汤，不急于解决问题。

4. Creation Mode：
用户在做创作、产品、项目、职业选择时，帮助结构化、发现盲区、挑战假设，不替用户拍板。

5. Research-Assisted Mode：
用户明确需要资料、案例、工具或外部信息时，可以辅助整理。
如果无法确认最新信息，必须透明说明，不要编造。

Insight / Beacon 规则：
Insight 只在本轮对话产生真实认知推进时输出。
Beacon 只在用户确实需要下一步行动时输出。
不要每轮强制输出 Insight / Beacon。
Beacon 必须是 24 小时内可执行的小行动。

语气：
克制、直接、共学、不说教、不鸡汤、不制造虚假确定性。
```

---

## 八、前端最低要求

页面只需要做到：

- 产品名
- 一句介绍
- 对话显示区
- 输入框
- 发送按钮
- Insight 卡片（有才显示）
- Beacon 卡片（有才显示）
- 最近历史记录（localStorage）

不要做复杂视觉设计。

---

## 九、测试用例

### Case 1

```text
请用三句话解释一下 RAG 是什么。
```

预期：

- Knowledge Mode
- 不输出 Insight / Beacon

---

### Case 2

```text
我想学习剪辑，但不知道从哪里开始。
```

预期：

- Exploration Mode
- 先澄清方向
- 可输出小 Beacon

---

### Case 3

```text
我最近什么都想学，但什么都开始不了。
```

预期：

- Reflection Mode
- 不鸡汤
- 不直接给时间管理清单

---

### Case 4

```text
我想做一个 AI 公益项目，帮助乡村孩子学习阅读。你觉得应该从哪里开始？
```

预期：

- Creation Mode
- 能指出触达问题
- 不直接建议做 App

---

### Case 5

```text
我想做一个关于自由意志和算法推荐的短片，但现在只有一句核心表达：自由意志，也许只是系统暂时无法压缩的异常值。
```

预期：

- Creation Mode
- 不直接替用户写完整剧本
- 帮助把抽象表达落到生活场景

---

## 十、第一轮接手时怎么做

收到本文档后，不要写长篇总结。

直接开始：

1. 创建 Next.js 项目
2. 搭建单页聊天界面
3. 实现 `/api/chat`
4. 写入 Maieutic 系统 Prompt
5. 写入模型配置层
6. 实现 Insight / Beacon 可选展示
7. 写 README 和本地启动说明

第一轮交付以“能跑起来”为准，不追求完美。

---

## 十一、反对路径

如果模型 API 暂时无法接通：

- 先用 mock response 完成前端
- API 层保留接口结构
- README 写明待填 API Key 后启用

如果解析 Insight / Beacon 不稳定：

- 先让模型按 JSON 输出
- 或先用 markdown 标题解析
- MVP 阶段以可用为先，不追求架构完美

---

## 作者 / 接收 / 下游

**作者**：GPT 主会话  
**接收方**：Codex  
**决策人**：跳蛛先生  
**下游**：Maieutic Web MVP 首轮可运行 demo
