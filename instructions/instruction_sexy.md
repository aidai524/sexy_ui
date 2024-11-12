## 项目需求文档 (PRD)

### 项目概述

本项目旨在创建一个基于 NextJS 和 Ant Design Mobile 的移动端网站。网站将集成 Solana 区块链功能，提供连接钱包和创建账号的能力。

### 核心功能

#### 1. 核心功能页 (Home)
- **功能交互**: 实现类似 Tinder 应用的左滑右滑功能。左滑表示“不喜欢”，右滑表示“喜欢”。
- **内容信息流**: 包含多条连续内容，每条内容包括图片背景和文字介绍。
- **初始页面**: 用户打开应用时，默认显示此页面。

#### 2. 菜单功能
- **页脚菜单项**: 四个菜单项分别跳转至对应页面：
  - 核心功能页 (Home)
  - 个人页 (Profile)
  - 创建页 (Create)
  - 列表页 (List)

#### 3. 个人页面 (Profile)
- 展示与用户相关的数据，包括名称和喜欢的内容。

#### 4. 创建页 (Create)
- 用户可通过表单创造新数据。（表单内容待补充）

#### 5. 列表页 (List)
- 展示所有项目的页面。（详情待补充）

#### 6. 用户账号系统
- 使用 Solana 网络的钱包账号登录，与手机或邮箱无关。

### Solana钱包连接文档

```javascript
// App.tsx
import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
})

// 1. Get projectId from https://cloud.reown.com
const projectId = 'YOUR_PROJECT_ID'

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Solana Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Create modal
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export default function App() {
  return <YourApp />
}
```

### 项目文件结构

以下是项目的文件结构，确保尽量少的文件数量，以提高项目管理的简便性：

```
mainsite
├── README.md
├── app
│   ├── favicon.ico
│   ├── fonts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.module.css
│   └── page.tsx
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── tsconfig.json
```

### 开发者指南

- **文件管理**: 遵循提供的文件结构，确保所有功能模块和资源文件都在合适的目录下。
- **代码质量**: 保持代码整洁，使用注释详细说明复杂的逻辑。
- **UI设计**: 采用 Ant Design Mobile 组件库，确保 UI 一致性和响应式。
- **Solana集成**: 使用提供的 Solana 钱包连接示例代码进行项目集成。

### 注意事项

- 确保 Solana 项目 ID 和元数据正确配置，以保证网络连接的成功。
- 所有网络请求和钱包交互需考虑用户的隐私和数据安全。
- 在开始开发前，请确保所有团队成员对文件结构和功能需求有清晰的理解。