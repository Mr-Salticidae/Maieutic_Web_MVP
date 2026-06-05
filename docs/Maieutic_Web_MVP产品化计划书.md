# Maieutic Web MVP 产品化计划书

> 文档用途：将 Maieutic 从 Skill / Prompt 包升级为一个低门槛网页产品。
> 创建时间：2026-06-05
> 当前阶段：DeepSeek Adapter 人工测试未通过，决定回到轻量网站产品化路线。
> 核心判断：Skill / Prompt 包对普通用户仍然太复杂，真正低门槛的形态应该是“打开网页即可使用”。

---

## 一、项目结论

DeepSeek / 国内平台适配方向暂时停止。

停止原因：

1. 需要导入 / 复制的内容太多。
2. 对普通用户来说理解成本高。
3. Prompt 包形态臃肿，不像产品。
4. 平台适配体验不稳定。
5. Maieutic 的核心体验需要被产品界面承载，而不是让用户手动配置。

新的方向：

> 做一个简单网站，让用户无需理解 Skill、Prompt、Adapter，只需要打开网页、输入问题、获得 Maieutic 式回应。

---

## 二、产品定位

Maieutic Web MVP 是一个轻量级 AI 共学者网页。

它不是：

- 答题机器人
- 课程平台
- 复杂 Agent 系统
- 长期记忆产品
- 心理咨询工具

它是：

> 一个陪用户把问题想清楚，并在必要时给出 Insight 与 Beacon 的 AI 共学者。

---

## 三、目标用户

第一阶段用户：

- 跳蛛先生本人
- 少量愿意测试的朋友
- 对 AI 共学、创作、学习、职业方向有兴趣的人

典型使用场景：

1. 我想学一个东西，但不知道从哪开始。
2. 我最近有点迷茫。
3. 我在做一个创作 / 产品 / 职业选择。
4. 我想问一个明确知识点。
5. 我需要一点资料 / 案例辅助判断。

---

## 四、核心原则

### 1. 打开即用

用户不需要：

- 安装 Skill
- 复制 Prompt
- 理解 Claude / GPT / DeepSeek
- 配置 API
- 选择模式

用户只需要：

```text
打开网页
输入问题
点击发送
```

---

### 2. 模式自动判断

网站后台自动判断问题属于：

- Knowledge Mode：明确知识问题
- Exploration Mode：学习路径 / 方向澄清
- Reflection Mode：迷茫 / 受挫 / 卡住
- Creation Mode：创作 / 产品 / 项目 / 职业问题
- Research-Assisted Mode：需要资料 / 案例 / 外部信息辅助

---

### 3. Insight / Beacon 事件触发

不要每轮都强制输出 Insight / Beacon。

规则：

- 明确知识问题默认不输出 Insight / Beacon。
- 只有当对话真实发生认知推进时，输出 Insight。
- 只有当用户确实需要下一步行动时，输出 Beacon。
- Beacon 必须是 24 小时内能完成的小行动。

---

### 4. 模型可替换

模型不要写死。

后台需要支持模型配置。

推荐默认策略：

- 优先使用当前体感和性价比较好的模型：
  - Claude 4.6
  - GPT-5.5
- 保留后续替换能力：
  - Claude 系列
  - GPT 系列
  - DeepSeek
  - 其他 OpenAI-compatible API

注意：

> 模型选择不应写死在业务逻辑里，应通过 `.env` 或配置文件控制。

---

## 五、MVP 必做功能

### 功能 1：单页对话界面

页面内容：

- 产品名：Maieutic
- 一句说明：一个陪你把问题想清楚的 AI 共学者
- 输入框
- 发送按钮
- 输出区域

不需要复杂 UI。

---

### 功能 2：后端 AI 调用

后端接收用户输入，拼接 Maieutic 系统提示词，调用模型 API。

要求：

- 支持配置模型供应商
- 支持配置 API Key
- 支持配置模型名
- 输出稳定
- 错误时给出清晰提示

---

### 功能 3：模式判断

模型内部或后端 prompt 中应包含模式判断逻辑。

不要让用户手动选择模式。

---

### 功能 4：事件触发式 Insight / Beacon

输出格式建议：

```markdown
[主要回应正文]

---

## Insight
[如果本轮确实产生洞见才出现]

## Beacon
[如果本轮确实需要下一步行动才出现]
```

如果没有必要，就不要输出 Insight / Beacon。

---

### 功能 5：基础历史记录

MVP 可以先做浏览器本地保存。

推荐：

- localStorage 保存最近 20 条对话
- 不做登录
- 不做云端数据库
- 不保存敏感数据

---

## 六、MVP 暂不做

以下内容全部延后：

- 用户注册 / 登录
- 付费系统
- 数据库
- 长期记忆
- North Star
- Living Questions
- Journey
- Shift Graph
- Cognitive Biography
- 复杂 Agent
- 多人协作
- 后台管理系统
- 知识库上传
- 自动联网搜索
- 微信 / 飞书 / Coze Bot

---

## 七、推荐技术栈

### 推荐方案 A：Next.js 单体应用

适合快速上线。

```text
Next.js
TypeScript
TailwindCSS
API Route
localStorage
模型 API
```

优点：

- 前后端一体
- 部署简单
- 适合 Vercel / Cloudflare / 自托管
- 方便后续扩展

---

### 推荐方案 B：React + FastAPI

适合本地调试和后续扩展。

```text
React
FastAPI
Python
localStorage / SQLite
模型 API
```

优点：

- Python 后端方便后续接工具
- 更适合本地部署
- 方便调试模型调用

---

## 八、推荐选择

本项目建议优先使用：

```text
Next.js + TypeScript + TailwindCSS + API Route
```

理由：

1. 足够轻。
2. 开发快。
3. 页面和 API 在一个项目里。
4. 方便部署成可访问网站。
5. 适合 MVP 阶段。

---

## 九、模型配置设计

`.env` 示例：

```env
AI_PROVIDER=openai
AI_MODEL=gpt-5.5
AI_API_KEY=你的API_KEY
AI_BASE_URL=https://api.openai.com/v1

# 可选
FALLBACK_PROVIDER=anthropic
FALLBACK_MODEL=claude-4.6
FALLBACK_API_KEY=你的CLAUDE_KEY
```

也可以反过来：

```env
AI_PROVIDER=anthropic
AI_MODEL=claude-4.6
AI_API_KEY=你的CLAUDE_KEY

FALLBACK_PROVIDER=openai
FALLBACK_MODEL=gpt-5.5
FALLBACK_API_KEY=你的OPENAI_KEY
FALLBACK_BASE_URL=https://api.openai.com/v1
```

要求：

- 模型名不写死
- provider 不写死
- API Base URL 可配置
- 支持 OpenAI-compatible 接口

---

## 十、页面结构

### 首页 / 对话页

只做一个页面即可。

页面区域：

```text
顶部：
Maieutic
一个陪你把问题想清楚的 AI 共学者

中间：
对话显示区

底部：
输入框 + 发送按钮

侧边或下方：
最近历史记录
```

---

## 十一、默认提示文案

输入框 placeholder：

```text
带一个真实问题来，比如：我想学剪辑但不知道从哪里开始。
```

空状态提示：

```text
你可以问：
- 一个明确知识点
- 一个学习方向
- 一个卡住的念头
- 一个创作 / 产品 / 职业选择问题
```

---

## 十二、系统提示词核心规则

后端请求模型时，应加载以下核心规则：

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

## 十三、API 设计

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
  "insight": "可选，没有则为 null",
  "beacon": "可选，没有则为 null",
  "mode": "Exploration"
}
```

说明：

- `insight` 可为空
- `beacon` 可为空
- `mode` 可由模型输出或后端解析
- MVP 阶段不需要严格完美解析，能稳定展示即可

---

## 十四、前端交互

用户发送问题后：

1. 显示 loading
2. 调用 `/api/chat`
3. 展示主要回答
4. 如果有 Insight，则用单独卡片显示
5. 如果有 Beacon，则用单独卡片显示
6. 保存到 localStorage

---

## 十五、测试用例

### Case 1：知识问题

输入：

```text
请用三句话解释一下 RAG 是什么。
```

预期：

- 直接回答
- 不输出 Insight
- 不输出 Beacon

---

### Case 2：学习路径

输入：

```text
我想学习剪辑，但不知道从哪里开始。
```

预期：

- 澄清剪辑方向
- 不直接甩三个月计划
- 可输出小 Beacon

---

### Case 3：迷茫问题

输入：

```text
我最近什么都想学，但什么都开始不了。
```

预期：

- 不鸡汤
- 不说教
- 帮助区分疲惫、目标过载、完美主义等可能

---

### Case 4：产品 / 公益问题

输入：

```text
我想做一个 AI 公益项目，帮助乡村孩子学习阅读。你觉得应该从哪里开始？
```

预期：

- 不直接建议做 App
- 能指出触达问题
- 能想到老师 / 公益组织等中间触达者

---

### Case 5：创作问题

输入：

```text
我想做一个关于自由意志和算法推荐的短片，但现在只有一句核心表达：自由意志，也许只是系统暂时无法压缩的异常值。
```

预期：

- 不直接替用户写完整剧本
- 能指出抽象表达需要落地生活场景
- 能给 2-3 个方向或一个小 Beacon

---

## 十六、成功标准

MVP 成功不看功能多。

只看：

1. 用户是否能直接打开网页使用。
2. 不需要安装 Skill / 导入 Prompt。
3. 知识问题不烦人。
4. 迷茫问题不鸡汤。
5. 创作问题能推进。
6. Insight / Beacon 不仪式化。
7. 用户愿意第二天再打开。

---

## 十七、当前产品判断

DeepSeek Adapter 暂停，不是因为 Maieutic 方向错了。

而是因为：

> Prompt 包不是普通用户能接受的产品形态。

下一步不是继续优化 prompt 包，而是把 Maieutic 的能力包进一个简单网站里。

让用户不再看见复杂度。

用户只需要看见：

```text
一个输入框
一个共学者
一个更清楚的问题
一个可能的下一步
```
