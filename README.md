# ETL YAML Builder

🚀 **A modern, professional desktop application for building ETL data validation configurations in YAML format.**

![ETL YAML Builder](https://img.shields.io/badge/ETL-YAML%20Builder-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)
![Electron](https://img.shields.io/badge/Electron-38.1.2-47848F?style=flat&logo=electron)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-0081CB?style=flat&logo=mui)

## ✨ Features

### 🎨 **Modern UI Design**
- **Glassmorphism interface** with professional gradients
- **Glowing effects** and smooth animations
- **Responsive design** that adapts to different screen sizes
- **Dark theme** with colorful accent sections

### 📋 **Comprehensive Form Builder**
- **Job Metadata Configuration** - Name, owner, description
- **Source & Target Database Setup** - Server, database, schema, table
- **Advanced Validation Rules** with full form controls:
  - Row Count validation with tolerance settings
  - Row Compare validation with key/compare columns
  - Column Count validation
  - Null Check validation with scope selection
  - Column Value Check validation
  - Duplicate Check validation with grouping options

### 🔧 **Validation Configuration Options**
- **Checkboxes** for boolean settings (enabled, ignore_case, trim_whitespace, etc.)
- **Radio buttons** for scope selection (source/target)
- **Number inputs** with proper validation ranges
- **Text fields** for comma-separated column lists
- **Real-time form validation** and error handling

### 📄 **YAML Management**
- **Live YAML Preview** with syntax highlighting
- **Built-in YAML Editor** with Monaco Editor
- **Bidirectional sync** between form and YAML
- **Download functionality** for generated YAML files
- **Error handling** for invalid YAML syntax

### 💻 **Cross-Platform Desktop App**
- **Windows executable** (.exe installer)
- **macOS application** (.dmg installer)
- **Native desktop experience** with proper window management
- **File menu integration** with keyboard shortcuts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd etl-yaml-builder

# Install dependencies
npm install
```

### Development

```bash
# Start web development server
npm run dev

# Start Electron development
npm run electron
```

### Building Desktop Applications

```bash
# Build for Windows
npm run dist-win

# Build for macOS
npm run dist-mac

# Build for all platforms
npm run dist
```

## 📁 Project Structure

```
etl-yaml-builder/
├── src/
│   ├── components/          # React components
│   │   ├── JobMetadataForm.tsx
│   │   ├── SourceTargetForm.tsx
│   │   ├── ValidationBuilder.tsx
│   │   ├── YamlEditor.tsx
│   │   └── YamlPreview.tsx
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── App.tsx             # Main application component
├── electron/               # Electron main process
│   └── main.cjs
├── public/                 # Static assets
└── release/               # Built applications
```

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1 + TypeScript 5.8.3
- **UI Framework**: Material-UI 7.3.2
- **Build Tool**: Vite 7.1.6
- **Desktop Framework**: Electron 38.1.2
- **Code Editor**: Monaco Editor 4.7.0
- **YAML Processing**: js-yaml 4.1.0
- **Form Handling**: React Hook Form 7.63.0
- **Validation**: Zod 4.1.9

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run electron` | Start Electron development |
| `npm run electron-build` | Build and run Electron |
| `npm run dist-win` | Build Windows installer |
| `npm run dist-mac` | Build macOS installer |
| `npm run dist` | Build for all platforms |
| `npm run lint` | Run ESLint |

## 🎯 Usage

1. **Configure Job Metadata** - Set job name, owner, and description
2. **Setup Source & Target** - Configure database connections
3. **Add Validations** - Choose from 6 validation types with full configuration options
4. **Preview YAML** - See the generated configuration in real-time
5. **Download or Edit** - Export YAML file or make manual edits

## 🔧 Configuration Types

### Validation Rules Supported:
- **Row Count**: Compare row counts between source and target
- **Row Compare**: Compare actual data rows with configurable options
- **Column Count**: Validate expected number of columns
- **Null Check**: Check for null values in specified columns
- **Column Value Check**: Validate specific column values
- **Duplicate Check**: Detect duplicate records with grouping

## 📦 Distribution

Built applications are available in the `release/` directory:
- **Windows**: `ETL YAML Builder Setup 1.0.0.exe`
- **macOS**: `ETL YAML Builder-1.0.0-arm64.dmg`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React and TypeScript
- UI powered by Material-UI
- Desktop functionality via Electron
- Code editing with Monaco Editor
