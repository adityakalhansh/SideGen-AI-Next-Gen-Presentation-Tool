<div align="center">
  <h1>✨ SideGen AI</h1>
  <p><strong>Next-Generation AI-Powered Presentation Tool</strong></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a>
  </p>
</div>

---

## 🚀 Overview

**SideGen AI** is a fully automated, full-stack web application that transforms a simple prompt into a complete, professional PowerPoint presentation (`.pptx`). Powered by the lightning-fast **Groq API** (Llama 3.3) for intelligent content generation and **Pollinations.ai** for dynamic, on-the-fly image generation.

Forget spending hours structuring slides and searching for placeholder images. With SideGen AI, you simply type a topic, customize the parameters, review the generated outline, and hit download.

## ✨ Key Features

- **🧠 Intelligent Content Generation**: Leveraging Groq's high-speed inference to structure an entire presentation including introductions, body slides, and conclusions.
- **🎨 Stunning Themes**: Automatically apply curated visual themes (Dark Modern, Minimal White, Gradient Tech, Startup Pitch, Education Classic) directly to your generated `.pptx` file.
- **🖼️ Auto Image Integration**: AI seamlessly generates visually relevant context prompts, which are then used to pull free AI-generated imagery for every slide.
- **⚙️ Deep Customization**:
  - **Content Levels**: Choose between Basic, Standard, and Advanced.
  - **Slide Length**: Select Short (5 slides), Medium (8 slides), or Long (12 slides).
- **📝 Interactive Preview & Editing**: Don't like a bullet point? The interactive glassmorphism UI lets you seamlessly edit titles and bullet points *before* downloading the final file.
- **💡 Smart Topic Suggestions**: Not sure what to present? Click one button to get AI-generated catchy presentation titles.
- **💾 Local History**: Automatically saves your most recent topics so you never lose track of what you were working on.

## 🛠️ Tech Stack

### Frontend
- **HTML5 & CSS3**: Modern glassmorphism UI, animated gradients, and custom responsive layouts.
- **Vanilla JavaScript**: Lightweight, dependency-free interactive logic and API communication.

### Backend
- **Python (Flask)**: A robust, lightweight REST API handling slide logic and file construction.
- **python-pptx**: Constructs the native PowerPoint file, intelligently formats auto-fitting text boxes, and embeds images.
- **Groq API (`llama-3.3-70b-versatile`)**: Ultra-fast Large Language Model integration for JSON-structured outline generation.
- **Pollinations.ai**: Zero-configuration, free AI image fetching.

## 💻 Installation

Follow these steps to run SideGen AI locally on your machine.

### Prerequisites
- Python 3.8+ installed on your system.
- A free API key from [Groq](https://console.groq.com/keys).

### 1. Clone the repository
```bash
git clone https://github.com/adityakalhansh/SideGen-AI-Next-Gen-Presentation-Tool.git
cd SideGen-AI-Next-Gen-Presentation-Tool
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Setup
Rename or create a `.env` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```
*(Note: If you don't provide a key, the app gracefully falls back to dummy data so you can test the UI.)*

### 4. Run the Application
```bash
python app.py
```
Navigate to `http://localhost:5000` in your web browser.

## 🎯 Usage

1. **Enter a Topic**: Type out what you want your presentation to be about (or click "Get Suggestions").
2. **Configure Settings**: Select your target audience Level, desired Length, and preferred visual Theme.
3. **Generate Outline**: Click "Generate Outline" and wait a few seconds while Groq builds your presentation flow.
4. **Review & Edit**: Look through the slide cards on the UI. Tweak titles or rewrite bullet points right in your browser.
5. **Download**: Click "Download PPTX". The backend will rapidly assemble the presentation, generate the images, and download a ready-to-present `.pptx` file directly to your machine!

---

<div align="center">
  <p>Built with ❤️ for rapid knowledge sharing.</p>
</div>
